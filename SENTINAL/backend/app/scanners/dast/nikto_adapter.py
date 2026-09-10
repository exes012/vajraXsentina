import httpx
import re
import json
import shutil
import asyncio
import urllib.parse
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.scanners.base import ScannerAdapter, RawFinding

# Nikto URI Database for Server & Application Probes
NIKTO_SERVER_PROBES = [
    {
        "path": "/phpmyadmin/index.php",
        "title": "Nikto: phpMyAdmin Database Portal Accessible",
        "description": "Publicly accessible phpMyAdmin interface detected. Exposing database administration consoles to the internet increases brute-force and credential stuffing risks.",
        "severity": "HIGH",
        "category": "Sensitive Interface Exposure",
        "cwe": ["CWE-200", "CWE-284"],
        "owasp": ["A01:2021-Broken Access Control"],
        "match_pattern": r'phpMyAdmin|pma_username',
        "remediation": "Restrict phpMyAdmin access to internal VPN/bastion subnets or enforce IP allowlisting.",
        "modes": ["safe", "standard", "deep"]
    },
    {
        "path": "/crossdomain.xml",
        "title": "Nikto: Permissive Flash Cross-Domain Policy (/crossdomain.xml)",
        "description": "The crossdomain.xml file contains a wildcard domain allowance (<allow-access-from domain=\"*\"/>), allowing any third-party domain to read cross-origin response data.",
        "severity": "MEDIUM",
        "category": "Cross-Origin Policy Misconfiguration",
        "cwe": ["CWE-942"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "match_pattern": r'allow-access-from\s+domain=["\']\*["\']',
        "remediation": "Restrict crossdomain.xml allow-access-from domain to trusted partner domains only, or delete if Flash/Silverlight is no longer supported.",
        "modes": ["safe", "standard", "deep"]
    },
    {
        "path": "/clientaccesspolicy.xml",
        "title": "Nikto: Permissive Silverlight Client Access Policy",
        "description": "The clientaccesspolicy.xml file contains wildcard access permissions (<domain uri=\"*\"/>), allowing untrusted origins to access protected services.",
        "severity": "MEDIUM",
        "category": "Cross-Origin Policy Misconfiguration",
        "cwe": ["CWE-942"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "match_pattern": r'<domain\s+uri=["\']\*["\']',
        "remediation": "Restrict clientaccesspolicy.xml domains to trusted origins only.",
        "modes": ["safe", "standard", "deep"]
    },
    {
        "path": "/elmah.axd",
        "title": "Nikto: ELMAH ASP.NET Error Log Dashboard Exposed (/elmah.axd)",
        "description": "Error Logging Modules and Handlers (ELMAH) web dashboard is publicly exposed, disclosing unhandled exceptions, internal file paths, stack traces, and session cookies.",
        "severity": "HIGH",
        "category": "Information Disclosure",
        "cwe": ["CWE-200", "CWE-538"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "match_pattern": r'Error\s+Log\s+for|ELMAH',
        "remediation": "Configure web.config authorization rules for elmah.axd to restrict access to authenticated administrators.",
        "modes": ["standard", "deep"]
    },
    {
        "path": "/.DS_Store",
        "title": "Nikto: macOS Directory Artifact Exposed (/.DS_Store)",
        "description": "The .DS_Store file created by macOS Finder was discovered. Attackers can parse this binary file to enumerate hidden directory contents and file structures.",
        "severity": "LOW",
        "category": "Information Disclosure",
        "cwe": ["CWE-538"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "match_pattern": r'Bud1|\x00\x00\x00\x01Bud2',
        "remediation": "Remove .DS_Store files from web server document roots and add to .gitignore.",
        "modes": ["standard", "deep"]
    },
    {
        "path": "/server-info",
        "title": "Nikto: Apache Server Information Page Exposed (/server-info)",
        "description": "Apache mod_info configuration summary is accessible without authentication, leaking full module lists, virtual host mappings, and compile directives.",
        "severity": "MEDIUM",
        "category": "Information Disclosure",
        "cwe": ["CWE-200"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "match_pattern": r'Apache\s+Server\s+Information',
        "remediation": "Disable mod_info or restrict /server-info to localhost in Apache httpd.conf.",
        "modes": ["standard", "deep"]
    },
    {
        "path": "/cgi-bin/test-cgi",
        "title": "Nikto: Legacy Test CGI Script Exposed (/cgi-bin/test-cgi)",
        "description": "The default test-cgi shell script is accessible and prints environment variables, shell arguments, and server paths.",
        "severity": "MEDIUM",
        "category": "Information Disclosure",
        "cwe": ["CWE-538", "CWE-200"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "match_pattern": r'CGI/1\.0\s+test\s+script',
        "remediation": "Delete default test CGI scripts from the /cgi-bin/ directory.",
        "modes": ["deep"]
    },
    {
        "path": "/web.config",
        "title": "Nikto: IIS web.config Configuration File Exposed",
        "description": "The IIS web.config file is accessible, potentially leaking database connection strings, handlers, and internal routing directives.",
        "severity": "HIGH",
        "category": "Information Disclosure",
        "cwe": ["CWE-552", "CWE-200"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "match_pattern": r'<configuration>|<system\.webServer>',
        "remediation": "Ensure IIS request filtering blocks requests for *.config files.",
        "modes": ["standard", "deep"]
    }
]

# Directory Indexing check candidates
INDEX_CHECK_DIRS = ["/images/", "/static/", "/uploads/", "/assets/", "/backup/", "/temp/", "/css/", "/js/"]

class NiktoAdapter(ScannerAdapter):
    """
    Nikto Web Server & DAST Vulnerability Scanner Adapter
    Source: https://github.com/sullo/nikto
    Cataloged in: https://github.com/paulveillard/cybersecurity-dast
    
    Supports:
    1. Direct Nikto CLI invocation if 'nikto' or 'nikto.pl' is installed in PATH.
    2. Embedded Nikto Engine for dangerous HTTP methods (TRACE/XST, PUT, DELETE),
       server banner disclosures, cookie security flags, directory indexing, and sensitive endpoints.
    """
    __test__ = False

    def __init__(self):
        super().__init__(name="NIKTO", source="DAST")

    def validate(self, target: Any) -> bool:
        if isinstance(target, str):
            return target.startswith("http://") or target.startswith("https://")
        elif isinstance(target, dict):
            return bool(target.get("url"))
        return False

    def prepare(self, target: Any) -> Dict[str, Any]:
        has_cli = bool(shutil.which("nikto") or shutil.which("nikto.pl"))
        if isinstance(target, str):
            url = target
            mode = "standard"
            headers = {}
        else:
            url = target.get("url", "")
            mode = target.get("scan_mode", "standard").lower()
            headers = dict(target.get("custom_headers") or target.get("headers") or {})
            if target.get("auth_cookie") and "Cookie" not in headers:
                headers["Cookie"] = target.get("auth_cookie")
            if target.get("auth_header") and "Authorization" not in headers:
                headers["Authorization"] = target.get("auth_header")
        return {"target_url": url, "scan_mode": mode, "headers": headers, "has_cli": has_cli}

    async def execute(self, target: Any, context: Dict[str, Any]) -> Any:
        target_url = context["target_url"]
        scan_mode = context["scan_mode"]
        headers = context["headers"]
        findings: List[RawFinding] = []

        if not target_url:
            return findings

        # 1. Execute Nikto CLI if installed on the host
        if context["has_cli"]:
            try:
                nikto_bin = shutil.which("nikto") or shutil.which("nikto.pl")
                report_file = Path(f"_nikto_out_{abs(hash(target_url))}.json")
                self.temp_paths.append(report_file)

                cmd = [nikto_bin, "-h", target_url, "-Format", "json", "-o", str(report_file), "-Tuning", "123b", "-timeout", "45"]
                if headers.get("Cookie"):
                    cmd.extend(["-C", f"Cookie={headers['Cookie']}"])
                proc = await asyncio.create_subprocess_exec(
                    *cmd,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                await asyncio.wait_for(proc.communicate(), timeout=90)

                if report_file.exists():
                    raw_content = report_file.read_text(encoding="utf-8", errors="ignore")
                    if raw_content.strip():
                        data = json.loads(raw_content)
                        items = data.get("items", []) or data.get("vulnerabilities", [])
                        for item in items:
                            uri = item.get("uri") or item.get("url") or "/"
                            desc = item.get("description") or item.get("msg") or "Nikto Alert"
                            osvdb = item.get("OSVDB") or item.get("id") or ""
                            
                            sev = "MEDIUM"
                            if any(k in desc.lower() for k in ["critical", "sql injection", "command execution", "remote file"]):
                                sev = "CRITICAL"
                            elif any(k in desc.lower() for k in ["password", "secret", "private key", "database", "admin"]):
                                sev = "HIGH"
                            elif any(k in desc.lower() for k in ["banner", "cookie", "header", "info", "options"]):
                                sev = "LOW"

                            findings.append(RawFinding(
                                scanner="NIKTO",
                                source="DAST",
                                title=f"Nikto: {desc[:80]}",
                                description=f"{desc}\nOSVDB: {osvdb}\nURI: {uri}",
                                severity=sev,
                                confidence="HIGH",
                                category="Web Server Misconfiguration",
                                cwe=["CWE-200", "CWE-16"],
                                endpoint=f"{target_url.rstrip('/')}{uri if uri.startswith('/') else '/' + uri}",
                                evidence=f"Nikto CLI Item {osvdb}: {desc}",
                                remediation="Review web server configuration and apply latest patches.",
                                raw_data=item
                            ))
                        return findings
            except Exception:
                # Fall through to autonomous engine
                pass

        # 2. Autonomous Nikto Engine
        async with httpx.AsyncClient(
            timeout=httpx.Timeout(3.5, connect=2.0),
            verify=False,
            follow_redirects=True,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; Sentinal-Nikto-DAST/2.1)",
                **headers
            }
        ) as client:
            # Step A: Base request & Server Banner analysis
            try:
                base_resp = await client.get(target_url)
                self.record_http_response(base_resp.status_code, target_url)
                self.telemetry["urls_scanned"] = self.telemetry.get("urls_scanned", 0) + 1
                
                # Check Server & Technology Headers
                server_hdr = base_resp.headers.get("Server", "")
                powered_by = base_resp.headers.get("X-Powered-By", "")
                asp_ver = base_resp.headers.get("X-AspNet-Version", "")

                if server_hdr and any(c.isdigit() for c in server_hdr):
                    findings.append(RawFinding(
                        scanner="NIKTO",
                        source="DAST",
                        title=f"Nikto: Web Server Version Banner Disclosure ({server_hdr})",
                        description=f"The web server reveals its specific version information in the 'Server' HTTP header: '{server_hdr}'. Adversaries leverage version details to target unpatched software vulnerabilities.",
                        severity="LOW",
                        confidence="HIGH",
                        category="Information Disclosure",
                        cwe=["CWE-200"],
                        endpoint=target_url,
                        evidence=f"Server: {server_hdr}",
                        remediation="Suppress the Server header banner in web server configuration (e.g., Apache `ServerTokens Prod`, Nginx `server_tokens off`).",
                        raw_data={"header": "Server", "value": server_hdr}
                    ))

                if powered_by:
                    findings.append(RawFinding(
                        scanner="NIKTO",
                        source="DAST",
                        title=f"Nikto: Backend Technology Header Disclosed ({powered_by})",
                        description=f"The application leaks its backend runtime technology in the 'X-Powered-By' header: '{powered_by}'.",
                        severity="LOW",
                        confidence="HIGH",
                        category="Information Disclosure",
                        cwe=["CWE-200"],
                        endpoint=target_url,
                        evidence=f"X-Powered-By: {powered_by}",
                        remediation="Disable X-Powered-By headers in backend application configuration (e.g. Express `app.disable('x-powered-by')`, PHP `expose_php = Off`).",
                        raw_data={"header": "X-Powered-By", "value": powered_by}
                    ))

                if asp_ver:
                    findings.append(RawFinding(
                        scanner="NIKTO",
                        source="DAST",
                        title=f"Nikto: ASP.NET Framework Version Disclosed ({asp_ver})",
                        description=f"The server returns the exact ASP.NET version in the 'X-AspNet-Version' header: '{asp_ver}'.",
                        severity="LOW",
                        confidence="HIGH",
                        category="Information Disclosure",
                        cwe=["CWE-200"],
                        endpoint=target_url,
                        evidence=f"X-AspNet-Version: {asp_ver}",
                        remediation="Add <httpRuntime enableVersionHeader=\"false\" /> inside the <system.web> section of web.config.",
                        raw_data={"header": "X-AspNet-Version", "value": asp_ver}
                    ))

                # Step B: Cookie Security Flags
                for cookie_name, cookie_val in base_resp.cookies.items():
                    raw_cookie_hdr = base_resp.headers.get("Set-Cookie", "")
                    if f"{cookie_name}=" in raw_cookie_hdr:
                        cookie_str = raw_cookie_hdr.lower()
                        if "httponly" not in cookie_str:
                            findings.append(RawFinding(
                                scanner="NIKTO",
                                source="DAST",
                                title=f"Nikto: Cookie Missing 'HttpOnly' Flag ({cookie_name})",
                                description=f"Cookie '{cookie_name}' was set without the 'HttpOnly' attribute, making it accessible to client-side scripts and vulnerable to XSS-based theft.",
                                severity="MEDIUM",
                                confidence="HIGH",
                                category="Insecure Cookie Configuration",
                                cwe=["CWE-1004"],
                                endpoint=target_url,
                                parameter=cookie_name,
                                evidence=f"Set-Cookie: {raw_cookie_hdr[:120]}",
                                remediation=f"Add the 'HttpOnly' flag when generating cookie '{cookie_name}'.",
                                raw_data={"cookie": cookie_name}
                            ))
                        
                        if target_url.startswith("https://") and "secure" not in cookie_str:
                            findings.append(RawFinding(
                                scanner="NIKTO",
                                source="DAST",
                                title=f"Nikto: Cookie Missing 'Secure' Flag on HTTPS ({cookie_name})",
                                description=f"Cookie '{cookie_name}' transmitted over HTTPS without the 'Secure' flag, allowing plaintext transmission if requested over HTTP.",
                                severity="MEDIUM",
                                confidence="HIGH",
                                category="Insecure Cookie Configuration",
                                cwe=["CWE-614"],
                                endpoint=target_url,
                                parameter=cookie_name,
                                evidence=f"Set-Cookie: {raw_cookie_hdr[:120]}",
                                remediation=f"Set the 'Secure' attribute on cookie '{cookie_name}' for all TLS/HTTPS connections.",
                                raw_data={"cookie": cookie_name}
                            ))
            except Exception:
                pass

            # Step C: Dangerous HTTP Methods & TRACE / XST Probes
            try:
                options_resp = await client.options(target_url)
                self.record_http_response(options_resp.status_code, target_url)
                allow_hdr = options_resp.headers.get("Allow", "") or options_resp.headers.get("Public", "")
                
                if allow_hdr:
                    methods = [m.strip().upper() for m in allow_hdr.split(",")]
                    dangerous_methods = [m for m in ["PUT", "DELETE", "TRACE", "TRACK", "CONNECT", "PROPFIND"] if m in methods]
                    if dangerous_methods:
                        findings.append(RawFinding(
                            scanner="NIKTO",
                            source="DAST",
                            title=f"Nikto: Insecure HTTP Methods Enabled ({', '.join(dangerous_methods)})",
                            description=f"The server advertises support for potentially dangerous HTTP methods: {', '.join(dangerous_methods)} via the 'Allow' response header.",
                            severity="MEDIUM" if ("TRACE" in dangerous_methods or "PUT" in dangerous_methods) else "LOW",
                            confidence="HIGH",
                            category="Dangerous HTTP Methods",
                            cwe=["CWE-650", "CWE-16"],
                            endpoint=target_url,
                            evidence=f"Allow: {allow_hdr}",
                            remediation="Disable unnecessary HTTP methods (PUT, DELETE, TRACE, TRACK, PROPFIND) in web server configuration.",
                            raw_data={"allow": allow_hdr, "dangerous": dangerous_methods}
                        ))

                # Direct TRACE Method Probe for Cross-Site Tracing (XST)
                trace_resp = await client.request("TRACE", target_url)
                self.record_http_response(trace_resp.status_code, target_url)
                if trace_resp.status_code == 200 and ("TRACE /" in trace_resp.text or "user-agent:" in trace_resp.text.lower()):
                    findings.append(RawFinding(
                        scanner="NIKTO",
                        source="DAST",
                        title="Nikto: HTTP TRACE Method Enabled (Cross-Site Tracing / XST)",
                        description="The HTTP TRACE method is enabled on the web server. When combined with Cross-Site Scripting (XSS), TRACE allows attackers to read HttpOnly cookies via echoed headers.",
                        severity="MEDIUM",
                        confidence="HIGH",
                        category="Cross-Site Tracing",
                        cwe=["CWE-650", "CWE-200"],
                        endpoint=target_url,
                        evidence="TRACE request returned 200 OK with reflected HTTP request headers in the response body.",
                        remediation="Disable TRACE in web server (e.g. Apache `TraceEnable Off`, Nginx returns 405 by default).",
                        raw_data={"status": trace_resp.status_code}
                    ))
            except Exception:
                pass

            # Step D: Sensitive Server File & Interface Probes (Concurrent with Bounded Semaphore)
            sem = asyncio.Semaphore(8)

            async def run_single_nikto_probe(probe_item: Dict[str, Any]) -> Optional[RawFinding]:
                async with sem:
                    try:
                        probe_url = urllib.parse.urljoin(target_url, probe_item["path"])
                        p_resp = await client.get(probe_url)
                        self.record_http_response(p_resp.status_code, probe_url)
                        self.telemetry["urls_scanned"] = self.telemetry.get("urls_scanned", 0) + 1
                        if p_resp.status_code == 200:
                            pattern = probe_item.get("match_pattern")
                            is_match = False
                            if pattern:
                                if re.search(pattern, p_resp.text, re.IGNORECASE):
                                    is_match = True
                            else:
                                is_match = True

                            if is_match:
                                return RawFinding(
                                    scanner="NIKTO",
                                    source="DAST",
                                    title=probe_item["title"],
                                    description=probe_item["description"],
                                    severity=probe_item["severity"],
                                    confidence="HIGH",
                                    category=probe_item["category"],
                                    cwe=probe_item["cwe"],
                                    owasp=probe_item["owasp"],
                                    endpoint=probe_url,
                                    evidence=f"HTTP {p_resp.status_code} on {probe_item['path']}\nMatched response content signature.",
                                    remediation=probe_item["remediation"],
                                    raw_data={"url": probe_url, "status": p_resp.status_code}
                                )
                    except Exception:
                        pass
                return None

            active_probes = [p for p in NIKTO_SERVER_PROBES if (scan_mode in p["modes"] or scan_mode == "deep")]
            probe_tasks = [run_single_nikto_probe(p) for p in active_probes]
            if probe_tasks:
                probe_results = await asyncio.gather(*probe_tasks, return_exceptions=True)
                for pr in probe_results:
                    if isinstance(pr, RawFinding):
                        findings.append(pr)

            # Step E: Directory Indexing / Browsing Detection (Concurrent)
            if scan_mode in ["standard", "deep"]:
                async def check_single_dir_index(d_path: str) -> Optional[RawFinding]:
                    async with sem:
                        try:
                            dir_url = urllib.parse.urljoin(target_url, d_path)
                            d_resp = await client.get(dir_url)
                            self.record_http_response(d_resp.status_code, dir_url)
                            self.telemetry["urls_scanned"] = self.telemetry.get("urls_scanned", 0) + 1
                            if d_resp.status_code == 200:
                                if re.search(r'<title>Index of\s+|\[To Parent Directory\]|Last modified</a>', d_resp.text, re.IGNORECASE):
                                    return RawFinding(
                                        scanner="NIKTO",
                                        source="DAST",
                                        title=f"Nikto: Directory Indexing / Browsing Enabled ({d_path})",
                                        description=f"Directory listing is enabled on directory '{d_path}'. Attackers can browse and download all files hosted in this directory.",
                                        severity="MEDIUM",
                                        confidence="HIGH",
                                        category="Information Disclosure",
                                        cwe=["CWE-548"],
                                        owasp=["A05:2021-Security Misconfiguration"],
                                        endpoint=dir_url,
                                        evidence=f"Directory index listing confirmed at {dir_url} (HTTP 200).",
                                        remediation=f"Disable directory indexing (e.g. Apache `Options -Indexes`, Nginx `autoindex off;`).",
                                        raw_data={"directory": d_path}
                                    )
                        except Exception:
                            pass
                    return None

                dir_tasks = [check_single_dir_index(dp) for dp in INDEX_CHECK_DIRS]
                if dir_tasks:
                    dir_results = await asyncio.gather(*dir_tasks, return_exceptions=True)
                    for dr in dir_results:
                        if isinstance(dr, RawFinding):
                            findings.append(dr)
                            break

        return findings

    def parse(self, raw_output: Any) -> List[RawFinding]:
        if isinstance(raw_output, list):
            return raw_output
        return []

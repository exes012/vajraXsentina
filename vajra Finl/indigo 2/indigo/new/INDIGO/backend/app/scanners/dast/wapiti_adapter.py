import httpx
import re
import json
import shutil
import asyncio
import urllib.parse
from pathlib import Path
from typing import List, Dict, Any, Optional
from app.scanners.base import ScannerAdapter, RawFinding
from app.scanners.dast.crawler import crawl_target, CrawledEndpoint

WAPITI_TRAVERSAL_PAYLOADS = [
    ("../../../../etc/passwd", r"root:.*:0:0:"),
    ("..\\..\\..\\..\\windows\\win.ini", r"\[fonts\]|\[extensions\]"),
    ("/etc/passwd", r"root:.*:0:0:"),
]

WAPITI_REDIRECT_PAYLOADS = [
    ("https://sentinal-untrusted-redirect.test", "https://sentinal-untrusted-redirect.test"),
    ("//sentinal-untrusted-redirect.test", "sentinal-untrusted-redirect.test"),
    ("javascript:alert(document.domain)", "javascript:alert")
]

class WapitiAdapter(ScannerAdapter):
    """
    Wapiti Secondary DAST Engine
    Official Tool: https://wapiti.sourceforge.io/
    
    Supports:
    1. Wapiti CLI integration if binary is available
    2. Autonomous Secondary DAST Engine for Open Redirect, CRLF, LFI, and Header Injections
    """
    def __init__(self):
        super().__init__(name="WAPITI", source="DAST")

    def validate(self, target: Any) -> bool:
        if isinstance(target, str):
            return target.startswith("http://") or target.startswith("https://")
        elif isinstance(target, dict):
            return bool(target.get("url"))
        return False

    def prepare(self, target: Any) -> Dict[str, Any]:
        has_cli = shutil.which("wapiti") is not None
        if isinstance(target, str):
            url = target
            mode = "standard"
            headers = {}
        else:
            url = target.get("url", "")
            mode = target.get("scan_mode", "standard")
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

        # 1. Run Wapiti CLI if installed on the host
        if context["has_cli"]:
            try:
                report_file = Path(f"_wapiti_out_{hash(target_url)}.json")
                self.temp_paths.append(report_file)
                
                cmd = ["wapiti", "-u", target_url, "-f", "json", "-o", str(report_file), "--flush-session"]
                if scan_mode == "safe":
                    cmd.extend(["-m", "wapp,xss,redirect"])
                
                if headers.get("Cookie"):
                    cmd.extend(["--cookie", headers["Cookie"]])
                for h_name, h_val in headers.items():
                    if h_name.lower() != "cookie":
                        cmd.extend(["--header", f"{h_name}: {h_val}"])
                
                proc = await asyncio.create_subprocess_exec(
                    *cmd,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                await asyncio.wait_for(proc.communicate(), timeout=15.0)

                if report_file.exists():
                    data = json.loads(report_file.read_text(encoding="utf-8", errors="ignore"))
                    vulns = data.get("vulnerabilities", {})
                    for cat_name, items in vulns.items():
                        for item in items:
                            findings.append(RawFinding(
                                scanner="WAPITI",
                                source="DAST",
                                title=f"Wapiti: {cat_name} ({item.get('info', 'Runtime Alert')})",
                                description=item.get("description", f"Vulnerability {cat_name} detected by Wapiti DAST."),
                                severity=item.get("level", "HIGH").upper(),
                                confidence="HIGH",
                                category=cat_name,
                                cwe=[f"CWE-{item.get('cwe', '200')}"],
                                endpoint=item.get("path", target_url),
                                parameter=item.get("parameter", ""),
                                evidence=item.get("http_request", str(item)),
                                remediation=item.get("solution", "Sanitize all user parameters."),
                                references=["https://wapiti-scanner.github.io/"]
                            ))
                    if findings:
                        return findings
            except Exception:
                pass

        # 2. Autonomous High-Fidelity Wapiti Engine Execution
        max_crawl_pages = 10 if scan_mode == "deep" else (6 if scan_mode == "standard" else 3)
        endpoints = await crawl_target(target_url, max_pages=max_crawl_pages, custom_headers=headers, status_callback=self.record_http_response)
        if not endpoints:
            endpoints = [CrawledEndpoint(url=target_url, method="GET", params=[])]

        if not any(e.url == target_url for e in endpoints):
            endpoints.insert(0, CrawledEndpoint(url=target_url, method="GET", params=[]))

        self.telemetry["urls_discovered"] = len(endpoints)
        self.telemetry["urls_scanned"] = len(endpoints)

        async with httpx.AsyncClient(headers=headers, timeout=httpx.Timeout(3.0, connect=2.0), follow_redirects=False, verify=False) as client:
            # Check HTTP TRACE method (XST)
            try:
                resp_trace = await client.request("TRACE", target_url)
                self.record_http_response(resp_trace.status_code, target_url)
                allow_header = resp_trace.headers.get("allow", "")
                if resp_trace.status_code == 200 or "TRACE" in allow_header:
                    findings.append(RawFinding(
                        scanner="WAPITI",
                        source="DAST",
                        title="Wapiti: HTTP TRACE / TRACK Method Enabled (Cross-Site Tracing)",
                        description="The web server permits HTTP TRACE requests, allowing adversaries to harvest sensitive session cookies even if HttpOnly is enabled (XST).",
                        severity="MEDIUM",
                        confidence="HIGH",
                        category="Insecure HTTP Configuration",
                        cwe=["CWE-16", "CWE-693"],
                        owasp=["A05:2021-Security Misconfiguration"],
                        endpoint="/",
                        evidence=f"Allow Header: {allow_header}",
                        remediation="Disable HTTP TRACE and TRACK methods in web server configuration.",
                        references=["https://owasp.org/www-community/attacks/Cross_Site_Tracing"]
                    ))
            except Exception:
                pass

            # Fuzz crawled endpoints for Open Redirect, CRLF, Path Traversal
            for ep in endpoints:
                parsed = urllib.parse.urlparse(ep.url)
                params = urllib.parse.parse_qs(parsed.query)

                for param_name in params:
                    # --- A. Open Redirect Fuzzing ---
                    for red_payload, expected in WAPITI_REDIRECT_PAYLOADS:
                        test_params = params.copy()
                        test_params[param_name] = [red_payload]
                        new_q = urllib.parse.urlencode(test_params, doseq=True)
                        probe_url = urllib.parse.urlunparse(parsed._replace(query=new_q))

                        try:
                            resp = await client.get(probe_url)
                            self.record_http_response(resp.status_code, probe_url)
                            loc = resp.headers.get("location", "")
                            if resp.status_code in [301, 302, 303, 307, 308] and expected in loc:
                                findings.append(RawFinding(
                                    scanner="WAPITI",
                                    source="DAST",
                                    title=f"Wapiti: Open URL Redirection on Parameter '{param_name}'",
                                    description=f"Endpoint redirects user agents to untrusted external destination '{loc}' specified in query parameter '{param_name}'.",
                                    severity="MEDIUM",
                                    confidence="HIGH",
                                    category="Unvalidated Redirects",
                                    cwe=["CWE-601"],
                                    owasp=["A01:2021-Broken Access Control"],
                                    endpoint=parsed.path or "/",
                                    parameter=param_name,
                                    evidence=f"GET {probe_url} -> HTTP {resp.status_code}\nLocation: {loc}",
                                    remediation="Validate redirection targets against a strict server-side whitelist of relative paths or trusted domains.",
                                    references=["https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html"]
                                ))
                                break
                        except Exception:
                            pass

                    # --- B. CRLF / HTTP Response Splitting Fuzzing ---
                    crlf_payload = "%0d%0aSet-Cookie:%20wapiti_crlf_flag=1"
                    test_params = params.copy()
                    test_params[param_name] = [crlf_payload]
                    new_q = urllib.parse.urlencode(test_params, doseq=True)
                    probe_url = urllib.parse.urlunparse(parsed._replace(query=new_q))

                    try:
                        resp = await client.get(probe_url)
                        self.record_http_response(resp.status_code, probe_url)
                        cookies_str = str(resp.headers.get_list("set-cookie") if hasattr(resp.headers, "get_list") else resp.headers.get("set-cookie", ""))
                        if "wapiti_crlf_flag" in cookies_str or "wapiti_crlf_flag" in resp.headers:
                            findings.append(RawFinding(
                                scanner="WAPITI",
                                source="DAST",
                                title=f"Wapiti: HTTP Response Splitting / CRLF Injection on Parameter '{param_name}'",
                                description=f"Unsanitized Carriage Return and Line Feed characters injected via '{param_name}' allow arbitrary header injection.",
                                severity="HIGH",
                                confidence="HIGH",
                                category="CRLF Injection",
                                cwe=["CWE-113"],
                                owasp=["A03:2021-Injection"],
                                endpoint=parsed.path or "/",
                                parameter=param_name,
                                evidence=f"Set-Cookie header reflected injected cookie: {cookies_str}",
                                remediation="Strip CR (%0D) and LF (%0A) characters before placing user inputs into HTTP response headers.",
                                references=["https://owasp.org/www-community/vulnerabilities/CRLF_Injection"]
                            ))
                    except Exception:
                        pass

                    # --- C. Path Traversal Fuzzing (Standard / Deep modes) ---
                    if scan_mode in ["standard", "deep"]:
                        for trav_payload, pat in WAPITI_TRAVERSAL_PAYLOADS:
                            test_params = params.copy()
                            test_params[param_name] = [trav_payload]
                            new_q = urllib.parse.urlencode(test_params, doseq=True)
                            probe_url = urllib.parse.urlunparse(parsed._replace(query=new_q))

                            try:
                                resp = await client.get(probe_url)
                                self.record_http_response(resp.status_code, probe_url)
                                if re.search(pat, resp.text):
                                    findings.append(RawFinding(
                                        scanner="WAPITI",
                                        source="DAST",
                                        title=f"Wapiti: Directory / Path Traversal on Parameter '{param_name}'",
                                        description=f"File path traversal payload successfully read system file contents via parameter '{param_name}'.",
                                        severity="CRITICAL",
                                        confidence="HIGH",
                                        category="Path Traversal",
                                        cwe=["CWE-22"],
                                        owasp=["A01:2021-Broken Access Control"],
                                        endpoint=parsed.path or "/",
                                        parameter=param_name,
                                        evidence=f"Injected '{trav_payload}' returned matching system file pattern: {pat}",
                                        remediation="Sanitize file paths, disallow `../` sequences, or use safe file lookup mappings.",
                                        references=["https://owasp.org/www-community/attacks/Path_Traversal"]
                                    ))
                                    break
                            except Exception:
                                pass

        return findings

    def parse(self, raw_output: Any) -> List[RawFinding]:
        if isinstance(raw_output, list):
            return raw_output
        return []

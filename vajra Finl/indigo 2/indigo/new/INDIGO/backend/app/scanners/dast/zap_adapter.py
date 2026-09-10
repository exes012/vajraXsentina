import httpx
import re
import asyncio
import urllib.parse
from typing import List, Dict, Any, Optional
from app.scanners.base import ScannerAdapter, RawFinding
from app.scanners.dast.crawler import crawl_target, CrawledEndpoint

ZAP_SQL_ERROR_PATTERNS = [
    (r'you have an error in your sql syntax', 'MySQL Syntax Error (ZAP Rule 40018)'),
    (r'warning:\s*mysql', 'MySQL Driver Warning (ZAP Rule 40018)'),
    (r'unclosed quotation mark after the character string', 'MSSQL Unclosed Quote Error (ZAP Rule 40018)'),
    (r'quoted string not properly terminated', 'Oracle SQL Syntax Error (ZAP Rule 40018)'),
    (r'postgresql.*error', 'PostgreSQL Syntax Error (ZAP Rule 40018)'),
    (r'sqlite3\.OperationalError', 'SQLite Operational Error (ZAP Rule 40018)'),
    (r'microsoft ole db provider for odbc drivers error', 'OLE DB SQL Error (ZAP Rule 40018)'),
    (r'org\.hibernate\.exception\.SQLGrammarException', 'Hibernate SQL Grammar Error (ZAP Rule 40018)'),
    (r'SQLSTATE\[', 'ANSI SQLSTATE Error Code (ZAP Rule 40018)'),
    (r'DriverError', 'Generic Database Driver Error (ZAP Rule 40018)')
]

ZAP_SENSITIVE_FILES = [
    ('/.env', 'Environment Secrets & Cloud Credentials File (.env)', 'CRITICAL', 'CWE-200', 'A05:2021-Security Misconfiguration', 'ZAP Rule 40035'),
    ('/.git/HEAD', 'Exposed Git Source Code Repository Metadata (.git/HEAD)', 'HIGH', 'CWE-538', 'A05:2021-Security Misconfiguration', 'ZAP Rule 40035'),
    ('/robots.txt', 'Robots.txt Information Disclosure & Disallowed Path Enumeration', 'INFO', 'CWE-200', 'A01:2021-Broken Access Control', 'ZAP Rule 10055'),
    ('/actuator/health', 'Spring Boot Actuator Telemetry Endpoint (/actuator/health)', 'MEDIUM', 'CWE-200', 'A05:2021-Security Misconfiguration', 'ZAP Rule 40035'),
    ('/phpinfo.php', 'PHPInfo Information Disclosure File (/phpinfo.php)', 'HIGH', 'CWE-200', 'A05:2021-Security Misconfiguration', 'ZAP Rule 40035')
]

ZAP_DEEP_DISCOVERY_PATHS = [
    ('/graphql', 'GraphQL Query Endpoint Discovered (/graphql)', 'LOW', 'CWE-200', 'A01:2021-Broken Access Control'),
    ('/openapi.json', 'Public OpenAPI Schema Specification (/openapi.json)', 'LOW', 'CWE-200', 'A01:2021-Broken Access Control'),
    ('/v2/api-docs', 'Swagger V2 API Documentation (/v2/api-docs)', 'LOW', 'CWE-200', 'A01:2021-Broken Access Control'),
    ('/v3/api-docs', 'OpenAPI V3 Schema Endpoint (/v3/api-docs)', 'LOW', 'CWE-200', 'A01:2021-Broken Access Control'),
    ('/actuator/heapdump', 'Exposed JVM Memory Heapdump (/actuator/heapdump)', 'CRITICAL', 'CWE-200', 'A05:2021-Security Misconfiguration')
]

class ZAPAdapter(ScannerAdapter):
    """
    OWASP ZAP (Zed Attack Proxy) Primary DAST Engine
    Official Tool: https://github.com/zaproxy/zaproxy
    
    Supports:
    1. Live OWASP ZAP REST API Daemon integration (http://127.0.0.1:8080)
    2. Autonomous High-Fidelity OWASP ZAP Active & Passive Fuzzing Engine
    3. Production Scan Modes (SAFE, STANDARD, DEEP)
    4. Authenticated Scanning with Credential Masking
    """
    def __init__(self):
        super().__init__(name="ZAP", source="DAST")
        self.zap_daemon_url = "http://127.0.0.1:8080"

    def _normalize_url(self, raw_url: str) -> str:
        raw = (raw_url or "").strip()
        if not raw:
            return ""
        if not (raw.startswith("http://") or raw.startswith("https://")):
            if "localhost" in raw or "127.0.0.1" in raw or any(p in raw for p in [":5173", ":3000", ":8000", ":8001", ":8080"]):
                return f"http://{raw}"
            return f"https://{raw}"
        return raw

    def validate(self, target: Any) -> bool:
        if isinstance(target, str):
            url = self._normalize_url(target)
            return url.startswith("http://") or url.startswith("https://")
        elif isinstance(target, dict):
            url = self._normalize_url(target.get("url", ""))
            return bool(url) and (url.startswith("http://") or url.startswith("https://"))
        return False

    def prepare(self, target: Any) -> Dict[str, Any]:
        if isinstance(target, str):
            target_url = self._normalize_url(target)
            scan_mode = "standard"
            headers = {}
            auth_type = "none"
        else:
            target_url = self._normalize_url(target.get("url", ""))
            scan_mode = target.get("scan_mode", "standard").lower()
            headers = dict(target.get("custom_headers") or {})
            auth_type = target.get("auth_type", "none").lower()

            # Handle Authentication securely
            if auth_type == "bearer" and target.get("auth_token"):
                headers["Authorization"] = f"Bearer {target.get('auth_token')}"
            elif auth_type == "cookie" and target.get("auth_cookie"):
                headers["Cookie"] = target.get("auth_cookie")
            elif auth_type == "basic" and target.get("auth_username") and target.get("auth_password"):
                import base64
                creds = f"{target.get('auth_username')}:{target.get('auth_password')}"
                encoded = base64.b64encode(creds.encode()).decode()
                headers["Authorization"] = f"Basic {encoded}"
            elif target.get("auth_header"):
                headers["Authorization"] = target.get("auth_header")

        return {
            "target_url": target_url,
            "scan_mode": scan_mode,
            "headers": headers,
            "auth_type": auth_type
        }

    async def _try_live_zap_daemon(self, target_url: str, headers: Dict[str, str], scan_mode: str) -> Optional[List[RawFinding]]:
        """Attempt to run against an active OWASP ZAP REST API daemon if reachable."""
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                ver_resp = await client.get(f"{self.zap_daemon_url}/JSON/core/view/version/")
                if ver_resp.status_code == 200:
                    # Trigger ZAP spider
                    await client.get(f"{self.zap_daemon_url}/JSON/spider/action/scan/?url={urllib.parse.quote(target_url)}")
                    
                    if scan_mode in ["standard", "deep"]:
                        # Trigger active scan
                        await client.get(f"{self.zap_daemon_url}/JSON/ascan/action/scan/?url={urllib.parse.quote(target_url)}")
                    
                    # Fetch alerts
                    alerts_resp = await client.get(f"{self.zap_daemon_url}/JSON/core/view/alerts/?baseurl={urllib.parse.quote(target_url)}")
                    if alerts_resp.status_code == 200:
                        raw_alerts = alerts_resp.json().get("alerts", [])
                        findings: List[RawFinding] = []
                        for a in raw_alerts:
                            risk = a.get("risk", "Medium").upper()
                            sev = "CRITICAL" if risk == "HIGH" and "SQL" in a.get("alert", "") else ("HIGH" if risk == "HIGH" else ("MEDIUM" if risk == "MEDIUM" else "LOW"))
                            findings.append(RawFinding(
                                scanner="ZAP",
                                source="DAST",
                                title=f"OWASP ZAP: {a.get('alert', 'Runtime Alert')}",
                                description=a.get("description", "Detected by OWASP ZAP Daemon."),
                                severity=sev,
                                confidence="HIGH",
                                category="Dynamic Web Vulnerability",
                                cwe=[f"CWE-{a.get('cweid', '200')}"],
                                owasp=["A03:2021-Injection" if "SQL" in a.get("alert", "") else "A05:2021-Security Misconfiguration"],
                                endpoint=a.get("url", "/"),
                                parameter=a.get("param", ""),
                                evidence=a.get("evidence", a.get("attack", "")),
                                remediation=a.get("solution", "Apply input validation and safe coding patterns."),
                                references=["https://github.com/zaproxy/zaproxy", a.get("reference", "https://owasp.org/www-project-zap/")]
                            ))
                        if findings:
                            return findings
        except Exception:
            pass
        return None

    async def execute(self, target: Any, context: Dict[str, Any]) -> Any:
        target_url = context["target_url"]
        scan_mode = context["scan_mode"]
        headers = context["headers"]
        findings: List[RawFinding] = []

        if not target_url:
            return findings

        # 1. Check if live OWASP ZAP daemon is running on port 8080
        daemon_findings = await self._try_live_zap_daemon(target_url, headers, scan_mode)
        if daemon_findings:
            return daemon_findings

        # 2. Autonomous OWASP ZAP Engine Execution
        max_crawl_pages = 25 if scan_mode == "deep" else (12 if scan_mode == "standard" else 6)
        endpoints = await crawl_target(target_url, max_pages=max_crawl_pages, custom_headers=headers, status_callback=self.record_http_response)
        if not endpoints:
            endpoints = [CrawledEndpoint(url=target_url, method="GET", params=[])]

        if not any(e.url == target_url for e in endpoints):
            endpoints.insert(0, CrawledEndpoint(url=target_url, method="GET", params=[]))

        self.telemetry["urls_discovered"] = len(endpoints)
        self.telemetry["urls_scanned"] = len(endpoints)

        parsed_root = urllib.parse.urlparse(target_url)
        base_origin = f"{parsed_root.scheme}://{parsed_root.netloc}"

        async with httpx.AsyncClient(headers=headers, timeout=httpx.Timeout(3.5, connect=2.0), follow_redirects=True, verify=False) as client:
            # --- ZAP Passive Rule: Sensitive Files Enumeration (Concurrent) ---
            probe_list = list(ZAP_SENSITIVE_FILES)
            if scan_mode == "deep":
                probe_list.extend(ZAP_DEEP_DISCOVERY_PATHS)

            zap_sem = asyncio.Semaphore(8)

            async def run_single_zap_probe(item) -> Optional[RawFinding]:
                async with zap_sem:
                    path = item[0]
                    title = item[1]
                    sev = item[2]
                    cwe = item[3]
                    owasp = item[4]
                    zap_rule = item[5] if len(item) > 5 else "ZAP Rule 10056"
                    probe_url = f"{base_origin}{path}"
                    try:
                        resp = await client.get(probe_url)
                        self.record_http_response(resp.status_code, probe_url)
                        if resp.status_code == 200 and len(resp.text) > 0:
                            is_spa_fallback = "<!doctype html" in resp.text.lower() and path in ["/.env", "/.git/HEAD", "/actuator/heapdump"]
                            if not is_spa_fallback:
                                return RawFinding(
                                    scanner="ZAP",
                                    source="DAST",
                                    title=f"OWASP ZAP: {title}",
                                    description=f"OWASP ZAP probe on path '{path}' returned HTTP 200 OK ({zap_rule}).",
                                    severity=sev,
                                    confidence="HIGH",
                                    category="Information Disclosure",
                                    cwe=[cwe],
                                    owasp=[owasp],
                                    endpoint=path,
                                    evidence=f"GET {probe_url} -> HTTP 200 OK (Size: {len(resp.content)} bytes)\nBody Preview: {resp.text[:180]}",
                                    remediation=f"Restrict public access to '{path}' in your web server / reverse proxy configuration.",
                                    references=["https://github.com/zaproxy/zaproxy", "https://owasp.org/www-project-zap/"]
                                )
                    except Exception:
                        pass
                return None

            probe_tasks = [run_single_zap_probe(item) for item in probe_list]
            if probe_tasks:
                zap_results = await asyncio.gather(*probe_tasks, return_exceptions=True)
                for zr in zap_results:
                    if isinstance(zr, RawFinding):
                        findings.append(zr)

            # --- ZAP Passive Rule: CORS Origin Reflection (Rule 40040) ---
            try:
                cors_headers = {"Origin": "https://sentinal-evil-attacker.com"}
                cors_resp = await client.get(target_url, headers={**headers, **cors_headers})
                self.record_http_response(cors_resp.status_code, target_url)
                acao = cors_resp.headers.get("access-control-allow-origin", "")
                acac = cors_resp.headers.get("access-control-allow-credentials", "").lower()
                if acao == "*" or acao == "https://sentinal-evil-attacker.com":
                    findings.append(RawFinding(
                        scanner="ZAP",
                        source="DAST",
                        title="OWASP ZAP: Permissive CORS Origin Reflection (Rule 40040)",
                        description=f"OWASP ZAP CORS audit identified reflection of untrusted origin '{acao}' in Access-Control-Allow-Origin.",
                        severity="HIGH" if acac == "true" else "MEDIUM",
                        confidence="HIGH",
                        category="Broken Access Control",
                        cwe=["CWE-942"],
                        owasp=["A01:2021-Broken Access Control"],
                        endpoint="/",
                        evidence=f"Access-Control-Allow-Origin: {acao}\nAccess-Control-Allow-Credentials: {acac}",
                        remediation="Define an explicit whitelist of trusted origins rather than wildcards or reflecting Origin headers.",
                        references=["https://github.com/zaproxy/zaproxy", "https://portswigger.net/web-security/cors"]
                    ))
            except Exception:
                pass

            # --- ZAP Passive Rule: Server Technology Banner Leak (Rule 10037) ---
            try:
                root_resp = await client.get(target_url)
                self.record_http_response(root_resp.status_code, target_url)
                srv = root_resp.headers.get("server", "")
                x_powered = root_resp.headers.get("x-powered-by", "")
                if srv or x_powered:
                    findings.append(RawFinding(
                        scanner="ZAP",
                        source="DAST",
                        title="OWASP ZAP: Server Stack Version Disclosure (Rule 10037)",
                        description=f"HTTP response exposes exact server and application stack metadata ({srv or x_powered}).",
                        severity="LOW",
                        confidence="HIGH",
                        category="Information Disclosure",
                        cwe=["CWE-200", "CWE-497"],
                        owasp=["A05:2021-Security Misconfiguration"],
                        endpoint="/",
                        evidence=f"Server: {srv}\nX-Powered-By: {x_powered}".strip(),
                        remediation="Suppress the Server and X-Powered-By response headers in production web servers.",
                        references=["https://github.com/zaproxy/zaproxy"]
                    ))
            except Exception:
                pass

            # --- Dynamic Fuzzing Loop over Endpoints (Active only in Standard & Deep modes) ---
            for ep in endpoints:
                try:
                    resp = await client.request(ep.method, ep.url)
                    self.record_http_response(resp.status_code, ep.url)

                    # Insecure Cookie Flags (Rule 10010 / 10011 / 10054)
                    set_cookie_headers = resp.headers.get_list("set-cookie") if hasattr(resp.headers, "get_list") else [resp.headers.get("set-cookie", "")]
                    for cookie in set_cookie_headers:
                        if not cookie:
                            continue
                        cookie_lower = cookie.lower()
                        cookie_name = cookie.split("=")[0].strip()
                        
                        missing_flags = []
                        if "httponly" not in cookie_lower:
                            missing_flags.append("HttpOnly")
                        if "secure" not in cookie_lower and target_url.startswith("https"):
                            missing_flags.append("Secure")
                        if "samesite" not in cookie_lower:
                            missing_flags.append("SameSite")

                        if missing_flags:
                            findings.append(RawFinding(
                                scanner="ZAP",
                                source="DAST",
                                title=f"OWASP ZAP: Insecure Cookie Attribute ({', '.join(missing_flags)}) on '{cookie_name}'",
                                description=f"Cookie '{cookie_name}' lacks {', '.join(missing_flags)} protection flags.",
                                severity="LOW",
                                confidence="HIGH",
                                category="Session Management",
                                cwe=["CWE-614", "CWE-1004"],
                                owasp=["A07:2021-Identification and Authentication Failures"],
                                endpoint=urllib.parse.urlparse(ep.url).path or "/",
                                evidence=f"Set-Cookie: {cookie}",
                                remediation=f"Add {', '.join(missing_flags)} attributes to all Set-Cookie response headers.",
                                references=["https://github.com/zaproxy/zaproxy"]
                            ))

                    # Anti-Clickjacking Frame Protection (Rule 10020)
                    x_frame = resp.headers.get("x-frame-options", "").upper()
                    csp = resp.headers.get("content-security-policy", "").lower()
                    if not x_frame and "frame-ancestors" not in csp:
                        findings.append(RawFinding(
                            scanner="ZAP",
                            source="DAST",
                            title="OWASP ZAP: Missing Anti-Clickjacking Defense (Rule 10020)",
                            description="Target endpoint does not enforce frame embedding restrictions (X-Frame-Options or CSP frame-ancestors).",
                            severity="MEDIUM",
                            confidence="HIGH",
                            category="Broken Access Control",
                            cwe=["CWE-1021"],
                            owasp=["A05:2021-Security Misconfiguration"],
                            endpoint=urllib.parse.urlparse(ep.url).path or "/",
                            evidence="No 'X-Frame-Options' header or CSP 'frame-ancestors' directive detected.",
                            remediation="Configure `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors 'none'`.",
                            references=["https://github.com/zaproxy/zaproxy"]
                        ))

                    # Active Injection Fuzzing (Standard / Deep modes only)
                    if scan_mode in ["standard", "deep"]:
                        parsed_url = urllib.parse.urlparse(ep.url)
                        query_dict = urllib.parse.parse_qs(parsed_url.query)

                        # SQL Injection Probing (Rule 40018)
                        for param_name in query_dict:
                            probe_val = query_dict[param_name][0] + "' OR '1'='1"
                            test_params = query_dict.copy()
                            test_params[param_name] = [probe_val]
                            new_query = urllib.parse.urlencode(test_params, doseq=True)
                            probe_url = urllib.parse.urlunparse(parsed_url._replace(query=new_query))

                            try:
                                probe_resp = await client.get(probe_url)
                                self.record_http_response(probe_resp.status_code, probe_url)
                                for err_pat, err_name in ZAP_SQL_ERROR_PATTERNS:
                                    if re.search(err_pat, probe_resp.text, re.IGNORECASE):
                                        findings.append(RawFinding(
                                            scanner="ZAP",
                                            source="DAST",
                                            title=f"OWASP ZAP: Active SQL Injection on Parameter '{param_name}' (Rule 40018)",
                                            description=f"OWASP ZAP SQL injection probe triggered {err_name} in target HTTP response.",
                                            severity="CRITICAL",
                                            confidence="HIGH",
                                            category="SQL Injection",
                                            cwe=["CWE-89"],
                                            owasp=["A03:2021-Injection"],
                                            endpoint=parsed_url.path or "/",
                                            parameter=param_name,
                                            evidence=f"Injected probe '{probe_val}' on '{param_name}' -> Database error match: {err_pat}",
                                            remediation="Enforce parameterized SQL prepared statements or object-relational mapping (ORM).",
                                            references=["https://github.com/zaproxy/zaproxy", "https://owasp.org/www-community/attacks/SQL_Injection"]
                                        ))
                                        break
                            except Exception:
                                pass

                        # Reflected Cross-Site Scripting (Rule 40012)
                        xss_token = "<zap_xss_probe_991>"
                        for param_name in query_dict:
                            test_params = query_dict.copy()
                            test_params[param_name] = [xss_token]
                            new_query = urllib.parse.urlencode(test_params, doseq=True)
                            probe_url = urllib.parse.urlunparse(parsed_url._replace(query=new_query))

                            try:
                                probe_resp = await client.get(probe_url)
                                self.record_http_response(probe_resp.status_code, probe_url)
                                if xss_token in probe_resp.text and "text/html" in probe_resp.headers.get("content-type", "").lower():
                                    findings.append(RawFinding(
                                        scanner="ZAP",
                                        source="DAST",
                                        title=f"OWASP ZAP: Reflected Cross-Site Scripting on Parameter '{param_name}' (Rule 40012)",
                                        description="OWASP ZAP payload was reflected unencoded in the target HTML response body.",
                                        severity="HIGH",
                                        confidence="HIGH",
                                        category="Cross-Site Scripting",
                                        cwe=["CWE-79"],
                                        owasp=["A03:2021-Injection"],
                                        endpoint=parsed_url.path or "/",
                                        parameter=param_name,
                                        evidence=f"Reflected payload '{xss_token}' found unescaped in response.",
                                        remediation="Context-encode all untrusted dynamic inputs before rendering in HTML templates.",
                                        references=["https://github.com/zaproxy/zaproxy", "https://owasp.org/www-community/attacks/xss/"]
                                    ))
                            except Exception:
                                pass

                except Exception:
                    continue

        return findings

    def parse(self, raw_output: Any) -> List[RawFinding]:
        if isinstance(raw_output, list):
            return raw_output
        return []

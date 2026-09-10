import time
import socket
import urllib.parse
from typing import List, Dict, Any, Optional
import httpx
from bs4 import BeautifulSoup

from app.scanners.base import ScannerAdapter, RawFinding
from app.scanners.web.tech_detector import detect_technologies
from app.scanners.ssl.cert_analyzer import inspect_tls_certificate
from app.core.ssrf import normalize_target_url, validate_ssrf_safety

class HTTPDiscoveryAdapter(ScannerAdapter):
    """
    Target Discovery & HTTP Fingerprinting Engine
    Performs:
    - DNS resolution & reverse DNS
    - HTTP/HTTPS reachability & redirect detection
    - Response time measurement
    - Title, Content-Type, Server Banner extraction
    - Technology stack detection
    - Edge WAF & Anti-Bot protection detection
    """
    def __init__(self):
        super().__init__(name="http-discovery", source="WEB")

    def validate(self, target: Any) -> bool:
        if isinstance(target, str):
            return target.startswith("http://") or target.startswith("https://")
        elif isinstance(target, dict):
            return bool(target.get("url"))
        return False

    def prepare(self, target: Any) -> Dict[str, Any]:
        if isinstance(target, str):
            url = target
            headers = {}
        else:
            url = target.get("url", "")
            headers = target.get("custom_headers") or {}
            if target.get("auth_header"):
                headers["Authorization"] = target.get("auth_header")
        return {"target_url": url, "headers": headers}

    async def execute(self, target: Any, context: Dict[str, Any]) -> Any:
        target_url = context["target_url"]
        headers = context["headers"]

        norm_url, hostname, port, protocol = normalize_target_url(target_url)

        # 1. SSRF & DNS check
        is_safe, ssrf_err, resolved_ips = validate_ssrf_safety(hostname, port)
        if not is_safe:
            raise ValueError(f"Target validation failed: {ssrf_err}")

        discovery_data: Dict[str, Any] = {
            "url": norm_url,
            "hostname": hostname,
            "port": port,
            "protocol": protocol,
            "resolved_ips": resolved_ips,
            "status_code": None,
            "response_time_ms": 0,
            "title": "",
            "content_type": "",
            "server": "",
            "technologies": [],
            "redirects": [],
            "headers": {},
            "reachable": False,
            "tls_reachable": False,
            "cert_issuer": None,
            "cert_subject": None,
            "error": None
        }

        # 2. HTTP Probing
        start_t = time.time()
        try:
            async with httpx.AsyncClient(headers=headers, timeout=10.0, follow_redirects=True, verify=False) as client:
                resp = await client.get(norm_url)
                duration_ms = int((time.time() - start_t) * 1000)

                self.record_http_response(resp.status_code, norm_url)
                self.telemetry["urls_scanned"] = self.telemetry.get("urls_scanned", 0) + 1

                discovery_data["reachable"] = True
                discovery_data["status_code"] = resp.status_code
                discovery_data["response_time_ms"] = duration_ms
                discovery_data["content_type"] = resp.headers.get("content-type", "")
                discovery_data["server"] = resp.headers.get("server", "")
                discovery_data["headers"] = dict(resp.headers)

                # Redirect chain
                if resp.history:
                    discovery_data["redirects"] = [str(r.url) for r in resp.history] + [str(resp.url)]

                # Extract HTML Title
                try:
                    if "text/html" in resp.headers.get("content-type", "").lower() and resp.text:
                        soup = BeautifulSoup(resp.text[:50000], "html.parser")
                        title_tag = soup.find("title")
                        if title_tag and title_tag.string:
                            discovery_data["title"] = title_tag.string.strip()
                except Exception:
                    pass

                # Detect Technologies
                tech_res = await detect_technologies(norm_url, headers=headers)
                tech_list = []
                for cat in ["frameworks", "servers", "languages"]:
                    tech_list.extend(tech_res.get(cat, []))
                discovery_data["technologies"] = list(dict.fromkeys(tech_list))

        except Exception as e:
            discovery_data["reachable"] = False
            discovery_data["error"] = str(e)
            
            # Check if TLS handshake succeeds (indicates WAF/Anti-Bot dropping HTTP streams)
            try:
                cert_info = inspect_tls_certificate(hostname, port if port else 443, timeout=5.0)
                if not cert_info.get("error") and cert_info.get("is_tls"):
                    discovery_data["tls_reachable"] = True
                    subject_dict = cert_info.get("subject") or {}
                    issuer_dict = cert_info.get("issuer") or {}
                    discovery_data["cert_subject"] = subject_dict.get("commonName") or str(subject_dict)
                    discovery_data["cert_issuer"] = issuer_dict.get("organizationName") or issuer_dict.get("commonName") or str(issuer_dict)
            except Exception:
                discovery_data["tls_reachable"] = False

        return discovery_data

    def parse(self, raw_output: Any) -> List[RawFinding]:
        findings: List[RawFinding] = []
        if isinstance(raw_output, dict):
            if not raw_output.get("reachable"):
                if raw_output.get("tls_reachable"):
                    findings.append(RawFinding(
                        scanner="DISCOVERY",
                        source="WEB",
                        title=f"WAF / Anti-Bot Mitigation Dropping Automated Probes ({raw_output.get('hostname')})",
                        description=(
                            f"The target host completed the TLS handshake (Subject: '{raw_output.get('cert_subject')}', "
                            f"Issuer: '{raw_output.get('cert_issuer')}'), but subsequent automated HTTP requests were dropped or timed out "
                            f"by an edge Web Application Firewall (WAF) or Bot Management system ({raw_output.get('error')}).\n\n"
                            "Because the edge security layer blackholes/drops automated scanner traffic, dynamic scanners "
                            "(ZAP, Nuclei, Wapiti, Nikto) were unable to receive HTTP response payloads from the web application."
                        ),
                        severity="MEDIUM",
                        confidence="HIGH",
                        category="WAF / Anti-Automation Protection",
                        cwe=["CWE-693"],
                        endpoint=raw_output.get("url"),
                        evidence=f"TLS Connection: SUCCESS ({raw_output.get('cert_issuer')})\nHTTP Stream Result: {raw_output.get('error')}\nResolved IPs: {', '.join(raw_output.get('resolved_ips', []))}",
                        remediation="To assess applications behind WAF/Anti-Bot protection: (1) Provide authenticated session cookies/tokens via the Authenticated Scan options, (2) Allowlist the Sentina scanner IP in the WAF / CDN management console, or (3) Point the assessment to the direct origin/staging endpoint."
                    ))
                else:
                    findings.append(RawFinding(
                        scanner="DISCOVERY",
                        source="WEB",
                        title="Target Host Unreachable",
                        description=f"Sentina Discovery Worker was unable to establish an HTTP connection with {raw_output.get('url')}: {raw_output.get('error', 'Connection timed out')}",
                        severity="HIGH",
                        confidence="HIGH",
                        category="Network Availability",
                        cwe=["CWE-693"],
                        endpoint=raw_output.get("url"),
                        evidence=str(raw_output.get("error", "No response received")),
                        remediation="Verify target DNS, firewall ingress rules, and that the web service is actively running."
                    ))
        return findings


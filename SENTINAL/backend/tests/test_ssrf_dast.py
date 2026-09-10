import pytest
from app.core.ssrf import normalize_target_url, validate_ssrf_safety, safe_command_args
from app.scanners.web.discovery import HTTPDiscoveryAdapter
from app.scanners.web.headers_adapter import SecurityHeadersAdapter
from app.scanners.ssl.testssl_adapter import TestSSLAdapter
from app.scanners.dast.wapiti_adapter import WapitiAdapter
from app.scanners.dast.zap_adapter import ZAPAdapter
from app.scanners.web.nuclei_adapter import NucleiAdapter
from app.pipeline.deduplicator import deduplicate_findings
from app.pipeline.normalizer import normalize_raw_finding
from app.scanners.base import RawFinding

def test_url_normalization_and_ssrf():
    # Valid HTTPS production URLs
    url, host, port, proto = normalize_target_url("https://app.example.com/api/v1")
    assert "https://app.example.com" in url
    assert host == "app.example.com"
    assert port == 443
    assert proto == "https"

    # Valid with custom port
    url2, host2, port2, proto2 = normalize_target_url("http://test.example.com:8080/path")
    assert "8080" in url2
    assert host2 == "test.example.com"
    assert port2 == 8080
    assert proto2 == "http"

    # Disallow invalid schemes
    with pytest.raises(ValueError):
        normalize_target_url("ftp://example.com")

    with pytest.raises(ValueError):
        normalize_target_url("file:///etc/passwd")

def test_safe_cli_args():
    target = "https://app.example.com"
    args = safe_command_args("zap.sh", "-cmd", "-quickurl", target, "-quickout", "report.json")
    assert args == ["zap.sh", "-cmd", "-quickurl", "https://app.example.com", "-quickout", "report.json"]

def test_http_discovery_scanner():
    discovery = HTTPDiscoveryAdapter()
    assert discovery.name in ["DISCOVERY", "http-discovery"]
    assert discovery.source == "WEB"

def test_wapiti_adapter_structure():
    wapiti = WapitiAdapter()
    assert wapiti.name == "WAPITI"
    assert wapiti.source == "DAST"

def test_headers_and_ssl_adapters():
    headers = SecurityHeadersAdapter()
    assert headers.name == "HEADER_ANALYZER"

    ssl_adapter = TestSSLAdapter()
    assert ssl_adapter.name == "TESTSSL"

def test_deduplicator_with_multi_scanners():
    raw1 = RawFinding(
        source="DAST",
        scanner="ZAP",
        title="SQL Injection in /api/login",
        description="SQL injection in username parameter",
        severity="CRITICAL",
        confidence="HIGH",
        endpoint="/api/login",
        parameter="username",
        cwe=["CWE-89"],
        evidence="Found SELECT * FROM users WHERE user='admin'--"
    )

    raw2 = RawFinding(
        source="WEB",
        scanner="NUCLEI",
        title="SQL Injection Vulnerability",
        description="Blind SQL injection verified via response delay",
        severity="HIGH",
        confidence="HIGH",
        endpoint="/api/login",
        parameter="username",
        cwe=["CWE-89"],
        evidence="Nuclei template: sql-injection matched on username"
    )

    f1 = normalize_raw_finding(raw1)
    f2 = normalize_raw_finding(raw2)

    deduped = deduplicate_findings([f1, f2])

    assert len(deduped) == 1
    merged = deduped[0]
    assert merged.severity == "CRITICAL"
    assert "ZAP" in merged.all_scanners
    assert "NUCLEI" in merged.all_scanners
    assert "Nuclei template" in merged.evidence

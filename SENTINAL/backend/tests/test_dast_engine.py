import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from app.scanners.dast.crawler import crawl_target, CrawledEndpoint
from app.scanners.dast.zap_adapter import ZAPAdapter
from app.scanners.web.headers_adapter import SecurityHeadersAdapter
from app.core.ssrf import normalize_target_url, validate_ssrf_safety

def test_dast_target_url_normalization():
    norm, host, port, proto = normalize_target_url("http://localhost:8000/app")
    assert norm == "http://localhost:8000/app"
    assert host == "localhost"
    assert port == 8000
    assert proto == "http"

    norm2, host2, port2, proto2 = normalize_target_url("https://example.com:8443")
    assert norm2 == "https://example.com:8443"
    assert host2 == "example.com"
    assert port2 == 8443
    assert proto2 == "https"

    # Non-HTTP protocol should raise ValueError
    with pytest.raises(ValueError):
        normalize_target_url("ftp://example.com")

def test_dast_ssrf_safety_validation():
    # Public domain should pass
    is_safe, err, ips = validate_ssrf_safety("google.com", 443)
    assert is_safe is True

@pytest.mark.asyncio
async def test_security_headers_adapter_detection():
    adapter = SecurityHeadersAdapter()
    assert adapter.validate("http://example.com") is True

    # Mock an HTTP response missing HSTS, CSP, and X-Frame-Options
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.headers = {
        "content-type": "text/html",
        "server": "Apache/2.4.41 (Ubuntu)"
    }
    mock_resp.text = "<html><body>Hello</body></html>"

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_resp
        context = adapter.prepare("http://example.com")
        findings = await adapter.execute("http://example.com", context)

        titles = [f.title for f in findings]
        assert any("Content Security Policy" in t for t in titles)
        assert any("X-Frame-Options" in t for t in titles)
        assert any("X-Content-Type-Options" in t for t in titles)

@pytest.mark.asyncio
async def test_zap_adapter_passive_cookie_and_banner_checks():
    adapter = ZAPAdapter()
    assert adapter.validate("http://example.com") is True

    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.headers = {
        "content-type": "text/html",
        "server": "nginx/1.18.0",
        "x-powered-by": "PHP/7.4.3",
        "set-cookie": "session_id=abc12345; Path=/"  # Missing HttpOnly, Secure, SameSite
    }
    mock_resp.text = "<html><body>Test Page</body></html>"
    mock_resp.content = b"<html><body>Test Page</body></html>"

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get, \
         patch("httpx.AsyncClient.request", new_callable=AsyncMock) as mock_req, \
         patch("app.scanners.dast.zap_adapter.crawl_target", new_callable=AsyncMock) as mock_crawl:

        mock_get.return_value = mock_resp
        mock_req.return_value = mock_resp
        mock_crawl.return_value = [CrawledEndpoint(url="http://example.com", method="GET")]

        context = adapter.prepare({"url": "http://example.com", "scan_mode": "safe"})
        findings = await adapter.execute("http://example.com", context)

        titles = [f.title for f in findings]
        assert any("Insecure Cookie Attribute" in t for t in titles)
        assert any("Server Stack Version Disclosure" in t for t in titles)

@pytest.mark.asyncio
async def test_zap_adapter_active_sqli_probing():
    adapter = ZAPAdapter()

    # Mock SQL syntax error response on injected parameter
    mock_sqli_resp = MagicMock()
    mock_sqli_resp.status_code = 500
    mock_sqli_resp.headers = {"content-type": "text/html"}
    mock_sqli_resp.text = "Fatal Error: You have an error in your SQL syntax near '1'='1' at line 1"

    with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get, \
         patch("httpx.AsyncClient.request", new_callable=AsyncMock) as mock_req, \
         patch("app.scanners.dast.zap_adapter.crawl_target", new_callable=AsyncMock) as mock_crawl:

        mock_get.return_value = mock_sqli_resp
        mock_req.return_value = mock_sqli_resp
        mock_crawl.return_value = [CrawledEndpoint(url="http://example.com/search?q=test", method="GET", params=["q"])]

        context = adapter.prepare({"url": "http://example.com/search?q=test", "scan_mode": "standard"})
        findings = await adapter.execute("http://example.com/search?q=test", context)

        sqli_findings = [f for f in findings if "Active SQL Injection" in f.title]
        assert len(sqli_findings) >= 1
        assert "CWE-89" in sqli_findings[0].cwe
        assert sqli_findings[0].severity == "CRITICAL"
        assert sqli_findings[0].parameter == "q"

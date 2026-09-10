import pytest
import httpx
from unittest.mock import AsyncMock, patch, MagicMock
from app.scanners.dast.nikto_adapter import NiktoAdapter
from app.scanners.base import RawFinding

@pytest.mark.asyncio
async def test_nikto_adapter_validation_and_prepare():
    adapter = NiktoAdapter()
    
    # Validation tests
    assert adapter.validate("http://example.com") is True
    assert adapter.validate("https://example.com") is True
    assert adapter.validate({"url": "https://example.com"}) is True
    assert adapter.validate("ftp://example.com") is False
    assert adapter.validate(None) is False

    # Prepare tests
    prep_str = adapter.prepare("https://test.local")
    assert prep_str["target_url"] == "https://test.local"
    assert prep_str["scan_mode"] == "standard"

    prep_dict = adapter.prepare({
        "url": "https://test.local",
        "scan_mode": "deep",
        "auth_header": "Bearer test-token"
    })
    assert prep_dict["target_url"] == "https://test.local"
    assert prep_dict["scan_mode"] == "deep"
    assert prep_dict["headers"]["Authorization"] == "Bearer test-token"

@pytest.mark.asyncio
async def test_nikto_adapter_autonomous_detection():
    adapter = NiktoAdapter()
    context = {
        "target_url": "https://test-server.local",
        "scan_mode": "standard",
        "headers": {},
        "has_cli": False
    }

    # Mock HTTP client responses
    async def mock_send(request, **kwargs):
        req_url = str(request.url)
        method = request.method

        if method == "OPTIONS":
            return httpx.Response(
                200,
                headers={"Allow": "GET, POST, OPTIONS, TRACE, PUT, DELETE"},
                request=request
            )
        elif method == "TRACE":
            return httpx.Response(
                200,
                text="TRACE / HTTP/1.1\r\nUser-Agent: Nikto\r\nHost: test-server.local",
                headers={"Content-Type": "message/http"},
                request=request
            )
        elif "/phpmyadmin" in req_url:
            return httpx.Response(
                200,
                text="<html><title>phpMyAdmin</title><body><input name='pma_username'></body></html>",
                request=request
            )
        elif "/uploads/" in req_url:
            return httpx.Response(
                200,
                text="<html><head><title>Index of /uploads/</title></head><body><h1>Index of /uploads/</h1></body></html>",
                request=request
            )
        elif req_url.rstrip("/") == "https://test-server.local":
            return httpx.Response(
                200,
                text="<html><body>Welcome</body></html>",
                headers={
                    "Server": "Apache/2.4.49 (Unix)",
                    "X-Powered-By": "PHP/7.4.3",
                    "Set-Cookie": "sess_token=abc12345; Path=/"
                },
                request=request
            )
        return httpx.Response(404, request=request)

    transport = httpx.MockTransport(mock_send)
    _real_async_client = httpx.AsyncClient
    def client_factory(*args, **kwargs):
        kwargs.pop("verify", None)
        kwargs["transport"] = transport
        return _real_async_client(*args, **kwargs)

    with patch("httpx.AsyncClient", side_effect=client_factory):
        result = await adapter.run("https://test-server.local")

    assert result.status == "SUCCESS"
    assert len(result.findings) > 0
    
    titles = [f.title for f in result.findings]
    assert any("Server Version Banner" in t for t in titles)
    assert any("Backend Technology Header" in t for t in titles)
    assert any("HttpOnly" in t for t in titles)
    assert any("Insecure HTTP Methods Enabled" in t for t in titles)
    assert any("phpMyAdmin" in t for t in titles)
    assert any("Directory Indexing" in t for t in titles)

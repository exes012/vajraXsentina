import pytest
import asyncio
from app.scanners.web.diagnostics import DASTConnectivityDiagnostics, dast_diagnostics
from app.scanners.runner import ScannerOrchestrator
from app.scanners.base import ScannerResult, RawFinding

@pytest.mark.asyncio
async def test_diagnostics_dns_resolution():
    diag = DASTConnectivityDiagnostics()
    res = await diag._check_dns("localhost")
    assert res["status"] == "SUCCESS"
    assert len(res["resolved_ips"]) > 0

@pytest.mark.asyncio
async def test_diagnostics_tcp_connection_failure():
    diag = DASTConnectivityDiagnostics()
    # Test closed/unbound port
    res = await diag._check_tcp("127.0.0.1", 59999)
    assert res["status"] in ["FAILED", "TIMED_OUT"]

def test_waf_detection_cloudflare():
    diag = DASTConnectivityDiagnostics()
    mock_http_res = {
        "server_header": "cloudflare",
        "raw_headers": {
            "server": "cloudflare",
            "cf-ray": "8bf12903abc8-SIN",
            "cf-cache-status": "DYNAMIC"
        },
        "cookies": ["__cf_bm"],
        "body_snippet": "<html><head><title>Attention Required! | Cloudflare</title></head><body><div class='challenge-platform'></div></body></html>",
        "status_code": 403
    }
    waf = diag._detect_waf(mock_http_res)
    assert waf["detected"] is True
    assert waf["provider"] == "Cloudflare"
    assert waf["confidence"] in ["HIGH", "MEDIUM"]
    assert len(waf["evidence"]) > 0

def test_waf_detection_akamai():
    diag = DASTConnectivityDiagnostics()
    mock_http_res = {
        "server_header": "AkamaiGHost",
        "raw_headers": {
            "server": "AkamaiGHost",
            "x-akamai-transformed": "9 - 0 pmb=mRUM,1",
            "x-akamai-request-id": "19b88a"
        },
        "cookies": ["_abck", "bm_sz"],
        "body_snippet": "<html><body>Akamai Bot Manager Interstitial</body></html>",
        "status_code": 403
    }
    waf = diag._detect_waf(mock_http_res)
    assert waf["detected"] is True
    assert waf["provider"] == "Akamai"
    assert waf["confidence"] in ["HIGH", "MEDIUM"]

def test_waf_detection_aws():
    diag = DASTConnectivityDiagnostics()
    mock_http_res = {
        "server_header": "CloudFront",
        "raw_headers": {
            "server": "CloudFront",
            "x-amzn-waf-action": "block",
            "x-amz-cf-id": "Abc123xyz=="
        },
        "cookies": ["aws-waf-token"],
        "body_snippet": "<html><body>AWS WAF Blocked</body></html>",
        "status_code": 403
    }
    waf = diag._detect_waf(mock_http_res)
    assert waf["detected"] is True
    assert "AWS WAF" in waf["provider"]

def test_captcha_detection():
    diag = DASTConnectivityDiagnostics()
    mock_http_res = {
        "body_snippet": "<html><body><script src='https://challenges.cloudflare.com/turnstile/v0/api.js'></script><div class='cf-challenge'></div></body></html>"
    }
    cap = diag._detect_captcha(mock_http_res)
    assert cap["detected"] is True
    assert any("Turnstile" in c for c in cap["challenges"])

def test_rate_limit_detection():
    diag = DASTConnectivityDiagnostics()
    mock_http_res = {
        "status_code": 429,
        "raw_headers": {
            "retry-after": "120",
            "x-ratelimit-remaining": "0"
        }
    }
    rl = diag._analyze_rate_limits(mock_http_res)
    assert rl["rate_limited_on_probe"] is True
    assert rl["retry_after"] == "120"
    assert "x-ratelimit-remaining" in rl["rate_limit_headers"]

def test_auth_requirement_detection():
    diag = DASTConnectivityDiagnostics()
    mock_http_res = {
        "status_code": 401,
        "raw_headers": {
            "www-authenticate": "Bearer realm='Sentina Protected Area'"
        },
        "body_snippet": "",
        "final_url": "https://example.com/api"
    }
    auth = diag._analyze_auth_requirement(mock_http_res)
    assert auth["auth_required"] is True
    assert auth["auth_mechanism"] == "HTTP_BASIC_OR_BEARER"

def test_orchestrator_telemetry_aggregation():
    orchestrator = ScannerOrchestrator()
    
    zap_res = ScannerResult(
        scanner_name="ZAP",
        source="DAST",
        status="SUCCESS",
        duration_ms=500,
        findings=[
            RawFinding(
                scanner="ZAP",
                source="DAST",
                title="XSS",
                description="Reflected XSS",
                severity="HIGH"
            )
        ],
        metadata={
            "telemetry": {
                "requests_attempted": 100,
                "requests_successful": 80,
                "requests_blocked": 20,
                "status_distribution": {"200": 70, "301": 10, "403": 15, "429": 5},
                "urls_discovered": 12,
                "urls_scanned": 12
            }
        }
    )

    nuclei_res = ScannerResult(
        scanner_name="NUCLEI",
        source="WEB",
        status="SUCCESS",
        duration_ms=300,
        findings=[],
        metadata={
            "telemetry": {
                "requests_attempted": 50,
                "requests_successful": 45,
                "requests_blocked": 5,
                "status_distribution": {"200": 45, "403": 5},
                "urls_discovered": 6,
                "urls_scanned": 6
            }
        }
    )

    telem = orchestrator.aggregate_dast_telemetry([zap_res, nuclei_res])
    assert telem["requests_attempted"] == 150
    assert telem["requests_successful"] == 125
    assert telem["requests_blocked"] == 25
    assert telem["count_2xx"] == 115
    assert telem["count_3xx"] == 10
    assert telem["count_403"] == 20
    assert telem["count_429"] == 5
    assert telem["zap_alerts"] == 1
    assert telem["nuclei_matches"] == 0
    assert telem["crawlable_urls"] == 12
    assert telem["urls_scanned"] == 18

import pytest
from app.workers.failure_classifier import classify_assessment_failure

def test_classify_ssrf_failure():
    err = ValueError("SSRF Protection triggered: Target resolved to private IP 127.0.0.1")
    res = classify_assessment_failure(err, stage="TARGET VALIDATION", target_info={"url": "http://127.0.0.1:8080"})
    assert res["category"] == "SSRF_PROTECTION_BLOCKED"
    assert res["error_code"] == "ERR_SSRF_SAFETY_VIOLATION"
    assert "SSRF Protection Filter" in res["title"]
    assert "RFC1918" in res["technical_details"]
    assert len(res["remediation"]) > 0

def test_classify_target_unverified_failure():
    err = ValueError("TARGET NOT VERIFIED: Verify this asset before starting an active assessment.")
    res = classify_assessment_failure(err, stage="TARGET VALIDATION", target_info={"url": "https://external-target.com"})
    assert res["category"] == "TARGET_NOT_VERIFIED"
    assert res["error_code"] == "ERR_TARGET_UNVERIFIED"
    assert "Authorization Required" in res["title"]

def test_classify_prerequisites_missing_failure():
    err = ValueError("Target Production URL is compulsory for Combined assessments.")
    res = classify_assessment_failure(err, stage="PREREQUISITE VERIFICATION")
    assert res["category"] == "PREREQUISITES_MISSING"
    assert res["error_code"] == "ERR_PREREQUISITES_INCOMPLETE"

def test_classify_git_download_failure():
    err = RuntimeError("Could not download remote repository archive: GitHub returned HTTP 404")
    res = classify_assessment_failure(err, stage="CLONING", repo_info={"url": "https://github.com/invalid/repo"})
    assert res["category"] == "INVALID_REPOSITORY"
    assert res["error_code"] == "ERR_GIT_DOWNLOAD_FAILED"
    assert "Personal Access Token" in res["remediation"]

def test_classify_waf_403_failure():
    err = RuntimeError("Target scanner probes received 403 Forbidden from Cloudflare")
    diag = {
        "checks": {
            "4_http_status": {"initial_status_code": 403},
            "9_waf_indicators": {"detected": True, "provider": "Cloudflare", "confidence": "HIGH"}
        }
    }
    res = classify_assessment_failure(err, stage="CONNECTIVITY DIAGNOSTICS", diag_result=diag)
    assert res["category"] == "WAF_ACCESS_DENIED"
    assert res["error_code"] == "ERR_WAF_BLOCK_403"
    assert "Cloudflare" in res["title"]
    assert "allowlist" in res["remediation"].lower()

def test_classify_auth_401_failure():
    err = RuntimeError("Target returned HTTP 401 Unauthorized barrier")
    diag = {
        "checks": {
            "4_http_status": {"initial_status_code": 401},
            "11_authentication_requirement": {"detected": True, "type": "Session Cookie"}
        }
    }
    res = classify_assessment_failure(err, stage="CONNECTIVITY DIAGNOSTICS", diag_result=diag)
    assert res["category"] == "AUTHENTICATION_REQUIRED"
    assert res["error_code"] == "ERR_AUTH_REQUIRED_401"
    assert "Cookie" in res["remediation"]

def test_classify_dns_unreachable_failure():
    err = RuntimeError("Target DNS resolution failed for hostname unknown.example.invalid")
    diag = {
        "checks": {
            "1_dns_resolution": {"status": "FAILED", "error": "NXDOMAIN"}
        }
    }
    res = classify_assessment_failure(err, stage="CONNECTIVITY DIAGNOSTICS", diag_result=diag)
    assert res["category"] == "TARGET_UNREACHABLE"
    assert res["error_code"] == "ERR_DNS_TCP_UNREACHABLE"
    assert "DNS" in res["technical_details"]

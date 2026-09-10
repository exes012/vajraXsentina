import pytest
from app.scanners.base import RawFinding
from app.pipeline.normalizer import normalize_raw_finding
from app.pipeline.risk_engine import (
    derive_threat_context,
    calculate_finding_intermediate_risk,
    apply_risk_scoring
)

def test_threat_context_sqli():
    f = normalize_raw_finding(RawFinding(
        scanner="owasp-zap",
        source="DAST",
        title="SQL Injection on login endpoint",
        description="SQL syntax error induced by single quote.",
        severity="CRITICAL",
        endpoint="/api/v1/auth/login",
        parameter="username",
        cwe=["CWE-89"]
    ))
    threat = derive_threat_context(f)
    assert "Database Takeover" in threat["blast_radius"]
    assert "bypass authentication" in threat["threat_scenario"]
    assert "confidentiality" in threat["potential_impact"]
    assert "CRITICAL" in threat["potential_impact"]["confidentiality"]
    assert threat["exploitability_weight"] >= 1.2

def test_threat_context_rce():
    f = normalize_raw_finding(RawFinding(
        scanner="semgrep",
        source="SAST",
        title="Remote Code Execution via os.system",
        description="User input directly passed to shell execution sink.",
        severity="CRITICAL",
        file="backend/server.py",
        line=104,
        cwe=["CWE-78"]
    ))
    threat = derive_threat_context(f)
    assert "Full Server Takeover" in threat["blast_radius"]
    assert "reverse shells" in threat["threat_scenario"]
    assert "integrity" in threat["potential_impact"]
    assert threat["exploitability_weight"] >= 1.25

def test_threat_context_xss():
    f = normalize_raw_finding(RawFinding(
        scanner="owasp-zap",
        source="DAST",
        title="Reflected Cross-Site Scripting (XSS)",
        description="Payload reflected in search response.",
        severity="HIGH",
        endpoint="/search",
        parameter="q",
        cwe=["CWE-79"]
    ))
    threat = derive_threat_context(f)
    assert "Session Hijacking" in threat["blast_radius"]
    assert "session tokens" in threat["threat_scenario"]
    assert "HIGH" in threat["potential_impact"]["confidentiality"]

def test_threat_context_ssrf():
    f = normalize_raw_finding(RawFinding(
        scanner="nuclei",
        source="DAST",
        title="Server-Side Request Forgery",
        description="Coerced outbound HTTP request to cloud metadata.",
        severity="CRITICAL",
        endpoint="/proxy",
        parameter="url",
        cwe=["CWE-918"]
    ))
    threat = derive_threat_context(f)
    assert "Cloud Metadata Exposure" in threat["blast_radius"]
    assert "169.254.169.254" in threat["threat_scenario"]
    assert "CRITICAL" in threat["potential_impact"]["confidentiality"]

def test_threat_context_secrets():
    f = normalize_raw_finding(RawFinding(
        scanner="trufflehog",
        source="SECRETS",
        title="AWS Secret Access Key Discovered",
        description="High entropy token found in source code.",
        severity="HIGH",
        file=".env.prod",
        line=12,
        cwe=["CWE-798"]
    ))
    threat = derive_threat_context(f)
    assert "Credential Compromise" in threat["blast_radius"]
    assert "third-party" in threat["threat_scenario"].lower() or "cloud" in threat["threat_scenario"].lower()

def test_intermediate_risk_calculation():
    f = normalize_raw_finding(RawFinding(
        scanner="owasp-zap",
        source="DAST",
        title="SQL Injection on login endpoint",
        description="SQL injection confirmed.",
        severity="CRITICAL",
        confidence="HIGH",
        endpoint="/api/v1/login",
        parameter="user",
        cwe=["CWE-89"]
    ))
    calc = calculate_finding_intermediate_risk(f, is_correlated=True, asset_criticality="PRODUCTION")
    
    assert calc["risk_score"] > 80.0
    assert calc["cvss_equivalent"] >= 8.0
    assert calc["rating"] == "CRITICAL"
    assert calc["risk_factors"]["exposure_multiplier"] > 1.0  # Endpoint + Param + DAST boost
    assert calc["risk_factors"]["correlation_bonus"] == 10.0
    assert "Database" in calc["blast_radius"]

def test_apply_risk_scoring_to_findings():
    f1 = normalize_raw_finding(RawFinding(
        scanner="owasp-zap",
        source="DAST",
        title="SQL Injection",
        description="SQLi vulnerability",
        severity="HIGH",
        endpoint="/api/search",
        parameter="term",
        cwe=["CWE-89"]
    ))
    f2 = normalize_raw_finding(RawFinding(
        scanner="nuclei",
        source="DAST",
        title="Missing X-Frame-Options",
        description="Clickjacking defense missing",
        severity="LOW",
        endpoint="/index.html",
        cwe=["CWE-1021"]
    ))

    overall_score = apply_risk_scoring([f1, f2], [], asset_criticality="PRODUCTION")
    assert overall_score > 0.0
    assert f1.threat_scenario is not None
    assert f1.blast_radius is not None
    assert f1.potential_impact is not None
    assert f1.risk_factors is not None
    assert f1.risk_score > f2.risk_score

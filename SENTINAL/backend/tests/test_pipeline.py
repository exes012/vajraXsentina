import pytest
from app.scanners.base import RawFinding
from app.pipeline.normalizer import normalize_raw_finding, normalize_findings_list
from app.pipeline.deduplicator import deduplicate_findings
from app.pipeline.correlator import correlate_findings
from app.pipeline.risk_engine import apply_risk_scoring

def test_normalization_and_deduplication():
    f1 = RawFinding(
        scanner="nuclei",
        source="WEB",
        title="Missing CSP Header",
        description="CSP header is missing.",
        severity="MEDIUM",
        endpoint="/login",
        cwe=["CWE-79"]
    )
    f2 = RawFinding(
        scanner="owasp-zap",
        source="DAST",
        title="Missing Content-Security-Policy",
        description="The CSP header was not returned.",
        severity="MEDIUM",
        endpoint="/login",
        cwe=["CWE-79"]
    )

    norm_list = normalize_findings_list([f1, f2])
    assert len(norm_list) == 2

    deduped = deduplicate_findings(norm_list)
    assert len(deduped) == 1
    assert "nuclei" in deduped[0].all_scanners
    assert "owasp-zap" in deduped[0].all_scanners

def test_correlation_engine():
    sast_sqli = RawFinding(
        scanner="semgrep",
        source="SAST",
        title="SQL Injection in login query",
        description="Unparameterized query detected.",
        severity="HIGH",
        file="src/auth.py",
        line=42,
        parameter="username",
        cwe=["CWE-89"]
    )
    dast_sqli = RawFinding(
        scanner="owasp-zap",
        source="DAST",
        title="Active SQL Injection on /api/login",
        description="Injected single quote caused syntax error.",
        severity="CRITICAL",
        endpoint="/api/login",
        parameter="username",
        cwe=["CWE-89"]
    )
    sca_driver = RawFinding(
        scanner="osv-scanner",
        source="SCA",
        title="Vulnerable Dependency: mysql-connector",
        description="CVE-2021-1234 in MySQL driver.",
        severity="HIGH",
        file="package.json"
    )

    norm_list = normalize_findings_list([sast_sqli, dast_sqli, sca_driver])
    correlated = correlate_findings(norm_list)
    
    assert len(correlated) >= 1
    assert any("SQL Injection" in cr.title for cr in correlated)
    assert correlated[0].risk_level == "CRITICAL"

def test_risk_scoring():
    norm = normalize_raw_finding(RawFinding(
        scanner="test",
        source="DAST",
        title="Critical Vulnerability",
        description="High impact issue",
        severity="CRITICAL",
        confidence="HIGH",
        endpoint="/admin"
    ))
    score = apply_risk_scoring([norm], [])
    assert score > 70.0
    assert norm.risk_score > 80.0

import pytest
from app.scanners.base import RawFinding
from app.pipeline.normalizer import normalize_raw_finding, normalize_findings_list, NormalizedFinding
from app.pipeline.deduplicator import deduplicate_findings
from app.pipeline.correlator import correlate_findings
from app.pipeline.risk_engine import apply_risk_scoring

def test_finding_normalization_schema():
    raw = RawFinding(
        scanner="sentinal-sast",
        source="SAST",
        title="SQL Injection in Database Query",
        description="Dynamic string formatting in query execution sink.",
        severity="HIGH",
        confidence="HIGH",
        category="SQL Injection",
        cwe=["CWE-89"],
        cves=[],
        owasp=["A03:2021-Injection"],
        file="controllers/user.py",
        line=42,
        code_snippet="42: cursor.execute(f'SELECT * FROM users WHERE id = {user_id}')",
        evidence="Matched f-string query at line 42",
        remediation="Use parameterized query placeholders.",
        references=["https://cwe.mitre.org/data/definitions/89.html"],
        raw_data={"rule_id": "py-sql-injection-dynamic-query"}
    )

    norm = normalize_raw_finding(raw)
    assert norm.engine == "SAST"
    assert norm.severity == "HIGH"
    assert norm.confidence == "HIGH"
    assert norm.status == "OPEN"
    assert norm.location == "controllers/user.py:42"
    assert norm.cwe == ["CWE-89"]
    assert norm.owasp == ["A03:2021-Injection"]
    assert "controllers/user.py:42" in norm.location
    assert norm.evidence is not None
    assert norm.fingerprint is not None

def test_deduplication_multi_scanner_merge():
    finding1 = NormalizedFinding(
        source="SAST",
        scanner="semgrep",
        all_scanners=["semgrep"],
        title="SQL Injection Vulnerability",
        description="Semgrep identified SQL injection.",
        severity="MEDIUM",
        confidence="MEDIUM",
        category="SQL Injection",
        cwe=["CWE-89"],
        file="app/login.py",
        line=15,
        fingerprint="fp-login-sqli-123",
        evidence="Semgrep rule match: sql_inject_rule"
    )

    finding2 = NormalizedFinding(
        source="SAST",
        scanner="sentinal-sast",
        all_scanners=["sentinal-sast"],
        title="SQL Injection via Dynamic Query",
        description="Native SAST detected unparameterized SQL execution sink.",
        severity="HIGH",
        confidence="HIGH",
        category="SQL Injection",
        cwe=["CWE-89"],
        file="app/login.py",
        line=15,
        fingerprint="fp-login-sqli-123",
        evidence="Native pattern match: cursor.execute(query)"
    )

    deduped = deduplicate_findings([finding1, finding2])
    assert len(deduped) == 1
    merged = deduped[0]
    assert "semgrep" in merged.all_scanners
    assert "sentinal-sast" in merged.all_scanners
    assert merged.severity == "HIGH"
    assert merged.confidence == "HIGH"
    assert "Semgrep" in merged.evidence or "Native" in merged.evidence

def test_cross_engine_correlation_sqli():
    sast_sqli = NormalizedFinding(
        source="SAST",
        scanner="sentinal-sast",
        title="SQL Injection in auth_controller.py",
        description="Dynamic string formatting in user lookup.",
        severity="HIGH",
        confidence="HIGH",
        category="SQL Injection",
        cwe=["CWE-89"],
        file="controllers/auth.py",
        line=25,
        fingerprint="fp-sast-sqli-456",
        evidence="cursor.execute(f'SELECT * FROM users WHERE user = {username}')"
    )

    dast_sqli = NormalizedFinding(
        source="DAST",
        scanner="ZAP",
        title="OWASP ZAP: Active SQL Injection on Parameter 'username'",
        description="SQL syntax error returned during parameter fuzzing.",
        severity="CRITICAL",
        confidence="HIGH",
        category="SQL Injection",
        cwe=["CWE-89"],
        endpoint="/api/login",
        parameter="username",
        fingerprint="fp-dast-sqli-789",
        evidence="Injected probe ' OR '1'='1 -> MySQL Syntax Error"
    )

    correlated = correlate_findings([sast_sqli, dast_sqli])
    assert len(correlated) >= 1
    corr = correlated[0]
    assert "Confirmed End-to-End SQL Injection" in corr.title
    assert corr.risk_level == "CRITICAL"
    assert corr.confidence == "VERY HIGH"
    assert sast_sqli.fingerprint in corr.sast_finding_ids
    assert dast_sqli.fingerprint in corr.dast_finding_ids
    assert "source code" in corr.explanation.lower()

def test_cross_engine_correlation_xss():
    sast_xss = NormalizedFinding(
        source="SAST",
        scanner="sentinal-sast",
        title="Cross-Site Scripting (XSS) via innerHTML",
        description="Direct unescaped assignment to innerHTML.",
        severity="HIGH",
        confidence="HIGH",
        category="Cross-Site Scripting",
        cwe=["CWE-79"],
        file="static/js/profile.js",
        line=10,
        fingerprint="fp-sast-xss-111",
        evidence="element.innerHTML = userBio"
    )

    dast_xss = NormalizedFinding(
        source="DAST",
        scanner="ZAP",
        title="OWASP ZAP: Reflected Cross-Site Scripting on Parameter 'bio'",
        description="Injected script marker reflected unencoded in response HTML.",
        severity="HIGH",
        confidence="HIGH",
        category="Cross-Site Scripting",
        cwe=["CWE-79"],
        endpoint="/profile",
        parameter="bio",
        fingerprint="fp-dast-xss-222",
        evidence="Reflected payload <zap_xss_probe_991> found in HTML"
    )

    correlated = correlate_findings([sast_xss, dast_xss])
    assert len(correlated) >= 1
    corr = correlated[0]
    assert "Confirmed Cross-Site Scripting" in corr.title
    assert corr.risk_level == "HIGH"
    assert corr.confidence == "VERY HIGH"

def test_risk_scoring_and_severity_engine():
    finding = NormalizedFinding(
        source="SAST",
        scanner="sentinal-sast",
        title="SQL Injection in Database Query",
        description="Unparameterized SQL execution sink.",
        severity="CRITICAL",
        confidence="CONFIRMED",
        category="SQL Injection",
        cwe=["CWE-89"],
        file="app/db.py",
        line=20,
        fingerprint="fp-risk-test-1"
    )

    score = apply_risk_scoring([finding], [])
    assert score >= 85.0
    assert finding.risk_score >= 85.0
    assert finding.potential_impact is not None

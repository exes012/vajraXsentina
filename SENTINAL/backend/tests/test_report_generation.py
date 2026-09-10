import pytest
from pathlib import Path
from app.reports.generator import report_generator
from app.pipeline.normalizer import NormalizedFinding
from app.pipeline.correlator import CorrelatedRiskItem
from app.ai.base import AIAnalysisResult

def test_report_generator_html_pdf_json(tmp_path):
    assessment_meta = {
        "id": "test-assess-12345",
        "project_name": "Test Payment Gateway",
        "target": "https://api.testapp.com",
        "repository": "https://github.com/org/test-payment-repo",
        "scan_mode": "AGGRESSIVE",
        "assessment_type": "combined",
        "authorization_status": "VERIFIED",
        "coverage_status": "FULL COVERAGE",
        "overall_risk_score": 88.5,
        "dast_coverage_score": 94.0,
        "finding_confidence": "FULL",
        "critical_count": 1,
        "high_count": 1,
        "medium_count": 0,
        "low_count": 0,
        "info_count": 0,
        "total_findings": 2,
        "connectivity_diagnostics": {
            "reachability": "REACHABLE",
            "access_level": "UNRESTRICTED",
            "checks": {
                "3_tls_handshake": {"protocol": "TLSv1.3"},
                "9_waf_indicators": {"detected": False, "provider": "None", "confidence": "NONE"}
            },
            "diagnostic_recommendation": "Target is fully reachable."
        }
    }

    findings = [
        NormalizedFinding(
            id="find-1",
            title="SQL Injection in User Search Query",
            description="Dynamic SQL concatenation allows authentication bypass.",
            severity="CRITICAL",
            confidence="HIGH",
            category="injection",
            fingerprint="fp-find-1",
            source="SAST",
            scanner="semgrep",
            all_scanners=["semgrep"],
            file="app/api/users.py",
            line=45,
            cwe=["CWE-89"],
            risk_score=95.0,
            blast_radius="Database Compromise & Data Exfiltration",
            threat_scenario="Attacker supplies crafted SQL payloads to bypass authentication and dump customer records.",
            potential_impact={
                "confidentiality": "CRITICAL",
                "integrity": "HIGH",
                "availability": "MEDIUM",
                "business_impact": "Severe data breach violating GDPR and PCI-DSS."
            },
            remediation="Use parameterized prepared statements with bind parameters."
        ),
        NormalizedFinding(
            id="find-2",
            title="Exposed JWT Private Signing Key",
            description="Private RSA key found hardcoded in repository.",
            severity="HIGH",
            confidence="HIGH",
            category="secret_leak",
            fingerprint="fp-find-2",
            source="SECRETS",
            scanner="gitleaks",
            all_scanners=["gitleaks"],
            file="config/jwt_keys.env",
            line=12,
            cwe=["CWE-798"],
            risk_score=88.0,
            blast_radius="Identity & Authentication Bypass",
            threat_scenario="Leaked cryptographic key allows forgery of valid session tokens with admin claims.",
            potential_impact={
                "confidentiality": "HIGH",
                "integrity": "CRITICAL",
                "availability": "LOW",
                "business_impact": "Full account takeover across all tenants."
            },
            remediation="Rotate compromised key and store in cloud KMS vault."
        )
    ]

    correlated = [
        CorrelatedRiskItem(
            id="corr-1",
            title="Authentication Bypass via Exposed JWT Key & SQL Injection",
            description="Combined attack chain allows complete system compromise.",
            risk_level="CRITICAL",
            confidence="HIGH",
            explanation="Attacker crafts token with leaked key and queries sensitive data using SQL injection.",
            attack_scenario="Attacker signs admin token -> accesses privileged endpoint -> exploits SQLi -> dumps database.",
            remediation="Rotate key immediately and parameterize database queries.",
            findings_involved=["find-1", "find-2"]
        )
    ]

    ai_res = AIAnalysisResult(
        executive_summary="Target system has critical vulnerabilities requiring immediate remediation.",
        technical_summary="SAST and secret scanners detected SQL injection and exposed cryptographic material.",
        remediation_playbook="1. Invalidate compromised JWT keys.\n2. Apply parameterized queries across all database access layers.",
        risk_prioritization="P0: Invalidate JWT keys\nP0: Fix SQL Injection",
        false_positive_analysis="All findings verified with high confidence.",
        provider_used="rule-based"
    )

    # Test report generation
    json_path = report_generator.generate_json_report(assessment_meta, findings, correlated, ai_res)
    html_path = report_generator.generate_html_report(assessment_meta, findings, correlated, ai_res)
    pdf_path = report_generator.generate_pdf_report(assessment_meta, findings, correlated, ai_res)

    assert Path(json_path).exists()
    assert Path(html_path).exists()
    assert Path(pdf_path).exists()

    html_content = Path(html_path).read_text(encoding="utf-8")
    assert "Threat Scenario:" in html_content
    assert "Database Compromise & Data Exfiltration" in html_content
    assert "Risk: 95.0/100" in html_content
    assert "Confidentiality:" in html_content

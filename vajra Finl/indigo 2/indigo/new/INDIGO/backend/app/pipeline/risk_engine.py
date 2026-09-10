import re
from typing import List, Dict, Any, Optional
from app.pipeline.normalizer import NormalizedFinding
from app.pipeline.correlator import CorrelatedRiskItem

SEVERITY_BASE_SCORES = {
    "CRITICAL": 90.0,
    "HIGH": 70.0,
    "MEDIUM": 45.0,
    "LOW": 20.0,
    "INFO": 5.0
}

CONFIDENCE_MULTIPLIERS = {
    "VERY HIGH": 1.10,
    "HIGH": 1.0,
    "MEDIUM": 0.85,
    "LOW": 0.65
}

def derive_threat_context(finding: NormalizedFinding) -> Dict[str, Any]:
    """
    Derive the concrete Threat Scenario, Potential Impact, and Blast Radius
    for any discovered vulnerability based on its category, CWE, CVE, and attack surface.
    """
    title_lower = (finding.title or "").lower()
    cat_lower = (finding.category or "").lower()
    cwe_list = [c.upper() for c in (finding.cwe or [])]
    source = (finding.source or "").upper()
    endpoint = finding.endpoint or ""

    # 1. SQL Injection / Database Injections
    if any("cwe-89" in c for c in cwe_list) or "sql injection" in title_lower or "sqli" in title_lower or "sql injection" in cat_lower:
        return {
            "blast_radius": "Database Takeover & Sensitive Data Exfiltration",
            "threat_scenario": (
                "An attacker can supply crafted SQL payloads to bypass authentication barriers, "
                "extract proprietary customer PII and database tables, modify financial or user records, "
                "or execute administrative commands on the underlying database host."
            ),
            "potential_impact": {
                "confidentiality": "CRITICAL — Full database extraction (PII, credentials, business data)",
                "integrity": "HIGH — Unauthorized table alteration, record modification, or database truncation",
                "availability": "MEDIUM — Database locking, resource exhaustion, denial of service",
                "business_impact": "Severe regulatory penalties (GDPR, PCI-DSS), reputational damage, and customer loss.",
                "attack_vector": "Unsanitized user input concatenation into SQL query execution sinks."
            },
            "exploitability_weight": 1.25,
            "blast_radius_weight": 1.20
        }

    # 2. Remote Code Execution (RCE) / Command Injection
    if any(c in ["CWE-78", "CWE-94", "CWE-95"] for c in cwe_list) or "command execution" in title_lower or "rce" in title_lower or "eval" in title_lower or "shell" in title_lower:
        return {
            "blast_radius": "Full Server Takeover & Remote Code Execution (RCE)",
            "threat_scenario": (
                "An adversary can execute arbitrary operating system commands with web process privileges, "
                "allowing them to spawn reverse shells, install backdoors/ransomware, and pivot laterally inside internal cloud VPCs."
            ),
            "potential_impact": {
                "confidentiality": "CRITICAL — Arbitrary file read, secrets harvesting, environment variables",
                "integrity": "CRITICAL — Arbitrary file write, malware persistence, system modification",
                "availability": "CRITICAL — Process termination, ransomware encryption, host destruction",
                "business_impact": "Catastrophic infrastructure compromise, total loss of system governance, and operational downtime.",
                "attack_vector": "Direct execution of unvalidated user input via system shell or eval functions."
            },
            "exploitability_weight": 1.30,
            "blast_radius_weight": 1.30
        }

    # 3. Cross-Site Scripting (XSS)
    if any("cwe-79" in c for c in cwe_list) or "cross-site scripting" in title_lower or "xss" in title_lower:
        return {
            "blast_radius": "Session Hijacking & Client-Side Execution",
            "threat_scenario": (
                "An adversary can inject malicious JavaScript into the victim's browser session, "
                "stealing session tokens and cookies, rewriting web pages for credential phishing, "
                "or forcing unauthorized transactions on behalf of authenticated users."
            ),
            "potential_impact": {
                "confidentiality": "HIGH — Session token harvesting, DOM extraction, keylogging",
                "integrity": "HIGH — Unauthorized client-side actions, phishing modal injection",
                "availability": "LOW — Temporary UI defacement",
                "business_impact": "Account takeover of high-privilege administrators and loss of client trust.",
                "attack_vector": "Unsanitized reflection or storage of user input in HTML/DOM context."
            },
            "exploitability_weight": 1.15,
            "blast_radius_weight": 1.10
        }

    # 4. Server-Side Request Forgery (SSRF)
    if any("cwe-918" in c for c in cwe_list) or "ssrf" in title_lower or "server-side request" in title_lower:
        return {
            "blast_radius": "Cloud Metadata Exposure & Internal Network Pivoting",
            "threat_scenario": (
                "An attacker can coerce the backend application into dispatching forged requests to internal cloud services "
                "(e.g., AWS EC2 metadata at 169.254.169.254, internal Kubernetes API, Redis), harvesting IAM credentials and probing private VPCs."
            ),
            "potential_impact": {
                "confidentiality": "CRITICAL — Cloud IAM security credentials, internal configuration tokens",
                "integrity": "MEDIUM — Unintended interaction with internal unauthenticated microservices",
                "availability": "LOW — Internal subnet discovery",
                "business_impact": "Compromise of cloud infrastructure account and lateral movement into private services.",
                "attack_vector": "Coercing server-side HTTP fetch requests to attacker-controlled internal IP addresses."
            },
            "exploitability_weight": 1.20,
            "blast_radius_weight": 1.25
        }

    # 5. Secrets & Credential Exposure
    if source == "SECRETS" or any(c in ["CWE-798", "CWE-200", "CWE-538"] for c in cwe_list) or "secret" in title_lower or "token" in title_lower or "private key" in title_lower:
        return {
            "blast_radius": "Cloud & Third-Party Service Credential Compromise",
            "threat_scenario": (
                "Hardcoded credentials, API keys, or private cryptographic keys exposed in code or public responses "
                "allow adversaries to authenticate directly to third-party SaaS services, cloud accounts, or payment gateways."
            ),
            "potential_impact": {
                "confidentiality": "HIGH — Unauthorized access to cloud APIs, databases, and third-party SaaS platforms",
                "integrity": "HIGH — Direct API mutations, cloud asset provisioning",
                "availability": "HIGH — Resource exhaustion, cloud account suspension",
                "business_impact": "Cloud financial theft (e.g. crypto-mining abuse), service hijacking, and API data compromise.",
                "attack_vector": "Hardcoded high-entropy tokens or keys committed in repositories or response bodies."
            },
            "exploitability_weight": 1.25,
            "blast_radius_weight": 1.20
        }

    # 6. Broken Access Control / IDOR
    if any(c in ["CWE-284", "CWE-639", "CWE-862", "CWE-285"] for c in cwe_list) or "access control" in title_lower or "idor" in title_lower or "privilege" in title_lower:
        return {
            "blast_radius": "Horizontal / Vertical Privilege Escalation",
            "threat_scenario": (
                "An attacker can manipulate user identifiers, tenant IDs, or request URLs to view and modify "
                "unauthorized records belonging to other users or elevate their permissions to administrative tiers."
            ),
            "potential_impact": {
                "confidentiality": "HIGH — Exposure of cross-tenant and administrative records",
                "integrity": "HIGH — Unauthorized modification or deletion of customer resources",
                "availability": "LOW — Non-availability impact",
                "business_impact": "Multi-tenant isolation collapse, privacy violations, and severe regulatory non-compliance.",
                "attack_vector": "Missing authorization verification checks on object-level resource endpoints."
            },
            "exploitability_weight": 1.20,
            "blast_radius_weight": 1.15
        }

    # 7. Vulnerable Dependencies (SCA)
    if source == "SCA" or any("cwe-1395" in c for c in cwe_list) or "cve-" in title_lower:
        return {
            "blast_radius": "Third-Party Component Exploitation",
            "threat_scenario": (
                "An outdated third-party dependency contains known, publicly documented CVEs with available exploit payloads, "
                "allowing automated scanners and threat actors to target known flaws in the software supply chain."
            ),
            "potential_impact": {
                "confidentiality": "MEDIUM-HIGH — Depends on specific CVE impact profile",
                "integrity": "MEDIUM-HIGH — Potential component tampering",
                "availability": "MEDIUM — Denial of service or crash vulnerabilities",
                "business_impact": "Software supply chain vulnerabilities, loss of SOC2/ISO-27001 compliance certification.",
                "attack_vector": "Execution of public weaponized exploits against unpatched open-source libraries."
            },
            "exploitability_weight": 1.10,
            "blast_radius_weight": 1.10
        }

    # 8. Security Misconfigurations & Headers / TLS
    if any(c in ["CWE-16", "CWE-319", "CWE-1004", "CWE-1021", "CWE-614", "CWE-548"] for c in cwe_list) or "header" in title_lower or "ssl" in title_lower or "tls" in title_lower or "cookie" in title_lower:
        return {
            "blast_radius": "Defense Degradation & Traffic Interception",
            "threat_scenario": (
                "Missing transport or browser security controls allow adversaries on adjacent networks or untrusted origins "
                "to intercept cleartext communications, frame the application in Clickjacking attacks, or extract cookies."
            ),
            "potential_impact": {
                "confidentiality": "MEDIUM — Potential plaintext traffic inspection, cookie leakage",
                "integrity": "MEDIUM — Clickjacking UI deception, MIME-sniffing execution",
                "availability": "LOW — No direct availability impact",
                "business_impact": "Failure of PCI-DSS and security posture audits, increased susceptibility to social engineering.",
                "attack_vector": "Absence of hardening headers (HSTS, CSP, X-Frame-Options) or weak TLS cipher negotiation."
            },
            "exploitability_weight": 0.90,
            "blast_radius_weight": 0.90
        }

    # Default / General Security
    return {
        "blast_radius": "Information Disclosure & Security Misconfiguration",
        "threat_scenario": (
            "The vulnerability exposes implementation details, internal software versions, or unhardened endpoints "
            "that assist attackers in reconnaissance and multi-stage attack chaining."
        ),
        "potential_impact": {
            "confidentiality": "LOW-MEDIUM — Leakage of architecture details and configuration parameters",
            "integrity": "LOW — Limited direct modification",
            "availability": "LOW — No availability impact",
            "business_impact": "Increased attack surface visibility for targeted external threat actors.",
            "attack_vector": "Exposed diagnostic endpoints or permissive application configuration."
        },
        "exploitability_weight": 1.0,
        "blast_radius_weight": 1.0
    }

def calculate_finding_intermediate_risk(
    finding: NormalizedFinding,
    is_correlated: bool = False,
    asset_criticality: str = "PRODUCTION"
) -> Dict[str, Any]:
    """
    Calculate dynamic intermediate risk score (0-100) and CVSS equivalent (0-10)
    factoring in base severity, attack surface exposure, exploitability, and blast radius.
    """
    threat_info = derive_threat_context(finding)
    base_score = SEVERITY_BASE_SCORES.get(finding.severity, 40.0)
    conf_mult = CONFIDENCE_MULTIPLIERS.get(finding.confidence, 0.85)

    # Multi-scanner verification bonus
    if len(finding.all_scanners) > 1:
        conf_mult = min(1.15, conf_mult * 1.10)

    # Attack surface exposure factor
    exposure_mult = 1.0
    if finding.endpoint:
        exposure_mult += 0.12  # Publicly exposed endpoint
    if finding.parameter:
        exposure_mult += 0.08  # Directly controllable parameter
    if finding.source == "DAST":
        exposure_mult += 0.05  # Confirmed via active network probing

    # Blast radius & exploitability weights from threat analysis
    exploit_weight = threat_info.get("exploitability_weight", 1.0)
    blast_weight = threat_info.get("blast_radius_weight", 1.0)

    # Asset criticality multiplier
    crit_mult = 1.10 if asset_criticality == "PRODUCTION" else 1.0

    # Correlation boost
    correlation_bonus = 10.0 if is_correlated else 0.0

    # Intermediate risk score calculation
    raw_intermediate = (base_score * conf_mult * exposure_mult * ((exploit_weight + blast_weight) / 2.0) * crit_mult) + correlation_bonus
    intermediate_score = round(min(100.0, max(1.0, raw_intermediate)), 1)
    cvss_equivalent = round(intermediate_score / 10.0, 1)

    # Risk Rating
    if intermediate_score >= 85.0:
        rating = "CRITICAL"
    elif intermediate_score >= 65.0:
        rating = "HIGH"
    elif intermediate_score >= 35.0:
        rating = "MEDIUM"
    elif intermediate_score >= 15.0:
        rating = "LOW"
    else:
        rating = "INFO"

    risk_factors = {
        "base_severity_score": base_score,
        "confidence_multiplier": round(conf_mult, 2),
        "exposure_multiplier": round(exposure_mult, 2),
        "exploitability_factor": round(exploit_weight, 2),
        "blast_radius_factor": round(blast_weight, 2),
        "asset_criticality_factor": crit_mult,
        "correlation_bonus": correlation_bonus,
        "intermediate_risk_score": intermediate_score,
        "cvss_equivalent": cvss_equivalent,
        "calculated_rating": rating
    }

    return {
        "risk_score": intermediate_score,
        "cvss_equivalent": cvss_equivalent,
        "rating": rating,
        "threat_scenario": threat_info["threat_scenario"],
        "blast_radius": threat_info["blast_radius"],
        "potential_impact": threat_info["potential_impact"],
        "risk_factors": risk_factors
    }

def calculate_finding_risk_score(
    finding: NormalizedFinding,
    is_correlated: bool = False
) -> float:
    """Calculate normalized risk score (0-100) for an individual finding."""
    res = calculate_finding_intermediate_risk(finding, is_correlated=is_correlated)
    return res["risk_score"]

def calculate_overall_risk_score(
    findings: List[NormalizedFinding],
    correlated_risks: List[CorrelatedRiskItem]
) -> float:
    """Calculate aggregated 0-100 risk score for the entire assessment."""
    if not findings:
        return 0.0

    crit_count = sum(1 for f in findings if f.severity == "CRITICAL")
    high_count = sum(1 for f in findings if f.severity == "HIGH")
    med_count = sum(1 for f in findings if f.severity == "MEDIUM")
    low_count = sum(1 for f in findings if f.severity == "LOW")
    corr_count = len(correlated_risks)

    # Weighted risk curve based on intermediate finding scores
    finding_score_sum = sum(f.risk_score for f in findings)
    avg_score = finding_score_sum / max(len(findings), 1)

    raw_points = (
        (crit_count * 25.0) +
        (high_count * 12.0) +
        (med_count * 4.0) +
        (low_count * 1.0) +
        (corr_count * 15.0)
    )

    # Asymptotic scaling towards 100
    if crit_count > 0 or corr_count > 0:
        base_floor = 70.0
        score = base_floor + (30.0 * (1.0 - (1.0 / (1.0 + (raw_points / 50.0)))))
    elif high_count > 0:
        base_floor = 45.0
        score = base_floor + (40.0 * (1.0 - (1.0 / (1.0 + (raw_points / 30.0)))))
    elif med_count > 0:
        base_floor = 20.0
        score = base_floor + (25.0 * (1.0 - (1.0 / (1.0 + (raw_points / 20.0)))))
    else:
        score = min(20.0, raw_points)

    # Blend with average intermediate risk score
    blended_score = (score * 0.70) + (avg_score * 0.30)
    return min(100.0, round(blended_score, 1))

def apply_risk_scoring(
    findings: List[NormalizedFinding],
    correlated_risks: List[CorrelatedRiskItem],
    asset_criticality: str = "PRODUCTION"
) -> float:
    """
    Derive threat scenario, blast radius, potential impact, and intermediate risk score
    for all findings, and compute aggregate assessment risk score.
    """
    correlated_fingerprints = set()
    for cr in correlated_risks:
        for fp in cr.sast_finding_ids + cr.dast_finding_ids + cr.sca_finding_ids + cr.secret_finding_ids:
            correlated_fingerprints.add(fp)

    for f in findings:
        is_corr = f.fingerprint in correlated_fingerprints
        calc = calculate_finding_intermediate_risk(f, is_correlated=is_corr, asset_criticality=asset_criticality)
        
        f.risk_score = calc["risk_score"]
        f.threat_scenario = calc["threat_scenario"]
        f.blast_radius = calc["blast_radius"]
        f.potential_impact = calc["potential_impact"]
        f.risk_factors = calc["risk_factors"]

    return calculate_overall_risk_score(findings, correlated_risks)

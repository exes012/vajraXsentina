import hashlib
import re
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.scanners.base import RawFinding
from app.core.security import mask_secret

class NormalizedFinding(BaseModel):
    id: Optional[str] = None
    engine: str = "SAST"  # SAST | SCA | DAST
    source: str = "SAST"  # SAST | SCA | DAST | SECRETS | WEB | SSL
    scanner: str = "sentinal-scanner"
    all_scanners: List[str] = []
    title: str
    description: str
    severity: str = "MEDIUM"  # CRITICAL, HIGH, MEDIUM, LOW, INFO
    confidence: str = "MEDIUM"  # CONFIRMED, HIGH, MEDIUM, LOW
    status: str = "OPEN"  # OPEN, RESOLVED, ACCEPTED, FALSE_POSITIVE
    asset: Optional[str] = None
    location: Optional[str] = None  # file:line / endpoint / package:version
    category: str = "General Security"
    evidence: Optional[str] = None
    cwe: List[str] = []
    owasp: List[str] = []
    cve: Optional[str] = None
    cves: List[str] = []
    cvss: Optional[float] = None
    affected_version: Optional[str] = None
    fixed_version: Optional[str] = None
    file: Optional[str] = None
    line: Optional[int] = None
    code_snippet: Optional[str] = None
    endpoint: Optional[str] = None
    parameter: Optional[str] = None
    remediation: Optional[str] = None
    references: List[str] = []
    fingerprint: str
    risk_score: float = 0.0
    threat_scenario: Optional[str] = None
    potential_impact: Dict[str, Any] = {}
    blast_radius: Optional[str] = None
    risk_factors: Dict[str, Any] = {}
    raw_evidence: Dict[str, Any] = {}
    detected_at: str = ""

def generate_fingerprint(
    category: str,
    title: str,
    cwe: List[str],
    cves: List[str],
    file: Optional[str],
    line: Optional[int],
    endpoint: Optional[str],
    parameter: Optional[str]
) -> str:
    """Generate deterministic fingerprint hash for finding deduplication."""
    clean_title = re.sub(r'0x[a-f0-9]+', '', title, flags=re.I)
    clean_title = re.sub(r'[\'"][^\'"]+[\'"]', '', clean_title).strip().lower()
    
    clean_cwe = sorted(cwe)[0] if cwe else ""
    clean_cve = sorted(cves)[0] if cves else ""
    clean_file = (file or "").replace("\\", "/").strip().lower()
    clean_endpoint = (endpoint or "").split("?")[0].strip().lower()
    clean_param = (parameter or "").strip().lower()

    if clean_file:
        key_str = f"CODE|{clean_file}|{clean_cwe or clean_title}|{clean_param}"
    elif clean_endpoint:
        key_str = f"WEB|{clean_endpoint}|{clean_cwe or clean_title}|{clean_param}"
    else:
        key_str = f"GEN|{category}|{clean_title}|{clean_cve}"

    return hashlib.sha256(key_str.encode("utf-8")).hexdigest()[:32]

def normalize_raw_finding(raw: RawFinding) -> NormalizedFinding:
    """Convert raw scanner output to standardized NormalizedFinding."""
    sev = raw.severity.upper() if raw.severity else "MEDIUM"
    if sev not in ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]:
        sev = "MEDIUM"

    conf = raw.confidence.upper() if raw.confidence else "MEDIUM"
    if conf not in ["CONFIRMED", "HIGH", "MEDIUM", "LOW"]:
        conf = "MEDIUM"

    # Map engine
    raw_src = (raw.source or "SAST").upper()
    if raw_src in ["SAST", "SECRETS"]:
        engine_str = "SAST"
    elif raw_src in ["SCA"]:
        engine_str = "SCA"
    else:
        engine_str = "DAST"

    # Mask secrets
    masked_snippet = raw.code_snippet
    masked_evidence = raw.evidence
    if raw.source == "SECRETS" or "secret" in raw.title.lower() or "token" in raw.title.lower():
        if masked_snippet:
            masked_snippet = re.sub(r'(ghp_[a-zA-Z0-9]{36}|AKIA[0-9A-Z]{16}|sk-[a-zA-Z0-9]{32,}|password\s*=\s*[\'"][^\'"]+[\'"])', r'***REDACTED***', masked_snippet)
        if masked_evidence:
            masked_evidence = re.sub(r'(ghp_[a-zA-Z0-9]{36}|AKIA[0-9A-Z]{16}|sk-[a-zA-Z0-9]{32,}|password\s*=\s*[\'"][^\'"]+[\'"])', r'***REDACTED***', masked_evidence)

    # Location resolution
    if raw.file and raw.line:
        loc = f"{raw.file}:{raw.line}"
    elif raw.file:
        loc = raw.file
    elif raw.endpoint:
        loc = raw.endpoint
    else:
        loc = "Repository / Asset"

    # Extract primary CVE and CVSS
    primary_cve = raw.cves[0] if raw.cves else None
    fixed_ver = None
    affected_ver = None
    cvss_val = None
    if isinstance(raw.raw_data, dict):
        fixed_ver = raw.raw_data.get("fixed") or (raw.raw_data.get("fixed_versions", [None])[0] if raw.raw_data.get("fixed_versions") else None)
        affected_ver = raw.raw_data.get("installed_version")
        cvss_val = raw.raw_data.get("cvss")

    fingerprint = generate_fingerprint(
        category=raw.category,
        title=raw.title,
        cwe=raw.cwe,
        cves=raw.cves,
        file=raw.file,
        line=raw.line,
        endpoint=raw.endpoint,
        parameter=raw.parameter
    )

    return NormalizedFinding(
        id=f"fnd-{str(uuid.uuid4())[:8]}",
        engine=engine_str,
        source=raw.source,
        scanner=raw.scanner,
        all_scanners=[raw.scanner],
        title=raw.title,
        description=raw.description,
        severity=sev,
        confidence=conf,
        status="OPEN",
        asset=raw.file or raw.endpoint or "Target Scope",
        location=loc,
        category=raw.category,
        cwe=raw.cwe,
        cve=primary_cve,
        cves=raw.cves,
        cvss=cvss_val,
        affected_version=affected_ver,
        fixed_version=fixed_ver,
        owasp=raw.owasp,
        file=raw.file,
        line=raw.line,
        code_snippet=masked_snippet,
        endpoint=raw.endpoint,
        parameter=raw.parameter,
        evidence=masked_evidence,
        remediation=raw.remediation,
        references=raw.references,
        fingerprint=fingerprint,
        raw_evidence=raw.raw_data or {},
        detected_at=datetime.now(timezone.utc).isoformat()
    )

def normalize_findings_list(raw_findings: List[RawFinding]) -> List[NormalizedFinding]:
    return [normalize_raw_finding(rf) for rf in raw_findings]

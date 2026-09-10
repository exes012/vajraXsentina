from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

# --- Auth & User Schemas ---
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=64)
    email: str = Field(..., min_length=3, max_length=128)
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    username: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None

# --- Project Schemas ---
class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=128)
    description: Optional[str] = None
    repository_url: Optional[str] = None
    target_url: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    repository_url: Optional[str] = None
    target_url: Optional[str] = None

class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: Optional[str] = None
    user_id: str
    repository_url: Optional[str] = None
    target_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

# --- Asset Schemas ---
class AssetCreate(BaseModel):
    project_id: str
    name: Optional[str] = None
    url: str
    asset_type: str = "WEB_APPLICATION"  # WEB_APPLICATION, API_GATEWAY, GITHUB_REPO, CLOUD_WORKLOAD

class AssetVerifyRequest(BaseModel):
    method: str = "ANALYST_AUTHORIZATION"  # ANALYST_AUTHORIZATION, DNS_TXT, HTTP_META, MANUAL
    notes: Optional[str] = None

class AssetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    project_id: str
    name: str
    asset_type: str
    url: str
    hostname: str
    protocol: str
    status: str
    is_verified: bool
    verification_method: str
    verification_token: Optional[str] = None
    technology: List[str] = Field(default_factory=list)
    discovery_metadata: Dict[str, Any] = Field(default_factory=dict)
    waf_detection: Dict[str, Any] = Field(default_factory=dict)
    last_coverage_score: float = 0.0
    last_assessment_id: Optional[str] = None
    last_assessment_at: Optional[datetime] = None
    risk_score: float = 0.0
    created_at: datetime
    updated_at: datetime

# --- Assessment Schemas ---
class AssessmentModulesConfig(BaseModel):
    discovery: bool = True
    dast: bool = True
    nuclei: bool = True
    wapiti: bool = True
    nikto: bool = True
    headers: bool = True
    ssl: bool = True
    sast: bool = True
    sca: bool = True
    secrets: bool = True

class RepositoryInput(BaseModel):
    provider: str = "github"
    url: Optional[str] = None
    branch: str = "main"
    token: Optional[str] = None
    zip_path: Optional[str] = None
    source_path: Optional[str] = None

class TargetInput(BaseModel):
    url: Optional[str] = None
    scan_mode: str = "standard"  # safe, standard, deep
    custom_headers: Optional[Dict[str, str]] = None
    auth_type: Optional[str] = "none"  # none, cookie, bearer, basic, custom
    auth_header: Optional[str] = None
    auth_token: Optional[str] = None
    auth_cookie: Optional[str] = None
    auth_username: Optional[str] = None
    auth_password: Optional[str] = None

class AssessmentCreate(BaseModel):
    project_id: Optional[str] = "default-scope"
    name: Optional[str] = None
    assessment_type: str = "combined"  # repo, source, dast, combined
    asset_id: Optional[str] = None
    repository: Optional[RepositoryInput] = None
    target: Optional[TargetInput] = None
    modules: AssessmentModulesConfig = Field(default_factory=AssessmentModulesConfig)
    notes: Optional[str] = None

class ScanJobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    module_name: str
    status: str
    duration_ms: int
    error_message: Optional[str]
    failure_reason: Optional[Dict[str, Any]] = None
    raw_results_count: int
    created_at: datetime
    completed_at: Optional[datetime]

class AssessmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    project_id: str
    asset_id: Optional[str] = None
    assessment_type: str
    status: str
    repository_info: Dict[str, Any]
    target_info: Dict[str, Any]
    modules: Dict[str, bool]
    overall_risk_score: float
    dast_coverage_score: float = 0.0
    coverage_status: str = "NOT_APPLICABLE"
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    info_count: int
    total_findings: int
    connectivity_diagnostics: Dict[str, Any] = Field(default_factory=dict)
    coverage_telemetry: Dict[str, Any] = Field(default_factory=dict)
    regressions: Dict[str, Any] = Field(default_factory=dict)
    error_message: Optional[str]
    failure_reason: Optional[Dict[str, Any]] = Field(default_factory=dict)
    logs: List[Dict[str, Any]]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime
    scan_jobs: Optional[List[ScanJobResponse]] = None

# --- Finding Schemas ---
class FindingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    assessment_id: str
    project_id: str
    asset_id: Optional[str] = None
    source: str
    scanner: str
    detected_by: List[str] = Field(default_factory=list)
    title: str
    description: str
    severity: str
    confidence: str
    category: str
    cwe: List[str]
    cves: List[str]
    owasp: List[str]
    file: Optional[str] = None
    line: Optional[int] = None
    code_snippet: Optional[str] = None
    endpoint: Optional[str] = None
    method: Optional[str] = None
    parameter: Optional[str] = None
    evidence: Optional[str] = None
    remediation: Optional[str] = None
    references: List[str] = Field(default_factory=list)
    fingerprint: Optional[str] = None
    risk_score: float
    threat_scenario: Optional[str] = None
    potential_impact: Dict[str, Any] = Field(default_factory=dict)
    blast_radius: Optional[str] = None
    risk_factors: Dict[str, Any] = Field(default_factory=dict)
    status: str
    created_at: datetime

class FindingUpdateStatus(BaseModel):
    status: str  # open, resolved, false_positive, ignored

# --- Correlated Risk Schemas ---
class CorrelatedRiskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    assessment_id: str
    title: str
    description: str
    risk_level: str
    confidence: str
    sast_finding_ids: List[str]
    dast_finding_ids: List[str]
    sca_finding_ids: List[str]
    secret_finding_ids: List[str]
    explanation: str
    attack_scenario: str
    remediation: str
    created_at: datetime

# --- Report Schemas ---
class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    assessment_id: str
    project_id: str
    executive_summary: Optional[str]
    technical_summary: Optional[str]
    ai_analysis: Dict[str, Any]
    methodology: Optional[str]
    distribution: Dict[str, Any]
    file_path_html: Optional[str]
    file_path_pdf: Optional[str]
    file_path_json: Optional[str]
    created_at: datetime

# --- Regression & Comparison Schema ---
class AssessmentComparisonResponse(BaseModel):
    asset_id: str
    base_assessment_id: str
    target_assessment_id: str
    score_change: float
    new_findings_count: int
    resolved_findings_count: int
    persistent_findings_count: int
    new_findings: List[FindingResponse]
    resolved_findings: List[FindingResponse]
    persistent_findings: List[FindingResponse]

# --- Dashboard Schemas ---
class DashboardMetrics(BaseModel):
    total_projects: int
    total_assessments: int
    overall_risk_score: float
    severity_distribution: Dict[str, int]
    findings_by_source: Dict[str, int]
    findings_by_scanner: Dict[str, int]
    vulnerable_dependencies_count: int
    secrets_count: int
    dast_issues_count: int
    sast_issues_count: int
    ssl_issues_count: int
    assets_monitored_count: int = 0
    dast_coverage_summary: Dict[str, Any] = Field(default_factory=dict)
    top_vulnerabilities: List[Dict[str, Any]]
    most_affected_files: List[Dict[str, Any]]
    most_affected_endpoints: List[Dict[str, Any]]
    recent_assessments: List[AssessmentResponse]
    recent_findings: List[FindingResponse]

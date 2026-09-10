import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(128), nullable=True)
    email = Column(String(128), unique=True, index=True, nullable=False)
    name = Column(String(128), nullable=True)
    hashed_password = Column(String(256), nullable=False)
    role = Column(String(32), default="admin")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Project(Base):
    __tablename__ = "projects"
    __table_args__ = {'extend_existing': True}

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    user_id = Column(String(64), nullable=True, index=True)
    repository_url = Column(String(512), nullable=True)
    target_url = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    assessments = relationship("Assessment", back_populates="project", cascade="all, delete-orphan")
    assets = relationship("Asset", back_populates="project", cascade="all, delete-orphan")


class Asset(Base):
    __tablename__ = "assets"
    __table_args__ = {'extend_existing': True}

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False, index=True)
    name = Column(String(256), nullable=False)
    asset_type = Column(String(64), default="WEB_APPLICATION")
    url = Column(String(512), nullable=False, index=True)
    hostname = Column(String(256), nullable=False, index=True)
    protocol = Column(String(16), default="https")
    status = Column(String(32), default="REACHABLE")
    
    is_verified = Column(Boolean, default=False, index=True)
    verification_method = Column(String(32), default="MANUAL")
    verification_token = Column(String(64), nullable=True)
    
    technology = Column(JSON, default=list)
    discovery_metadata = Column(JSON, default=dict)
    waf_detection = Column(JSON, default=dict)
    last_coverage_score = Column(Float, default=0.0)
    
    last_assessment_id = Column(String(36), nullable=True)
    last_assessment_at = Column(DateTime, nullable=True)
    risk_score = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="assets")


class Assessment(Base):
    __tablename__ = "assessments"
    __table_args__ = {'extend_existing': True}

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    asset_id = Column(String(36), ForeignKey("assets.id"), nullable=True, index=True)
    assessment_type = Column(String(32), default="combined")
    status = Column(String(32), default="QUEUED", index=True)
    
    repository_info = Column(JSON, default=dict)
    target_info = Column(JSON, default=dict)
    modules = Column(JSON, default=dict)
    
    overall_risk_score = Column(Float, default=0.0)
    dast_coverage_score = Column(Float, default=0.0)
    coverage_status = Column(String(32), default="NOT_APPLICABLE")
    critical_count = Column(Integer, default=0)
    high_count = Column(Integer, default=0)
    medium_count = Column(Integer, default=0)
    low_count = Column(Integer, default=0)
    info_count = Column(Integer, default=0)
    total_findings = Column(Integer, default=0)

    connectivity_diagnostics = Column(JSON, default=dict)
    coverage_telemetry = Column(JSON, default=dict)
    regressions = Column(JSON, default=dict)
    error_message = Column(Text, nullable=True)
    failure_reason = Column(JSON, default=dict)
    logs = Column(JSON, default=list)
    
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="assessments")
    scan_jobs = relationship("ScanJob", back_populates="assessment", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="assessment", cascade="all, delete-orphan")
    correlated_risks = relationship("CorrelatedRisk", back_populates="assessment", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="assessment", cascade="all, delete-orphan")


class ScanJob(Base):
    __tablename__ = "scan_jobs"
    __table_args__ = {'extend_existing': True}

    id = Column(String(36), primary_key=True, default=generate_uuid)
    assessment_id = Column(String(36), ForeignKey("assessments.id"), nullable=False)
    module_name = Column(String(32), nullable=False)
    status = Column(String(32), default="PENDING")
    duration_ms = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    failure_reason = Column(JSON, default=dict)
    raw_results_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

    assessment = relationship("Assessment", back_populates="scan_jobs")


class Finding(Base):
    __tablename__ = "findings"
    __table_args__ = {'extend_existing': True}

    id = Column(String(36), primary_key=True, default=generate_uuid)
    assessment_id = Column(String(36), ForeignKey("assessments.id"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    asset_id = Column(String(36), ForeignKey("assets.id"), nullable=True, index=True)
    
    source = Column(String(32), nullable=False, index=True)
    scanner = Column(String(64), nullable=False, index=True)
    detected_by = Column(JSON, default=list)
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(16), nullable=False, index=True)
    confidence = Column(String(16), default="MEDIUM")
    category = Column(String(64), default="General Security")
    
    cwe = Column(JSON, default=list)
    cves = Column(JSON, default=list)
    owasp = Column(JSON, default=list)
    
    file = Column(String(512), nullable=True)
    line = Column(Integer, nullable=True)
    code_snippet = Column(Text, nullable=True)
    endpoint = Column(String(512), nullable=True)
    method = Column(String(16), nullable=True)
    parameter = Column(String(128), nullable=True)
    evidence = Column(Text, nullable=True)
    remediation = Column(Text, nullable=True)
    references = Column(JSON, default=list)
    
    fingerprint = Column(String(64), index=True)
    risk_score = Column(Float, default=0.0)
    threat_scenario = Column(Text, nullable=True)
    potential_impact = Column(JSON, default=dict)
    blast_radius = Column(String(128), nullable=True)
    risk_factors = Column(JSON, default=dict)
    status = Column(String(32), default="open")
    raw_evidence = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    assessment = relationship("Assessment", back_populates="findings")


class CorrelatedRisk(Base):
    __tablename__ = "correlated_risks"
    __table_args__ = {'extend_existing': True}

    id = Column(String(36), primary_key=True, default=generate_uuid)
    assessment_id = Column(String(36), ForeignKey("assessments.id"), nullable=False, index=True)
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=False)
    risk_level = Column(String(16), nullable=False)
    confidence = Column(String(16), default="VERY HIGH")
    
    sast_finding_ids = Column(JSON, default=list)
    dast_finding_ids = Column(JSON, default=list)
    sca_finding_ids = Column(JSON, default=list)
    secret_finding_ids = Column(JSON, default=list)
    
    explanation = Column(Text, nullable=False)
    attack_scenario = Column(Text, nullable=False)
    remediation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    assessment = relationship("Assessment", back_populates="correlated_risks")


class Report(Base):
    __tablename__ = "sentina_reports"
    __table_args__ = {'extend_existing': True}

    id = Column(String(36), primary_key=True, default=generate_uuid)
    assessment_id = Column(String(36), ForeignKey("assessments.id"), nullable=False, unique=True)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    
    executive_summary = Column(Text, nullable=True)
    technical_summary = Column(Text, nullable=True)
    ai_analysis = Column(JSON, default=dict)
    methodology = Column(Text, nullable=True)
    distribution = Column(JSON, default=dict)
    
    file_path_html = Column(String(512), nullable=True)
    file_path_pdf = Column(String(512), nullable=True)
    file_path_json = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    assessment = relationship("Assessment", back_populates="reports")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    __table_args__ = {'extend_existing': True}

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), nullable=True)
    action = Column(String(64), nullable=False)
    resource_type = Column(String(64), nullable=False)
    resource_id = Column(String(64), nullable=True)
    details = Column(JSON, default=dict)
    ip_address = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

import asyncio
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from pathlib import Path
import shutil

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.config import settings
from app.core.database import get_db
from app.core.logging import logger
from app.models import Assessment, Project, User, Finding, Report, CorrelatedRisk, ScanJob
from app.schemas import (
    AssessmentCreate,
    AssessmentResponse,
    FindingResponse,
    ReportResponse
)
from app.api.auth import get_current_user
from app.workers.assessment_worker import run_assessment_job
from app.core.ssrf import normalize_target_url, validate_ssrf_safety

router = APIRouter(prefix="/scans", tags=["Scans"])

class ScanStatistics(BaseModel):
    files_scanned: int = 0
    dependencies_scanned: int = 0
    endpoints_discovered: int = 0
    requests_sent: int = 0
    findings: int = 0
    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0
    info: int = 0

class ScanStatusResponse(BaseModel):
    scan_id: str
    assessment_id: str
    assessment_type: str
    status: str
    stage: str
    progress: int
    message: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    target: Dict[str, Any] = Field(default_factory=dict)
    statistics: ScanStatistics = Field(default_factory=ScanStatistics)
    logs: List[Dict[str, Any]] = Field(default_factory=list)

def _extract_scan_statistics(assessment: Assessment, db: Session) -> ScanStatistics:
    stats = ScanStatistics()
    telemetry = assessment.coverage_telemetry or {}
    
    stats.files_scanned = telemetry.get("files_scanned", telemetry.get("scanned_files", 0))
    stats.dependencies_scanned = telemetry.get("dependencies_scanned", telemetry.get("packages_scanned", 0))
    stats.endpoints_discovered = telemetry.get("endpoints_discovered", telemetry.get("discovered_endpoints", 0))
    stats.requests_sent = telemetry.get("requests_sent", telemetry.get("requests_count", 0))

    # Count actual findings in DB for this exact scan
    findings = db.query(Finding).filter(Finding.assessment_id == assessment.id).all()
    stats.findings = len(findings)
    for f in findings:
        sev = str(f.severity or "").upper()
        if sev == "CRITICAL":
            stats.critical += 1
        elif sev == "HIGH":
            stats.high += 1
        elif sev == "MEDIUM":
            stats.medium += 1
        elif sev == "LOW":
            stats.low += 1
        elif sev == "INFO":
            stats.info += 1
            
    return stats

def _get_current_stage(assessment: Assessment) -> str:
    logs = assessment.logs or []
    if logs and isinstance(logs, list) and len(logs) > 0:
        latest = logs[-1]
        if isinstance(latest, dict) and latest.get("stage"):
            return str(latest.get("stage")).upper()
    return str(assessment.status or "INITIALIZING").upper()

def _get_latest_log_message(assessment: Assessment) -> str:
    logs = assessment.logs or []
    if logs and isinstance(logs, list) and len(logs) > 0:
        latest = logs[-1]
        if isinstance(latest, dict):
            return str(latest.get("message") or latest.get("text") or "Assessment in progress...")
    return f"Assessment is {assessment.status.lower()}."

def _calculate_stage_progress(assessment: Assessment) -> int:
    status_str = str(assessment.status or "").upper()
    if status_str in ["COMPLETED", "SUCCESS"]:
        return 100
    if status_str in ["FAILED", "CANCELLED"]:
        return 100
    
    stage = _get_current_stage(assessment)
    stage_map = {
        "QUEUED": 5,
        "INITIALIZING": 10,
        "TARGET VALIDATION": 15,
        "CONNECTIVITY DIAGNOSTICS": 20,
        "DIAGNOSTICS": 20,
        "CLONING": 25,
        "REPOSITORY DISCOVERY": 25,
        "DISCOVERING": 25,
        "SOURCE PREPARATION": 30,
        "SOURCE CODE PREPARATION": 30,
        "SOURCE EXTRACTION": 30,
        "PREREQUISITE VERIFICATION": 35,
        "SCANNER EXECUTION": 40,
        "HTTP DISCOVERY": 42,
        "SAST": 50,
        "SCA": 60,
        "SECRETS": 68,
        "SECRET SCAN": 68,
        "SECURITY HEADERS": 72,
        "TLS": 74,
        "NUCLEI": 76,
        "DAST": 80,
        "ZAP SPIDER": 80,
        "ZAP ACTIVE SCAN": 82,
        "WAPITI": 83,
        "NIKTO": 84,
        "NORMALIZATION": 86,
        "CORRELATING": 88,
        "AI CORRELATION": 92,
        "REPORT GENERATION": 96,
        "GENERATING_REPORT": 96,
        "GENERATING REPORT": 96,
        "COMPLETED": 100
    }
    return stage_map.get(stage, 45)

@router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_and_start_scan(
    payload: AssessmentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a unique scan execution and launch asynchronous background security assessment."""
    user_id_str = str(getattr(current_user, 'id', '1'))
    project = None
    if payload.project_id and payload.project_id != "default-scope":
        project = db.query(Project).filter(Project.id == payload.project_id).first()

    if not project:
        project = db.query(Project).filter(Project.user_id == user_id_str).first()
        if not project:
            target_name = (payload.repository.url if (payload.repository and payload.repository.url) else (payload.target.url if (payload.target and payload.target.url) else "Global Production Scope"))
            clean_name = target_name.rstrip("/").split("/")[-1] if "/" in target_name else target_name
            project = Project(
                name=f"Scope: {clean_name or 'Production Fleet'}",
                description="Automated security assessment scope",
                user_id=user_id_str,
                repository_url=payload.repository.url if payload.repository else None,
                target_url=payload.target.url if payload.target else None
            )
            db.add(project)
            db.commit()
            db.refresh(project)
        payload.project_id = project.id

    repo_dict: Dict[str, Any] = {}
    target_dict: Dict[str, Any] = {}
    modules_dict: Dict[str, bool] = {}

    if payload.assessment_type in ["repo", "source"]:
        repo_dict = payload.repository.model_dump() if payload.repository else {}
        if not (repo_dict.get("url") or repo_dict.get("zip_path") or repo_dict.get("source_path")):
            if project.repository_url:
                repo_dict = {"url": project.repository_url, "branch": "main"}
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A valid Git repository URL or source code archive (.zip) is required for SAST/SCA scans."
                )
        modules_dict = {
            "sast": payload.modules.sast,
            "sca": payload.modules.sca,
            "secrets": payload.modules.secrets,
            "discovery": False,
            "dast": False,
            "nuclei": False,
            "wapiti": False,
            "nikto": False,
            "headers": False,
            "ssl": False
        }
    elif payload.assessment_type == "dast":
        raw_url = payload.target.url if (payload.target and payload.target.url) else project.target_url
        if not raw_url:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A valid target URL is required for DAST scans.")
        try:
            norm_url, hostname, port, protocol = normalize_target_url(raw_url)
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Malformed URL: {str(e)}")

        target_dict = payload.target.model_dump() if payload.target else {}
        target_dict["url"] = norm_url
        target_dict["hostname"] = hostname
        target_dict["port"] = port
        target_dict["protocol"] = protocol
        target_dict["scan_mode"] = payload.target.scan_mode if payload.target else "standard"

        modules_dict = {
            "sast": False,
            "sca": False,
            "secrets": False,
            "discovery": payload.modules.discovery,
            "dast": payload.modules.dast,
            "nuclei": payload.modules.nuclei,
            "wapiti": payload.modules.wapiti,
            "nikto": payload.modules.nikto,
            "headers": payload.modules.headers,
            "ssl": payload.modules.ssl
        }
    else:  # "combined"
        repo_dict = payload.repository.model_dump() if (payload.repository and (payload.repository.url or payload.repository.zip_path or payload.repository.source_path)) else ({"url": project.repository_url} if project.repository_url else {})
        raw_url = payload.target.url if (payload.target and payload.target.url) else project.target_url
        
        has_repo = bool(repo_dict.get("url") or repo_dict.get("zip_path") or repo_dict.get("source_path"))
        if not raw_url:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Target URL is required for Combined assessments.")
        if not has_repo:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Repository URL or source code is required for Combined assessments.")

        norm_url, hostname, port, protocol = normalize_target_url(raw_url)
        target_dict = payload.target.model_dump() if payload.target else {}
        target_dict["url"] = norm_url
        target_dict["hostname"] = hostname
        target_dict["port"] = port
        target_dict["protocol"] = protocol
        target_dict["scan_mode"] = payload.target.scan_mode if payload.target else "standard"

        modules_dict = {
            "sast": payload.modules.sast,
            "sca": payload.modules.sca,
            "secrets": payload.modules.secrets,
            "discovery": payload.modules.discovery,
            "dast": payload.modules.dast,
            "nuclei": payload.modules.nuclei,
            "wapiti": payload.modules.wapiti,
            "nikto": payload.modules.nikto,
            "headers": payload.modules.headers,
            "ssl": payload.modules.ssl
        }

    assessment = Assessment(
        project_id=project.id,
        asset_id=payload.asset_id,
        assessment_type=payload.assessment_type,
        status="QUEUED",
        repository_info=repo_dict,
        target_info=target_dict,
        modules=modules_dict,
        logs=[{
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "stage": "QUEUED",
            "message": f"Scan initialization queued for {payload.assessment_type.upper()}."
        }]
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    # Spawn background task
    background_tasks.add_task(run_assessment_job, assessment.id)

    return AssessmentResponse.model_validate(assessment)

@router.get("/{scan_id}", response_model=AssessmentResponse)
def get_scan(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve details for a specific scan."""
    assessment = db.query(Assessment).filter(Assessment.id == scan_id).first()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scan not found")
    return AssessmentResponse.model_validate(assessment)

@router.get("/{scan_id}/status", response_model=ScanStatusResponse)
def get_scan_status(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Live streaming status endpoint returning real-time progress, stage, statistics, and logs for scan_id."""
    assessment = db.query(Assessment).filter(Assessment.id == scan_id).first()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scan not found")

    stats = _extract_scan_statistics(assessment, db)
    current_stage = _get_current_stage(assessment)
    progress = _calculate_stage_progress(assessment)
    msg = _get_latest_log_message(assessment)

    target_summary = {}
    if assessment.target_info:
        target_summary["url"] = assessment.target_info.get("url")
        target_summary["hostname"] = assessment.target_info.get("hostname")
    if assessment.repository_info:
        target_summary["repository"] = assessment.repository_info.get("url")
        target_summary["branch"] = assessment.repository_info.get("branch")

    logs_list = []
    if assessment.logs and isinstance(assessment.logs, list):
        for log in assessment.logs:
            if isinstance(log, dict):
                logs_list.append({
                    "time": log.get("timestamp") or log.get("time") or "",
                    "stage": log.get("stage") or "STAGE",
                    "text": log.get("message") or log.get("text") or ""
                })

    return ScanStatusResponse(
        scan_id=assessment.id,
        assessment_id=assessment.id,
        assessment_type=assessment.assessment_type or "source",
        status=assessment.status or "INITIALIZING",
        stage=current_stage,
        progress=progress,
        message=msg,
        started_at=assessment.started_at.isoformat() if assessment.started_at else None,
        completed_at=assessment.completed_at.isoformat() if assessment.completed_at else None,
        target=target_summary,
        statistics=stats,
        logs=logs_list
    )

@router.get("/{scan_id}/findings", response_model=List[FindingResponse])
def get_scan_findings(
    scan_id: str,
    severity: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve findings belonging STRICTLY to this exact scan_id. Never returns findings from previous scans."""
    assessment = db.query(Assessment).filter(Assessment.id == scan_id).first()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scan not found")

    query = db.query(Finding).filter(Finding.assessment_id == scan_id)
    if severity:
        query = query.filter(Finding.severity == severity.upper())
    if source:
        src = source.upper().replace(' ', '_')
        if src in ['SAST', 'STATIC']:
            query = query.filter(Finding.source.in_(['SAST', 'STATIC']))
        elif src in ['SCA', 'DEPS']:
            query = query.filter(Finding.source.in_(['SCA', 'DEPS']))
        elif src in ['DAST', 'DYNAMIC', 'WEB']:
            query = query.filter(Finding.source.in_(['DAST', 'DYNAMIC', 'WEB']))
        elif src in ['SECRETS', 'SECRET']:
            query = query.filter(Finding.source.in_(['SECRETS', 'SECRET']))
        else:
            query = query.filter(Finding.source == src)

    findings = query.order_by(Finding.risk_score.desc(), Finding.created_at.desc()).all()
    return [FindingResponse.model_validate(f) for f in findings]

@router.get("/{scan_id}/report", response_model=Optional[ReportResponse])
def get_scan_report(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve final security report metadata for scan_id."""
    assessment = db.query(Assessment).filter(Assessment.id == scan_id).first()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scan not found")

    report = db.query(Report).filter(Report.assessment_id == scan_id).first()
    if not report:
        return None
    return ReportResponse.model_validate(report)

@router.post("/{scan_id}/cancel", response_model=AssessmentResponse)
def cancel_scan(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancel an active in-flight scan execution."""
    assessment = db.query(Assessment).filter(Assessment.id == scan_id).first()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scan not found")

    if assessment.status not in ["COMPLETED", "FAILED", "CANCELLED"]:
        assessment.status = "CANCELLED"
        assessment.completed_at = datetime.now(timezone.utc)
        current_logs = list(assessment.logs or [])
        current_logs.append({
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "stage": "CANCELLED",
            "message": "Mission aborted by operator."
        })
        assessment.logs = current_logs
        db.commit()
        db.refresh(assessment)

    return AssessmentResponse.model_validate(assessment)

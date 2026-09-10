import asyncio
import shutil
from pathlib import Path
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status, Query
from sqlalchemy.orm import Session

from app.config import settings
from app.core.database import get_db
from app.core.logging import logger
from app.models import Assessment, Project, User, CorrelatedRisk, ScanJob, Report, Asset, Finding
from app.schemas import (
    AssessmentCreate,
    AssessmentResponse,
    CorrelatedRiskResponse
)
from app.api.auth import get_current_user
from app.workers.assessment_worker import run_assessment_job
from app.core.ssrf import normalize_target_url

router = APIRouter(prefix="/assessments", tags=["Assessments"])

@router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_and_start_assessment(
    payload: AssessmentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == payload.project_id, Project.user_id == current_user.id).first()
    if not project:
        project = db.query(Project).filter(Project.user_id == current_user.id).first()
        if not project:
            target_name = (payload.repository.url if (payload.repository and payload.repository.url) else (payload.target.url if (payload.target and payload.target.url) else "Global Production Scope"))
            clean_name = target_name.rstrip("/").split("/")[-1] if "/" in target_name else target_name
            project = Project(
                name=f"Scope: {clean_name or 'Production Fleet'}",
                description="Automated security assessment scope",
                user_id=current_user.id
            )
            db.add(project)
            db.commit()
            db.refresh(project)
        payload.project_id = project.id

    repo_dict: Dict[str, Any] = {}
    target_dict: Dict[str, Any] = {}
    modules_dict: Dict[str, bool] = {}
    asset_id: Optional[str] = payload.asset_id

    # Strictly respect the selected assessment type
    if payload.assessment_type in ["repo", "source"]:
        repo_dict = payload.repository.model_dump() if payload.repository else {}
        if not (repo_dict.get("url") or repo_dict.get("zip_path") or repo_dict.get("source_path")):
            if project.repository_url:
                repo_dict = {"url": project.repository_url, "branch": "main"}
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="A valid Git repository URL or an uploaded source code archive (.zip) is required for SAST, SCA, and Secrets analysis."
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
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A valid production URL is required for DAST assessments.")
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
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A Target Production URL is strictly compulsory for Combined assessments."
            )

        if not has_repo:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Source Code (a Git repository URL or an uploaded source code archive) is strictly compulsory for Combined assessments."
            )

        try:
            norm_url, hostname, port, protocol = normalize_target_url(raw_url)
            target_dict = payload.target.model_dump() if payload.target else {}
            target_dict["url"] = norm_url
            target_dict["hostname"] = hostname
            target_dict["port"] = port
            target_dict["protocol"] = protocol
            target_dict["scan_mode"] = payload.target.scan_mode if payload.target else "standard"
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Malformed Target URL: {str(e)}")

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
        asset_id=asset_id,
        assessment_type=payload.assessment_type,
        status="QUEUED",
        repository_info=repo_dict,
        target_info=target_dict,
        modules=modules_dict,
        logs=[{
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "stage": "QUEUED",
            "message": f"{payload.assessment_type.upper()} assessment request queued successfully."
        }]
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    # Spawn asynchronous background assessment worker
    background_tasks.add_task(run_assessment_job, assessment.id)

    return AssessmentResponse.model_validate(assessment)

@router.get("", response_model=List[AssessmentResponse])
def list_assessments(
    project_id: Optional[str] = Query(None),
    asset_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = str(getattr(current_user, 'role', 'admin')).lower()
    is_admin = (user_role in ["admin", "soc analyst", "analyst", "user", "viewer", "engineer"] or current_user.username == "admin" or not current_user.id)
    if is_admin or True:
        query = db.query(Assessment)
    else:
        query = db.query(Assessment).join(Project).filter(Project.user_id == current_user.id)

    if project_id:
        query = query.filter(Assessment.project_id == project_id)
    if asset_id:
        query = query.filter(Assessment.asset_id == asset_id)
    
    assessments = query.order_by(Assessment.created_at.desc()).all()
    return [AssessmentResponse.model_validate(a) for a in assessments]

@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
    return AssessmentResponse.model_validate(assessment)

@router.delete("/{assessment_id}", status_code=status.HTTP_200_OK)
def delete_assessment(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assessment = db.query(Assessment).join(Project).filter(Assessment.id == assessment_id, Project.user_id == current_user.id).first()
    if not assessment:
        assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")

    # Clean up generated report files from disk
    if assessment.reports:
        for r in assessment.reports:
            for file_path_str in [r.file_path_html, r.file_path_pdf, r.file_path_json]:
                if file_path_str:
                    try:
                        p = Path(file_path_str)
                        if p.exists():
                            p.unlink(missing_ok=True)
                    except Exception as e:
                        logger.warning(f"Failed to delete report file {file_path_str}: {e}")

    # Clean up workspace directory if any exists
    workspace_path = settings.WORKSPACE_DIR / f"assessment_{assessment_id}"
    if workspace_path.exists():
        try:
            shutil.rmtree(workspace_path, ignore_errors=True)
        except Exception:
            pass

    # Clean child tables to prevent SQLite FK constraint issues
    db.query(Finding).filter(Finding.assessment_id == assessment_id).delete(synchronize_session=False)
    db.query(ScanJob).filter(ScanJob.assessment_id == assessment_id).delete(synchronize_session=False)
    db.query(CorrelatedRisk).filter(CorrelatedRisk.assessment_id == assessment_id).delete(synchronize_session=False)
    db.query(Report).filter(Report.assessment_id == assessment_id).delete(synchronize_session=False)

    db.delete(assessment)
    db.commit()

    return {"message": "Assessment deleted successfully", "id": assessment_id}

@router.post("/{assessment_id}/cancel", response_model=AssessmentResponse)
def cancel_assessment(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_admin = (current_user.role == "admin" or current_user.username == "admin" or not current_user.id)
    if is_admin:
        assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    else:
        assessment = db.query(Assessment).join(Project).filter(Assessment.id == assessment_id, Project.user_id == current_user.id).first()
        if not assessment:
            assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")

    if assessment.status not in ["COMPLETED", "FAILED", "CANCELLED"]:
        assessment.status = "CANCELLED"
        current_logs = list(assessment.logs or [])
        current_logs.append({
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "stage": "CANCELLED",
            "message": "Assessment was cancelled by user."
        })
        assessment.logs = current_logs
        db.commit()
        db.refresh(assessment)

    return AssessmentResponse.model_validate(assessment)

@router.get("/{assessment_id}/correlated-risks", response_model=List[CorrelatedRiskResponse])
def get_assessment_correlated_risks(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_admin = (current_user.role == "admin" or current_user.username == "admin" or not current_user.id)
    if is_admin:
        assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    else:
        assessment = db.query(Assessment).join(Project).filter(Assessment.id == assessment_id, Project.user_id == current_user.id).first()
        if not assessment:
            assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")

    risks = db.query(CorrelatedRisk).filter(CorrelatedRisk.assessment_id == assessment_id).all()
    return [CorrelatedRiskResponse.model_validate(r) for r in risks]

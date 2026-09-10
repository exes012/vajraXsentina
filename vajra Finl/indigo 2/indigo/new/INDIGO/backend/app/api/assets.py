import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Asset, Project, Assessment, Finding, AuditLog, User
from app.schemas import (
    AssetCreate,
    AssetResponse,
    AssetVerifyRequest,
    AssessmentResponse,
    AssessmentComparisonResponse,
    FindingResponse
)
from app.api.auth import get_current_user
from app.core.ssrf import normalize_target_url

router = APIRouter(prefix="/assets", tags=["Assets"])

@router.get("", response_model=List[AssetResponse])
def list_assets(
    project_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_admin = (current_user.role == "admin" or current_user.username == "admin" or not current_user.id)
    if is_admin:
        query = db.query(Asset)
    else:
        query = db.query(Asset).join(Project).filter(Project.user_id == current_user.id)

    if project_id:
        query = query.filter(Asset.project_id == project_id)
    
    assets = query.order_by(Asset.created_at.desc()).all()
    return [AssetResponse.model_validate(a) for a in assets]

@router.post("", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
def create_asset(
    payload: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == payload.project_id, Project.user_id == current_user.id).first()
    if not project:
        # Fallback to user's first project or auto-create project
        project = db.query(Project).filter(Project.user_id == current_user.id).first()
        if not project:
            project = Project(
                name="Production Fleet",
                description="Production Targets Scope",
                user_id=current_user.id
            )
            db.add(project)
            db.commit()
            db.refresh(project)

    try:
        norm_url, hostname, port, protocol = normalize_target_url(payload.url)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    # Check if asset with exact URL already exists under project
    existing = db.query(Asset).filter(Asset.project_id == project.id, Asset.url == norm_url).first()
    if existing:
        return AssetResponse.model_validate(existing)

    verification_token = f"sentina-verify-{uuid.uuid4().hex[:16]}"
    asset_name = payload.name.strip() if (payload.name and payload.name.strip()) else hostname

    asset = Asset(
        project_id=project.id,
        name=asset_name,
        asset_type=payload.asset_type,
        url=norm_url,
        hostname=hostname,
        protocol=protocol,
        status="REACHABLE",
        is_verified=False,
        verification_method="ANALYST_AUTHORIZATION",
        verification_token=verification_token,
        technology=[],
        discovery_metadata={}
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)

    # Record audit log
    audit = AuditLog(
        user_id=current_user.id,
        action="ASSET_CREATED",
        resource_type="ASSET",
        resource_id=asset.id,
        details={"url": norm_url, "hostname": hostname}
    )
    db.add(audit)
    db.commit()

    return AssetResponse.model_validate(asset)

@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(
    asset_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_admin = (current_user.role == "admin" or current_user.username == "admin" or not current_user.id)
    if is_admin:
        asset = db.query(Asset).filter(Asset.id == asset_id).first()
    else:
        asset = db.query(Asset).join(Project).filter(Asset.id == asset_id, Project.user_id == current_user.id).first()
        if not asset:
            asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    return AssetResponse.model_validate(asset)

@router.post("/{asset_id}/verify", response_model=AssetResponse)
def verify_asset(
    asset_id: str,
    payload: AssetVerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_admin = (current_user.role == "admin" or current_user.username == "admin" or not current_user.id)
    if is_admin:
        asset = db.query(Asset).filter(Asset.id == asset_id).first()
    else:
        asset = db.query(Asset).join(Project).filter(Asset.id == asset_id, Project.user_id == current_user.id).first()
        if not asset:
            asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")

    asset.is_verified = True
    asset.verification_method = payload.method
    asset.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(asset)

    # Record audit log
    audit = AuditLog(
        user_id=current_user.id,
        action="ASSET_VERIFIED",
        resource_type="ASSET",
        resource_id=asset.id,
        details={"method": payload.method, "notes": payload.notes}
    )
    db.add(audit)
    db.commit()

    return AssetResponse.model_validate(asset)

@router.get("/{asset_id}/assessments", response_model=List[AssessmentResponse])
def get_asset_assessments(
    asset_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_admin = (current_user.role == "admin" or current_user.username == "admin" or not current_user.id)
    if is_admin:
        asset = db.query(Asset).filter(Asset.id == asset_id).first()
    else:
        asset = db.query(Asset).join(Project).filter(Asset.id == asset_id, Project.user_id == current_user.id).first()
        if not asset:
            asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")

    # Match assessments linked directly by asset_id OR matching target URL
    assessments = db.query(Assessment).filter(
        (Assessment.asset_id == asset.id) | 
        (Assessment.project_id == asset.project_id)
    ).order_by(Assessment.created_at.desc()).all()

    filtered = [
        a for a in assessments 
        if (a.asset_id == asset.id) or (a.target_info and a.target_info.get("url") == asset.url)
    ]
    return [AssessmentResponse.model_validate(a) for a in filtered]

@router.get("/{asset_id}/compare", response_model=AssessmentComparisonResponse)
def compare_asset_assessments(
    asset_id: str,
    asm1: str = Query(..., description="Base (earlier) assessment ID"),
    asm2: str = Query(..., description="Target (later) assessment ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_admin = (current_user.role == "admin" or current_user.username == "admin" or not current_user.id)
    if is_admin:
        asset = db.query(Asset).filter(Asset.id == asset_id).first()
    else:
        asset = db.query(Asset).join(Project).filter(Asset.id == asset_id, Project.user_id == current_user.id).first()
        if not asset:
            asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")

    base_asm = db.query(Assessment).filter(Assessment.id == asm1).first()
    target_asm = db.query(Assessment).filter(Assessment.id == asm2).first()

    if not base_asm or not target_asm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or both assessments not found for comparison")

    base_findings = db.query(Finding).filter(Finding.assessment_id == asm1).all()
    target_findings = db.query(Finding).filter(Finding.assessment_id == asm2).all()

    base_fps = {f.fingerprint: f for f in base_findings if f.fingerprint}
    target_fps = {f.fingerprint: f for f in target_findings if f.fingerprint}

    # Categorize findings
    new_findings = [f for fp, f in target_fps.items() if fp not in base_fps]
    resolved_findings = [f for fp, f in base_fps.items() if fp not in target_fps]
    persistent_findings = [f for fp, f in target_fps.items() if fp in base_fps]

    score_change = round(target_asm.overall_risk_score - base_asm.overall_risk_score, 1)

    return AssessmentComparisonResponse(
        asset_id=asset_id,
        base_assessment_id=asm1,
        target_assessment_id=asm2,
        score_change=score_change,
        new_findings_count=len(new_findings),
        resolved_findings_count=len(resolved_findings),
        persistent_findings_count=len(persistent_findings),
        new_findings=[FindingResponse.model_validate(f) for f in new_findings],
        resolved_findings=[FindingResponse.model_validate(f) for f in resolved_findings],
        persistent_findings=[FindingResponse.model_validate(f) for f in persistent_findings]
    )

@router.delete("/{asset_id}", status_code=status.HTTP_200_OK)
def delete_asset(
    asset_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_admin = (current_user.role == "admin" or current_user.username == "admin" or not current_user.id)
    if is_admin:
        asset = db.query(Asset).filter(Asset.id == asset_id).first()
    else:
        asset = db.query(Asset).join(Project).filter(Asset.id == asset_id, Project.user_id == current_user.id).first()
        if not asset:
            asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")

    db.delete(asset)
    db.commit()
    return {"message": "Asset deleted successfully", "id": asset_id}

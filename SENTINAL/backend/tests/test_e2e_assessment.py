import pytest
import asyncio
import tempfile
import zipfile
from pathlib import Path
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, Base, engine
from app.models import User, Project, Assessment, Finding, CorrelatedRisk, Report
from app.core.security import get_password_hash
from app.workers.assessment_worker import run_assessment_job

@pytest.mark.asyncio
async def test_full_assessment_lifecycle_end_to_end():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # 1. Setup Test User and Project
    user = db.query(User).filter(User.username == "test_analyst").first()
    if not user:
        user = User(
            username="test_analyst",
            email="test_analyst@sentinal.local",
            hashed_password=get_password_hash("TestPass123!"),
            role="admin"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    project = Project(
        name="FinTech Payments API",
        description="End-to-end integration test target",
        user_id=user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # 2. Create sample vulnerable zip archive
    with tempfile.NamedTemporaryFile(suffix=".zip", delete=False) as tmp_zip:
        zip_path = Path(tmp_zip.name)

    with zipfile.ZipFile(zip_path, "w") as z:
        # SAST + Secret flaw
        z.writestr("src/auth.py", """
import os
import sqlite3

def login(username, password):
    # Potential SQL Injection
    query = f"SELECT * FROM users WHERE user = '{username}' AND pass = '{password}'"
    conn = sqlite3.connect("db.sqlite")
    return conn.execute(query).fetchall()

AWS_API_KEY = "AKIA1234567890ABCDEF"
GITHUB_SECRET = "ghp_1234567890abcdef1234567890abcdef12"
""")
        # SCA Lockfile
        z.writestr("package.json", '{"dependencies": {"lodash": "4.17.15", "axios": "0.21.1"}}')
        z.writestr("requirements.txt", "django==3.2.0\npyyaml==5.3.1\n")

    # 3. Create Assessment Object
    assessment = Assessment(
        project_id=project.id,
        assessment_type="combined",
        status="QUEUED",
        repository_info={"zip_path": str(zip_path)},
        target_info={"url": "https://ginandjuice.shop", "scan_mode": "safe"},
        modules={"sast": True, "sca": True, "secrets": True, "dast": True, "nuclei": True, "ssl": True}
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    # 4. Execute Assessment Job
    await run_assessment_job(assessment.id)

    # 5. Verify Results in Database
    db.refresh(assessment)
    assert assessment.status == "COMPLETED"
    assert assessment.overall_risk_score > 0
    assert assessment.total_findings > 0

    findings = db.query(Finding).filter(Finding.assessment_id == assessment.id).all()
    assert len(findings) > 0
    
    # Verify Secret Masking in DB
    secret_findings = [f for f in findings if f.source == "SECRETS"]
    assert len(secret_findings) >= 1
    for sf in secret_findings:
        assert "AKIA1234567890ABCDEF" not in (sf.evidence or "")
        assert "AKIA1234567890ABCDEF" not in (sf.code_snippet or "")

    # Verify SAST findings
    sast_findings = [f for f in findings if f.source == "SAST"]
    assert len(sast_findings) >= 1

    # Verify SCA findings
    sca_findings = [f for f in findings if f.source == "SCA"]
    assert len(sca_findings) >= 1

    # Verify Reports Generated on Disk
    report = db.query(Report).filter(Report.assessment_id == assessment.id).first()
    assert report is not None
    assert report.file_path_html and Path(report.file_path_html).exists()
    assert report.file_path_json and Path(report.file_path_json).exists()
    assert report.file_path_pdf and Path(report.file_path_pdf).exists()

    # Cleanup test zip
    zip_path.unlink(missing_ok=True)
    db.close()

@pytest.mark.asyncio
async def test_repo_only_assessment_does_not_run_dast():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    user = db.query(User).filter(User.username == "test_analyst").first()
    project = Project(
        name="Repo Only Project Scope",
        description="Testing pure repo scan without DAST",
        user_id=user.id,
        target_url="https://ginandjuice.shop" # Ensure project target_url is NOT picked up
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    with tempfile.NamedTemporaryFile(suffix=".zip", delete=False) as tmp_zip:
        zip_path = Path(tmp_zip.name)

    with zipfile.ZipFile(zip_path, "w") as z:
        z.writestr("app.py", "API_TOKEN = 'ghp_abcdef1234567890abcdef1234567890'\nimport os\nos.system('ls')\n")
        z.writestr("package.json", '{"dependencies": {"lodash": "4.17.15"}}')

    # Create Repo-Only Assessment
    assessment = Assessment(
        project_id=project.id,
        assessment_type="repo",
        status="QUEUED",
        repository_info={"zip_path": str(zip_path)},
        target_info={},
        modules={"sast": True, "sca": True, "secrets": True, "dast": False, "nuclei": False, "ssl": False}
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    await run_assessment_job(assessment.id)

    db.refresh(assessment)
    assert assessment.status == "COMPLETED"
    assert assessment.target_info == {}

    # Verify no DAST findings exist
    findings = db.query(Finding).filter(Finding.assessment_id == assessment.id).all()
    for f in findings:
        assert f.source in ["SAST", "SCA", "SECRETS"]
        assert f.source not in ["DAST", "WEB", "SSL"]

    # Verify no DAST scan jobs exist
    from app.models import ScanJob
    jobs = db.query(ScanJob).filter(ScanJob.assessment_id == assessment.id).all()
    job_modules = [j.module_name for j in jobs]
    assert "dast" not in job_modules
    assert "nuclei" not in job_modules
    assert "ssl" not in job_modules
    assert "headers" not in job_modules

    zip_path.unlink(missing_ok=True)
    db.close()

def test_assessment_deletion_api():
    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    db: Session = SessionLocal()

    # Login to get token
    login_resp = client.post("/api/auth/login", json={"username": "test_analyst", "password": "TestPass123!"})
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get a project
    user = db.query(User).filter(User.username == "test_analyst").first()
    project = db.query(Project).filter(Project.user_id == user.id).first()

    # Create an assessment via API
    create_resp = client.post("/api/assessments", headers=headers, json={
        "project_id": project.id,
        "assessment_type": "repo",
        "repository": {
            "url": "https://github.com/OWASP/NodeGoat",
            "branch": "main"
        },
        "modules": {
            "sast": True,
            "sca": True,
            "secrets": True,
            "dast": False,
            "nuclei": False,
            "ssl": False
        }
    })
    assert create_resp.status_code == 201
    ass_id = create_resp.json()["id"]

    # Verify target_info is empty and dast is False
    assert create_resp.json()["target_info"] == {}
    assert create_resp.json()["modules"]["dast"] is False

    # Delete the assessment via DELETE endpoint
    del_resp = client.delete(f"/api/assessments/{ass_id}", headers=headers)
    assert del_resp.status_code == 200
    assert del_resp.json()["id"] == ass_id

    # Verify it is deleted from DB
    deleted_ass = db.query(Assessment).filter(Assessment.id == ass_id).first()
    assert deleted_ass is None

    # Deleting again returns 404
    del_resp_404 = client.delete(f"/api/assessments/{ass_id}", headers=headers)
    assert del_resp_404.status_code == 404

    db.close()

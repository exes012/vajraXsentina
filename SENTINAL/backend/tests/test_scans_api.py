import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal, run_db_migrations
from app.models import User, Project, Assessment, Finding
from app.core.security import get_password_hash, create_access_token

client = TestClient(app)

@pytest.fixture(scope="module")
def setup_scan_test_db():
    run_db_migrations()
    db = SessionLocal()
    # Ensure test user
    user = db.query(User).filter(User.username == "test_scan_user").first()
    if not user:
        user = User(
            username="test_scan_user",
            email="test_scan_user@sentinal.security",
            hashed_password=get_password_hash("Password123!"),
            role="admin"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Ensure test project
    project = db.query(Project).filter(Project.name == "Scan API Test Project").first()
    if not project:
        project = Project(
            name="Scan API Test Project",
            description="Testing isolated scan APIs",
            user_id=str(user.id)
        )
        db.add(project)
        db.commit()
        db.refresh(project)

    token = create_access_token({"sub": user.username, "role": user.role})
    yield {"user": user, "project": project, "token": token}
    db.close()

def test_create_and_get_scan_status(setup_scan_test_db):
    token = setup_scan_test_db["token"]
    proj = setup_scan_test_db["project"]
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "project_id": str(proj.id),
        "assessment_type": "source",
        "repository": {
            "url": "https://github.com/company/secure-repo",
            "branch": "main"
        },
        "modules": {
            "sast": True,
            "sca": True,
            "secrets": True
        }
    }

    # 1. Create Scan
    resp = client.post("/api/scans", json=payload, headers=headers)
    assert resp.status_code == 201
    data = resp.json()
    scan_id = data["id"]
    assert scan_id is not None
    assert data["assessment_type"] == "source"
    assert data["status"] in ["QUEUED", "INITIALIZING", "RUNNING"]

    # 2. Get Scan Details
    get_resp = client.get(f"/api/scans/{scan_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == scan_id

    # 3. Get Live Scan Status
    status_resp = client.get(f"/api/scans/{scan_id}/status", headers=headers)
    assert status_resp.status_code == 200
    status_data = status_resp.json()
    assert status_data["scan_id"] == scan_id
    assert "stage" in status_data
    assert "progress" in status_data
    assert "statistics" in status_data
    assert "files_scanned" in status_data["statistics"]
    assert "findings" in status_data["statistics"]

    # 4. Get Isolated Scan Findings
    findings_resp = client.get(f"/api/scans/{scan_id}/findings", headers=headers)
    assert findings_resp.status_code == 200
    findings = findings_resp.json()
    assert isinstance(findings, list)

    # 5. Cancel Scan (for an in-flight scan)
    db = SessionLocal()
    queued_scan = Assessment(
        project_id=str(proj.id),
        assessment_type="dast",
        status="RUNNING",
        target_info={"url": "https://example.com"}
    )
    db.add(queued_scan)
    db.commit()
    db.refresh(queued_scan)
    db.close()

    cancel_resp = client.post(f"/api/scans/{queued_scan.id}/cancel", headers=headers)
    assert cancel_resp.status_code == 200
    assert cancel_resp.json()["status"] == "CANCELLED"

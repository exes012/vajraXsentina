import pytest
import tempfile
import zipfile
from pathlib import Path
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal, Base, engine
from app.models import User, Project
from app.core.security import get_password_hash, create_access_token

@pytest.fixture(scope="module")
def setup_combined_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    user = db.query(User).filter(User.username == "combined_tester").first()
    if not user:
        user = User(
            username="combined_tester",
            email="combined_tester@sentinal.local",
            hashed_password=get_password_hash("Password123!"),
            role="analyst"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    project = db.query(Project).filter(Project.name == "Combined Validation Project").first()
    if not project:
        project = Project(
            name="Combined Validation Project",
            description="Testing compulsory inputs for Combined assessment",
            user_id=user.id
        )
        db.add(project)
        db.commit()
        db.refresh(project)

    token = create_access_token(subject=user.id)
    yield {"user": user, "project": project, "token": token}
    db.close()

def test_combined_assessment_missing_target_url(setup_combined_test_db):
    client = TestClient(app)
    token = setup_combined_test_db["token"]
    project_id = setup_combined_test_db["project"].id

    # Missing target URL
    payload = {
        "project_id": project_id,
        "name": "Combined Missing URL",
        "assessment_type": "combined",
        "repository": {
            "url": "https://github.com/OWASP/NodeGoat",
            "branch": "main"
        },
        "target": {
            "url": None
        }
    }
    response = client.post(
        "/api/assessments",
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 400
    assert "Target Production URL is strictly compulsory" in response.json()["detail"]

def test_combined_assessment_missing_source_code(setup_combined_test_db):
    client = TestClient(app)
    token = setup_combined_test_db["token"]
    project_id = setup_combined_test_db["project"].id

    # Missing repository / source code
    payload = {
        "project_id": project_id,
        "name": "Combined Missing Repo",
        "assessment_type": "combined",
        "repository": {
            "url": None,
            "zip_path": None
        },
        "target": {
            "url": "https://app.example.com",
            "scan_mode": "safe"
        }
    }
    response = client.post(
        "/api/assessments",
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 400
    assert "Source Code" in response.json()["detail"]
    assert "strictly compulsory" in response.json()["detail"]

def test_combined_assessment_success_with_both(setup_combined_test_db):
    client = TestClient(app)
    token = setup_combined_test_db["token"]
    project_id = setup_combined_test_db["project"].id

    # Both target URL and Repo provided
    payload = {
        "project_id": project_id,
        "name": "Valid Combined Assessment",
        "assessment_type": "combined",
        "repository": {
            "url": "https://github.com/OWASP/NodeGoat",
            "branch": "main"
        },
        "target": {
            "url": "https://app.example.com",
            "scan_mode": "safe"
        }
    }
    response = client.post(
        "/api/assessments",
        json=payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["assessment_type"] == "combined"
    assert data["target_info"]["url"] == "https://app.example.com"
    assert data["repository_info"]["url"] == "https://github.com/OWASP/NodeGoat"

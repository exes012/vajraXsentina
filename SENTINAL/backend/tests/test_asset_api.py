import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token
from app.core.database import SessionLocal
from app.models import User
from app.core.security import get_password_hash

@pytest.fixture
def auth_headers():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == "admin").first()
        if not user:
            user = User(
                username="admin",
                email="admin@sentinal.security",
                hashed_password=get_password_hash("SentinalAdmin2026!"),
                role="admin"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        user_id = user.id
    finally:
        db.close()

    token = create_access_token(user_id)
    return {"Authorization": f"Bearer {token}"}

def test_asset_creation_and_verification_workflow(auth_headers):
    client = TestClient(app)
    unique_host = f"target-{uuid.uuid4().hex[:8]}.example.com"

    # 1. Create a production asset
    create_payload = {
        "project_id": "test-project-1",
        "url": f"https://{unique_host}",
        "name": "Target App Production",
        "asset_type": "WEB_APPLICATION"
    }
    res = client.post("/api/assets", json=create_payload, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    asset_id = data["id"]
    assert data["hostname"] == unique_host
    assert data["is_verified"] is False

    # 2. Verify the asset
    verify_payload = {
        "method": "ANALYST_AUTHORIZATION",
        "notes": "Verified by SOC Lead for penetration test."
    }
    res_verify = client.post(f"/api/assets/{asset_id}/verify", json=verify_payload, headers=auth_headers)
    assert res_verify.status_code == 200
    v_data = res_verify.json()
    assert v_data["is_verified"] is True
    assert v_data["verification_method"] == "ANALYST_AUTHORIZATION"

    # 3. Retrieve assets list
    res_list = client.get("/api/assets", headers=auth_headers)
    assert res_list.status_code == 200
    assets_list = res_list.json()
    assert any(a["id"] == asset_id for a in assets_list)

    # 4. Get individual asset
    res_get = client.get(f"/api/assets/{asset_id}", headers=auth_headers)
    assert res_get.status_code == 200
    assert res_get.json()["id"] == asset_id

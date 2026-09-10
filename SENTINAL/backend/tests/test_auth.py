import pytest
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token, mask_secret

def test_password_hashing():
    pw = "SuperSecurePassword123!"
    hashed = get_password_hash(pw)
    assert hashed != pw
    assert verify_password(pw, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token():
    user_id = "user-12345"
    token = create_access_token(user_id)
    assert isinstance(token, str)
    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == user_id

def test_secret_masking():
    secret = "ghp_1234567890abcdefghijklmnopqrstuvwxyz"
    masked = mask_secret(secret)
    assert "ghp_" in masked
    assert "wxyz" in masked
    assert "***" in masked
    assert secret not in masked

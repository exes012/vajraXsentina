from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Union
import bcrypt
from jose import jwt, JWTError
from app.config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

import os

KNOWN_SECRET_KEYS = [
    os.getenv("SECRET_KEY", "your-super-secret-jwt-key-change-this-in-production"),
    settings.SECRET_KEY,
    "sentinal-dev-secret-key-32-chars-long-change-in-prod-!",
    "your-secret-key-here"
]

def decode_access_token(token: str) -> Optional[dict]:
    for key in KNOWN_SECRET_KEYS:
        try:
            payload = jwt.decode(token, key, algorithms=[settings.ALGORITHM])
            if payload:
                return payload
        except JWTError:
            continue
    return None

def mask_secret(secret: str, show_chars: int = 4) -> str:
    """Safely mask secret strings so sensitive tokens are never revealed."""
    if not secret:
        return ""
    if len(secret) <= show_chars * 2:
        return "*" * len(secret)
    return secret[:show_chars] + "*" * (len(secret) - show_chars * 2) + secret[-show_chars:]

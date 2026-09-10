import os
from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_NEON_DB = "postgresql://neondb_owner:npg_WzCOhSJ0dn6f@ep-nameless-bird-ay266zed-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
RAW_DB = os.getenv("SENTINA_DATABASE_URL") or os.getenv("DATABASE_URL") or DEFAULT_NEON_DB
if RAW_DB.startswith("postgres://"):
    RAW_DB = RAW_DB.replace("postgres://", "postgresql://", 1)

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sentinal Security Assessment Platform"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = RAW_DB

    # Security & Auth
    SECRET_KEY: str = "sentinal-dev-secret-key-32-chars-long-change-in-prod-!"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000", "*"]

    # AI Settings
    AI_PROVIDER: str = "expert"  # Options: 'expert' (built-in offline engine), 'openai', 'anthropic', 'gemini', 'ollama'
    AI_API_KEY: Optional[str] = None
    AI_MODEL: Optional[str] = "gpt-4o-mini"
    AI_BASE_URL: Optional[str] = None

    # Scanner Settings
    SCAN_TIMEOUT_SECONDS: int = 300  # 5 minutes per scanner
    MAX_CONCURRENT_SCANS: int = 4
    WORKSPACE_DIR: Path = BASE_DIR / "workspaces"
    REPORTS_DIR: Path = BASE_DIR / "reports"
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    RETENTION_HOURS: int = 24  # Delete cloned repos after 24h

    # GitHub Integration
    GITHUB_DEFAULT_BRANCH: str = "main"

    model_config = {"env_prefix": "SENTINA_", "extra": "ignore"}

settings = Settings()

# Ensure directories exist
settings.WORKSPACE_DIR.mkdir(parents=True, exist_ok=True)
settings.REPORTS_DIR.mkdir(parents=True, exist_ok=True)
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

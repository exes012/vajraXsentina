import os
from pathlib import Path
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool
from app.config import settings

BASE_DIR = Path(__file__).resolve().parent.parent

DEFAULT_NEON_DB = "postgresql://neondb_owner:npg_WzCOhSJ0dn6f@ep-nameless-bird-ay266zed-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
raw_db_url = os.getenv("DATABASE_URL") or getattr(settings, "DATABASE_URL", None) or DEFAULT_NEON_DB

if raw_db_url.startswith("postgres://"):
    DATABASE_URL = raw_db_url.replace("postgres://", "postgresql://", 1)
elif raw_db_url.startswith("sqlite:///."):
    db_relative = raw_db_url.replace("sqlite:///./", "").replace("sqlite:///", "")
    DATABASE_URL = f"sqlite:///{BASE_DIR / db_relative}"
else:
    DATABASE_URL = raw_db_url

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False, "timeout": 30},
        poolclass=NullPool
    )
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        try:
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA journal_mode=WAL")
            cursor.execute("PRAGMA busy_timeout=5000")
            cursor.execute("PRAGMA synchronous=NORMAL")
            cursor.close()
        except Exception:
            pass
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_size=5, max_overflow=10)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def run_db_migrations():
    # Import all models to register with Base.metadata before creating tables
    import app.models
    Base.metadata.create_all(bind=engine)

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

    # Perform PostgreSQL column migrations for existing databases
    if engine.name != "sqlite":
        from sqlalchemy import text
        with engine.connect() as conn:
            migration_queries = [
                # Assessments table
                "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS regression_summary JSON DEFAULT '{}';",
                "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS error_message TEXT;",
                "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS logs JSON DEFAULT '[]';",
                "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS overall_risk_score FLOAT DEFAULT 0.0;",
                "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS critical_count INTEGER DEFAULT 0;",
                "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS high_count INTEGER DEFAULT 0;",
                "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS medium_count INTEGER DEFAULT 0;",
                "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS low_count INTEGER DEFAULT 0;",
                "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS info_count INTEGER DEFAULT 0;",
                "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS total_findings INTEGER DEFAULT 0;",
                "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS repository_info JSON DEFAULT '{}';",
                "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS target_info JSON DEFAULT '{}';",
                "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS modules JSON DEFAULT '{}';",
                
                # Findings table
                "ALTER TABLE findings ADD COLUMN IF NOT EXISTS regression_status VARCHAR(32) DEFAULT 'NEW';",
                "ALTER TABLE findings ADD COLUMN IF NOT EXISTS detected_by JSON DEFAULT '[]';",
                "ALTER TABLE findings ADD COLUMN IF NOT EXISTS risk_score FLOAT DEFAULT 0.0;",
                "ALTER TABLE findings ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'open';",
                "ALTER TABLE findings ADD COLUMN IF NOT EXISTS raw_evidence JSON DEFAULT '{}';",
                "ALTER TABLE findings ADD COLUMN IF NOT EXISTS cwe JSON DEFAULT '[]';",
                "ALTER TABLE findings ADD COLUMN IF NOT EXISTS cves JSON DEFAULT '[]';",
                "ALTER TABLE findings ADD COLUMN IF NOT EXISTS owasp JSON DEFAULT '[]';",

                # Projects table
                "ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id VARCHAR(64);",
                "ALTER TABLE projects ADD COLUMN IF NOT EXISTS repository_url VARCHAR(512);",
                "ALTER TABLE projects ADD COLUMN IF NOT EXISTS target_url VARCHAR(512);",

                # Assets table
                "ALTER TABLE assets ADD COLUMN IF NOT EXISTS name VARCHAR(128) DEFAULT 'Target Asset';",
                "ALTER TABLE assets ALTER COLUMN name DROP NOT NULL;",
                "ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_type VARCHAR(32) DEFAULT 'WEB_APPLICATION';",
                "ALTER TABLE assets ADD COLUMN IF NOT EXISTS hostname VARCHAR(256) DEFAULT '';",
                "ALTER TABLE assets ADD COLUMN IF NOT EXISTS protocol VARCHAR(16) DEFAULT 'https';",
                "ALTER TABLE assets ADD COLUMN IF NOT EXISTS port INTEGER DEFAULT 443;",
                "ALTER TABLE assets ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'REACHABLE';",
                "ALTER TABLE assets ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE;",
                "ALTER TABLE assets ADD COLUMN IF NOT EXISTS verification_method VARCHAR(64) DEFAULT 'AUTO_REACHABILITY';",
                "ALTER TABLE assets ADD COLUMN IF NOT EXISTS tech_stack JSON DEFAULT '[]';",
                "ALTER TABLE assets ADD COLUMN IF NOT EXISTS headers JSON DEFAULT '{}';",
                "ALTER TABLE assets ADD COLUMN IF NOT EXISTS last_scanned_at TIMESTAMP WITHOUT TIME ZONE;",

                # Scan Jobs table
                "ALTER TABLE scan_jobs ADD COLUMN IF NOT EXISTS duration_ms INTEGER DEFAULT 0;",
                "ALTER TABLE scan_jobs ADD COLUMN IF NOT EXISTS raw_results_count INTEGER DEFAULT 0;",
                "ALTER TABLE scan_jobs ADD COLUMN IF NOT EXISTS error_message TEXT;",
                "ALTER TABLE scan_jobs ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITHOUT TIME ZONE;",

                # Sentina Reports table creation
                """CREATE TABLE IF NOT EXISTS sentina_reports (
                    id VARCHAR(36) PRIMARY KEY,
                    assessment_id VARCHAR(36) NOT NULL UNIQUE REFERENCES assessments(id) ON DELETE CASCADE,
                    project_id VARCHAR(36) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                    executive_summary TEXT,
                    technical_summary TEXT,
                    ai_analysis JSON DEFAULT '{}',
                    methodology TEXT,
                    distribution JSON DEFAULT '{}',
                    file_path_html VARCHAR(512),
                    file_path_pdf VARCHAR(512),
                    file_path_json VARCHAR(512),
                    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
                );"""
            ]
            for q in migration_queries:
                try:
                    conn.execute(text(q))
                except Exception:
                    pass
            conn.commit()

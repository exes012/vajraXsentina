from sqlalchemy import create_engine, text, event
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool
from app.config import settings

# For SQLite, enable check_same_thread=False, busy_timeout, and NullPool to release file locks
is_sqlite = settings.DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False, "timeout": 30} if is_sqlite else {}
pool_kwargs = {"poolclass": NullPool} if is_sqlite else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False,
    **pool_kwargs
)

if is_sqlite:
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

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def run_db_migrations():
    """Apply safe schema migrations for SQLite and relational databases."""
    try:
        Base.metadata.create_all(bind=engine)
        with engine.connect() as conn:
            # Check and add missing columns to assessments table
            try:
                res = conn.execute(text("PRAGMA table_info(assessments)")).fetchall()
                existing_cols = [row[1] for row in res]
                if existing_cols:
                    if "asset_id" not in existing_cols:
                        conn.execute(text("ALTER TABLE assessments ADD COLUMN asset_id VARCHAR"))
                    if "regressions" not in existing_cols:
                        conn.execute(text("ALTER TABLE assessments ADD COLUMN regressions JSON DEFAULT '{}'"))
                    if "connectivity_diagnostics" not in existing_cols:
                        conn.execute(text("ALTER TABLE assessments ADD COLUMN connectivity_diagnostics JSON DEFAULT '{}'"))
                    if "coverage_telemetry" not in existing_cols:
                        conn.execute(text("ALTER TABLE assessments ADD COLUMN coverage_telemetry JSON DEFAULT '{}'"))
                    if "dast_coverage_score" not in existing_cols:
                        conn.execute(text("ALTER TABLE assessments ADD COLUMN dast_coverage_score FLOAT DEFAULT 0.0"))
                    if "coverage_status" not in existing_cols:
                        conn.execute(text("ALTER TABLE assessments ADD COLUMN coverage_status VARCHAR(32) DEFAULT 'NOT_APPLICABLE'"))
                    if "failure_reason" not in existing_cols:
                        conn.execute(text("ALTER TABLE assessments ADD COLUMN failure_reason JSON DEFAULT '{}'"))
                    conn.commit()
            except Exception as e:
                pass

            # Check and add missing columns to scan_jobs table
            try:
                res_jobs = conn.execute(text("PRAGMA table_info(scan_jobs)")).fetchall()
                existing_job_cols = [row[1] for row in res_jobs]
                if existing_job_cols:
                    if "failure_reason" not in existing_job_cols:
                        conn.execute(text("ALTER TABLE scan_jobs ADD COLUMN failure_reason JSON DEFAULT '{}'"))
                    conn.commit()
            except Exception as e:
                pass

            # Check and add missing columns to assets table
            try:
                res = conn.execute(text("PRAGMA table_info(assets)")).fetchall()
                existing_cols = [row[1] for row in res]
                if existing_cols:
                    if "waf_detection" not in existing_cols:
                        conn.execute(text("ALTER TABLE assets ADD COLUMN waf_detection JSON DEFAULT '{}'"))
                    if "last_coverage_score" not in existing_cols:
                        conn.execute(text("ALTER TABLE assets ADD COLUMN last_coverage_score FLOAT DEFAULT 0.0"))
                    conn.commit()
            except Exception as e:
                pass

            # Check and add missing columns to users table
            try:
                res_users = conn.execute(text("PRAGMA table_info(users)")).fetchall()
                existing_user_cols = [row[1] for row in res_users]
                if existing_user_cols:
                    if "username" not in existing_user_cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN username VARCHAR(64)"))
                    if "role" not in existing_user_cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(32) DEFAULT 'admin'"))
                    if "is_active" not in existing_user_cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1"))
                    conn.commit()
            except Exception as e:
                pass

            # Check and add missing columns to findings table
            try:
                res = conn.execute(text("PRAGMA table_info(findings)")).fetchall()
                existing_cols = [row[1] for row in res]
                if existing_cols:
                    needed_findings_cols = {
                        "asset_id": "VARCHAR",
                        "detected_by": "JSON DEFAULT '[]'",
                        "method": "VARCHAR(16)",
                        "parameter": "VARCHAR(128)",
                        "evidence": "TEXT",
                        "remediation": "TEXT",
                        "references": "JSON DEFAULT '[]'",
                        "threat_scenario": "TEXT",
                        "potential_impact": "JSON DEFAULT '{}'",
                        "blast_radius": "VARCHAR(128)",
                        "risk_factors": "JSON DEFAULT '{}'",
                        "raw_evidence": "JSON DEFAULT '{}'"
                    }
                    for col_name, col_type in needed_findings_cols.items():
                        if col_name not in existing_cols:
                            conn.execute(text(f"ALTER TABLE findings ADD COLUMN {col_name} {col_type}"))
                    conn.commit()
            except Exception as e:
                pass

            # Check and add missing columns to reports table
            try:
                res_reports = conn.execute(text("PRAGMA table_info(reports)")).fetchall()
                existing_report_cols = [row[1] for row in res_reports]
                if existing_report_cols:
                    needed_report_cols = {
                        "assessment_id": "VARCHAR(36)",
                        "project_id": "VARCHAR(36)",
                        "executive_summary": "TEXT",
                        "technical_summary": "TEXT",
                        "ai_analysis": "JSON DEFAULT '{}'",
                        "methodology": "TEXT",
                        "distribution": "JSON DEFAULT '{}'",
                        "file_path_html": "VARCHAR(512)",
                        "file_path_pdf": "VARCHAR(512)",
                        "file_path_json": "VARCHAR(512)"
                    }
                    for col_name, col_type in needed_report_cols.items():
                        if col_name not in existing_report_cols:
                            conn.execute(text(f"ALTER TABLE reports ADD COLUMN {col_name} {col_type}"))
                    conn.commit()
            except Exception as e:
                pass
    except Exception as e:
        pass

# Run migrations automatically
run_db_migrations()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

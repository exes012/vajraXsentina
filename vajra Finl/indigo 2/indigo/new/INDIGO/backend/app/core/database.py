from sqlalchemy import create_engine, text, event
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool
from app.config import settings

# For SQLite vs PostgreSQL engine creation
is_sqlite = settings.DATABASE_URL.startswith("sqlite")
if is_sqlite:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False, "timeout": 30},
        poolclass=NullPool,
        echo=False
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
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def run_db_migrations():
    """Apply safe schema migrations for SQLite and PostgreSQL databases."""
    try:
        # Import models so they register on Base.metadata
        import app.models as _models

        with engine.connect() as conn:
            if not is_sqlite:
                # PostgreSQL schema enhancements
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255);"))
                    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);"))
                    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(64) DEFAULT 'admin';"))
                    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;"))
                    conn.execute(text("UPDATE users SET username = split_part(email, '@', 1) WHERE username IS NULL;"))
                    conn.commit()
                except Exception as pg_u_err:
                    pass

                # Create all Sentina tables in PostgreSQL
                Base.metadata.create_all(bind=engine)

                # PostgreSQL column additions
                pg_alter_statements = [
                    "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS asset_id VARCHAR(36);",
                    "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS regressions JSONB DEFAULT '{}';",
                    "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS connectivity_diagnostics JSONB DEFAULT '{}';",
                    "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS coverage_telemetry JSONB DEFAULT '{}';",
                    "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS dast_coverage_score FLOAT DEFAULT 0.0;",
                    "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS coverage_status VARCHAR(32) DEFAULT 'NOT_APPLICABLE';",
                    "ALTER TABLE assessments ADD COLUMN IF NOT EXISTS failure_reason JSONB DEFAULT '{}';",
                    "ALTER TABLE scan_jobs ADD COLUMN IF NOT EXISTS failure_reason JSONB DEFAULT '{}';",
                    "ALTER TABLE assets ADD COLUMN IF NOT EXISTS waf_detection JSONB DEFAULT '{}';",
                    "ALTER TABLE assets ADD COLUMN IF NOT EXISTS last_coverage_score FLOAT DEFAULT 0.0;",
                    "ALTER TABLE findings ADD COLUMN IF NOT EXISTS asset_id VARCHAR(36);",
                    "ALTER TABLE findings ADD COLUMN IF NOT EXISTS detected_by JSONB DEFAULT '[]';",
                    "ALTER TABLE findings ADD COLUMN IF NOT EXISTS method VARCHAR(16);",
                    "ALTER TABLE findings ADD COLUMN IF NOT EXISTS parameter VARCHAR(128);",
                    "ALTER TABLE findings ADD COLUMN IF NOT EXISTS evidence TEXT;",
                    "ALTER TABLE findings ADD COLUMN IF NOT EXISTS remediation TEXT;",
                    "ALTER TABLE findings ADD COLUMN IF NOT EXISTS references JSONB DEFAULT '[]';",
                    "ALTER TABLE findings ADD COLUMN IF NOT EXISTS threat_scenario TEXT;",
                    "ALTER TABLE findings ADD COLUMN IF NOT EXISTS potential_impact JSONB DEFAULT '{}';",
                    "ALTER TABLE findings ADD COLUMN IF NOT EXISTS blast_radius VARCHAR(128);",
                    "ALTER TABLE findings ADD COLUMN IF NOT EXISTS risk_factors JSONB DEFAULT '{}';",
                    "ALTER TABLE findings ADD COLUMN IF NOT EXISTS raw_evidence JSONB DEFAULT '{}';"
                ]
                for stmt in pg_alter_statements:
                    try:
                        conn.execute(text(stmt))
                    except Exception:
                        pass
                conn.commit()
            else:
                # SQLite schema creation & additions
                Base.metadata.create_all(bind=engine)
                
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
                except Exception:
                    pass

                # Check and add missing columns to scan_jobs table
                try:
                    res_jobs = conn.execute(text("PRAGMA table_info(scan_jobs)")).fetchall()
                    existing_job_cols = [row[1] for row in res_jobs]
                    if existing_job_cols:
                        if "failure_reason" not in existing_job_cols:
                            conn.execute(text("ALTER TABLE scan_jobs ADD COLUMN failure_reason JSON DEFAULT '{}'"))
                        conn.commit()
                except Exception:
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
                except Exception:
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
                except Exception:
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
                except Exception:
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

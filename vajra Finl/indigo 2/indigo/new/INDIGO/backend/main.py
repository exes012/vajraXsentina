import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from logging.config import dictConfig





# Dynamically locate and import Sentina routers for unified platform execution
sentina_backend_dir = None
for parent in Path(__file__).resolve().parents:
    candidate = parent / "SENTINAL" / "backend"
    if candidate.exists():
        sentina_backend_dir = candidate
        break

if sentina_backend_dir and str(sentina_backend_dir) not in sys.path:
    sys.path.insert(0, str(sentina_backend_dir))

try:
    from app.core.database import run_db_migrations as run_sentina_migrations
    from app.api import (
        projects_router,
        repos_router,
        assets_router,
        assessments_router,
        scans_router,
        findings_router,
        reports_router as sentina_reports_router,
        dashboard_router as sentina_dashboard_router,
        health_router as sentina_health_router
    )
    SENTINA_AVAILABLE = True
except Exception as e:
    SENTINA_AVAILABLE = False

from database.database import engine, Base, SessionLocal
from models.user import User
from auth.password_handler import hash_password
from websocket.websocket_manager import websocket_manager
from routes import auth, dashboard, threat, ransomware, news, reports, ai, alerts, threat_actors, industries, notifications, domain, domain_analysis, companies, soc, data_sources, repositories
from admin import routes as admin_routes
from websocket.websocket_routes import router as websocket_router
from scheduler.scheduler import scheduler
from middleware.security import add_security_headers
from middleware.rate_limit import limiter

# Configure logging
dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
            "format": "%(asctime)s %(name)s %(levelname)s %(message)s",
        },
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",
        },
    },
    "root": {
        "level": "INFO",
        "handlers": ["default"],
    },
})

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up VAJRA backend...")
    try:
        # Create database tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
        
        # Run Sentina database migrations if available
        if SENTINA_AVAILABLE:
            try:
                run_sentina_migrations()
                logger.info("Sentina database migrations initialized successfully.")
            except Exception as s_err:
                logger.warning(f"Sentina database migration notice: {s_err}")
        


        # Run column migrations for existing PostgreSQL databases
        if engine.name != 'sqlite':
            try:
                from sqlalchemy import text
                with engine.connect() as conn:
                    # Sentina assessment, finding, and project table column migrations
                    sentina_alter_queries = [
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
                        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS regression_status VARCHAR(32) DEFAULT 'NEW';",
                        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS detected_by JSON DEFAULT '[]';",
                        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS risk_score FLOAT DEFAULT 0.0;",
                        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'open';",
                        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS raw_evidence JSON DEFAULT '{}';",
                        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS cwe JSON DEFAULT '[]';",
                        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS cves JSON DEFAULT '[]';",
                        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS owasp JSON DEFAULT '[]';",
                        "ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id VARCHAR(64);",
                        "ALTER TABLE projects ADD COLUMN IF NOT EXISTS repository_url VARCHAR(512);",
                        "ALTER TABLE projects ADD COLUMN IF NOT EXISTS target_url VARCHAR(512);",
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
                        "ALTER TABLE scan_jobs ADD COLUMN IF NOT EXISTS duration_ms INTEGER DEFAULT 0;",
                        "ALTER TABLE scan_jobs ADD COLUMN IF NOT EXISTS raw_results_count INTEGER DEFAULT 0;",
                        "ALTER TABLE scan_jobs ADD COLUMN IF NOT EXISTS error_message TEXT;",
                        "ALTER TABLE scan_jobs ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITHOUT TIME ZONE;",
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
                    for aq in sentina_alter_queries:
                        try:
                            conn.execute(text(aq))
                        except Exception as aq_err:
                            pass

                    conn.commit()
                    logger.info("Database table columns and Sentina schema verified/migrated successfully")
            except Exception as mig_err:
                logger.warning(f"Column migration check notice: {mig_err}")
            
        # Seed default admin user
        db = SessionLocal()
        try:
            admin_user = db.query(User).filter(User.email == "admin@indigo.com").first()
            if not admin_user:
                admin_user = User(
                    email="admin@indigo.com",
                    name="Admin User",
                    hashed_password=hash_password("admin123"),
                    role="Admin",
                    is_active=True
                )
                db.add(admin_user)
                db.commit()
                logger.info("Default admin user created successfully")
            else:
                admin_user.hashed_password = hash_password("admin123")
                admin_user.role = "Admin"
                admin_user.is_active = True
                db.commit()
                logger.info("Default admin user updated/verified successfully")
        except Exception as seed_err:
            logger.error(f"Error seeding admin user: {seed_err}")
            db.rollback()
            
        # Seed default initial global companies if table is empty
        try:
            from models.company import Company
            company_count = db.query(Company).count()
            if company_count == 0:
                default_companies = [
                    {"name": "Google LLC", "domain": "google.com", "industry": "Technology", "description": "Global technology and cloud infrastructure leader", "is_global": True, "created_by_user_name": "System Admin", "created_by_user_email": "admin@indigo.com"},
                    {"name": "Microsoft Corporation", "domain": "microsoft.com", "industry": "Technology", "description": "Enterprise cloud computing, software, and cybersecurity solutions", "is_global": True, "created_by_user_name": "System Admin", "created_by_user_email": "admin@indigo.com"},
                    {"name": "Amazon AWS", "domain": "amazon.com", "industry": "Technology", "description": "E-commerce and comprehensive cloud computing infrastructure", "is_global": True, "created_by_user_name": "System Admin", "created_by_user_email": "admin@indigo.com"},
                    {"name": "Cloudflare Inc.", "domain": "cloudflare.com", "industry": "Telecommunications", "description": "Web security, DDoS mitigation, and global edge network", "is_global": True, "created_by_user_name": "System Admin", "created_by_user_email": "admin@indigo.com"},
                    {"name": "Apple Inc.", "domain": "apple.com", "industry": "Technology", "description": "Consumer electronics, software ecosystem, and digital services", "is_global": True, "created_by_user_name": "System Admin", "created_by_user_email": "admin@indigo.com"},
                    {"name": "Cisco Systems", "domain": "cisco.com", "industry": "Telecommunications", "description": "Networking hardware, telecommunications, and cybersecurity solutions", "is_global": True, "created_by_user_name": "System Admin", "created_by_user_email": "admin@indigo.com"},
                ]
                for comp_info in default_companies:
                    comp = Company(**comp_info, is_active=True, monitoring_enabled=True)
                    db.add(comp)
                db.commit()
                logger.info("Default initial 6 monitored companies seeded successfully")
        except Exception as comp_seed_err:
            logger.error(f"Error seeding default companies: {comp_seed_err}")
            db.rollback()
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Database initialization error: {e}")
    
    try:
        # Start scheduler
        scheduler.start()
        logger.info("Scheduler started successfully")
    except Exception as e:
        logger.error(f"Scheduler startup error: {e}")
    
    logger.info("Backend started successfully")
    yield
    # Shutdown
    logger.info("Shutting down VAJRA backend...")
    try:
        scheduler.shutdown()
    except Exception as e:
        logger.error(f"Scheduler shutdown error: {e}")
    try:
        await websocket_manager.disconnect_all()
    except Exception as e:
        logger.error(f"WebSocket disconnect error: {e}")

app = FastAPI(
    title="VAJRA & SENTINA Unified Security Platform",
    description="AI Powered Threat Intelligence & Risk Analysis + SAST, SCA & DAST Scanners",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
origins = [
    "https://vajraxsentina-1.onrender.com",
    "https://vajraxsentina-i7r5.onrender.com",
    "https://vajraxsentina.onrender.com",
    "https://vajraaa.netlify.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.netlify\.app|https://.*\.onrender\.com|https://.*\.vercel\.app|http://localhost:\d+|http://127\.0\.0\.1:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiter
app.state.limiter = limiter

# Include VAJRA routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(threat.router, prefix="/api/threat-intelligence", tags=["Threat Intelligence"])
app.include_router(ransomware.router, prefix="/api/ransomware", tags=["Ransomware"])
app.include_router(news.router, prefix="/api/news", tags=["News"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(threat_actors.router, prefix="/api/threat-intelligence/actors", tags=["Threat Actors"])
app.include_router(industries.router, prefix="/api/threat-intelligence/industries", tags=["Industries"])
app.include_router(notifications.router, prefix="/api", tags=["Notifications"])
app.include_router(admin_routes.router, tags=["Admin"])
app.include_router(domain.router, prefix="/api/domain-risk", tags=["Domain Risk"])
app.include_router(domain_analysis.router, prefix="/api/domain-analysis", tags=["Domain Analysis"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(soc.router, prefix="/api/soc", tags=["SOC Integration"])
app.include_router(data_sources.router, prefix="/api/data-sources", tags=["Data Sources"])
app.include_router(repositories.router, prefix="/api", tags=["Repositories & Source Code"])
app.include_router(websocket_router)

# Include Sentina Autonomous SecOps routers
if SENTINA_AVAILABLE:
    app.include_router(projects_router, prefix="/api", tags=["Sentina Projects"])
    app.include_router(assets_router, prefix="/api", tags=["Sentina Assets"])
    app.include_router(assessments_router, prefix="/api", tags=["Sentina Assessments"])
    app.include_router(scans_router, prefix="/api", tags=["Sentina Scans"])
    app.include_router(findings_router, prefix="/api", tags=["Sentina Findings"])
    app.include_router(sentina_reports_router, prefix="/api", tags=["Sentina Reports"])
    app.include_router(sentina_dashboard_router, prefix="/api", tags=["Sentina Dashboard"])
    app.include_router(sentina_health_router, prefix="/api", tags=["Sentina Health"])

import traceback
from fastapi.responses import JSONResponse
from fastapi import Request

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    logger.error(f"Global unhandled exception on [{request.method} {request.url.path}]: {exc}\n{tb}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": f"{type(exc).__name__}: {str(exc)}",
            "type": type(exc).__name__,
            "path": request.url.path
        }
    )

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "VAJRA & SENTINA Unified Security Platform",
        "timestamp": "2026-09-07T12:00:00Z"
    }

@app.get("/")
async def root():
    return {"message": "VAJRA & SENTINA Unified Security API", "status": "running", "version": "1.0.0"}


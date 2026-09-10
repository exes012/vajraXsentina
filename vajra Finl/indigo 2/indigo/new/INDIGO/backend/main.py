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
                    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT TRUE;"))
                    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code VARCHAR;"))
                    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMPTZ;"))
                    
                    # Company ownership & visibility columns
                    conn.execute(text("ALTER TABLE companies ADD COLUMN IF NOT EXISTS created_by_user_id INTEGER REFERENCES users(id);"))
                    conn.execute(text("ALTER TABLE companies ADD COLUMN IF NOT EXISTS created_by_user_name VARCHAR;"))
                    conn.execute(text("ALTER TABLE companies ADD COLUMN IF NOT EXISTS created_by_user_email VARCHAR;"))
                    conn.execute(text("ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT TRUE;"))
                    conn.execute(text("UPDATE companies SET is_global = TRUE WHERE is_global IS NULL OR created_by_user_email = 'admin@indigo.com' OR created_by_user_name = 'Admin' OR created_by_user_name = 'Admin User' OR created_by_user_name = 'System' OR created_by_user_id IS NULL;"))
                    conn.execute(text("UPDATE companies SET is_active = TRUE WHERE is_active IS NULL;"))
                    
                    conn.commit()
                    logger.info("Database table columns verified/migrated successfully")
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
    app.include_router(findings_router, prefix="/api", tags=["Sentina Findings"])
    app.include_router(sentina_reports_router, prefix="/api", tags=["Sentina Reports"])
    app.include_router(sentina_dashboard_router, prefix="/api", tags=["Sentina Dashboard"])
    app.include_router(sentina_health_router, prefix="/api", tags=["Sentina Health"])

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


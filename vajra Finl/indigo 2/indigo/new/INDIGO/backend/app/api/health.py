import shutil
from fastapi import APIRouter
from app.config import settings

router = APIRouter(tags=["Health & System"])

@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "service": "Sentinal Security Assessment Platform",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

@router.get("/capabilities")
def get_capabilities():
    return {
        "ai_provider": settings.AI_PROVIDER,
        "ai_model": settings.AI_MODEL,
        "scanners": {
            "sast": {"semgrep_cli": shutil.which("semgrep") is not None, "native_engine": True},
            "sca": {"osv_api": True, "lockfiles_supported": 15},
            "secrets": {"gitleaks_cli": shutil.which("gitleaks") is not None, "entropy_scanner": True},
            "dast": {"zap_api": True, "http_crawler": True},
            "nuclei": {"nuclei_cli": shutil.which("nuclei") is not None, "exposure_probes": True},
            "ssl": {"tls_analyzer": True, "testssl_cli": shutil.which("testssl.sh") is not None}
        },
        "supported_languages": [
            "JavaScript", "TypeScript", "Python", "Java", "Go", "PHP",
            "C/C++", "C#", "Ruby", "Kotlin", "Swift", "Shell",
            "Dockerfile", "Terraform", "Kubernetes YAML"
        ]
    }

import sys
import asyncio
from fastapi.testclient import TestClient
from main import app

def run_integration_tests():
    print("=" * 60)
    print("VAJRA x SENTINA UNIFIED PLATFORM & GITHUB AI INTEGRATION TESTS")
    print("=" * 60)

    client = TestClient(app)

    # 1. Health & Root
    print("\n[Test 1/6] Testing Health & Root Endpoints...")
    r = client.get("/api/health")
    assert r.status_code == 200, f"Health check failed: {r.status_code}"
    print("  -> Health Check: OK (200)")

    r = client.get("/")
    assert r.status_code == 200, f"Root endpoint failed: {r.status_code}"
    print(f"  -> Root message: {r.json().get('message')}")

    # 2. AI Model Telemetry Feed
    print("\n[Test 2/6] Testing Unified AI Model Telemetry Feed...")
    r = client.get("/api/ai/model-feed")
    assert r.status_code == 200, f"AI model feed failed: {r.status_code}"
    data = r.json()
    assert data.get("status") == "ready"
    print(f"  -> AI Model Feed Status: {data.get('status')}")
    print(f"  -> Active Data Streams: {list(data.get('data_streams', {}).keys())}")

    # 3. GitHub Repository Validation
    print("\n[Test 3/6] Testing GitHub Repository Validation Endpoint...")
    r = client.post("/api/repositories/github/validate", json={
        "url": "https://github.com/expressjs/express",
        "branch": "main"
    })
    assert r.status_code == 200, f"GitHub validation failed: {r.status_code}"
    gh_data = r.json()
    print(f"  -> Valid: {gh_data.get('valid')}, Stars: {gh_data.get('stars')}, Owner/Repo: {gh_data.get('owner')}/{gh_data.get('repo')}")

    # 4. GitHub Tree & Manifest Discovery
    print("\n[Test 4/6] Testing GitHub Tree & Manifest Extraction...")
    r = client.post("/api/repositories/github/tree", json={
        "url": "https://github.com/expressjs/express",
        "branch": "main"
    })
    assert r.status_code == 200, f"GitHub tree failed: {r.status_code}"
    tree_data = r.json()
    print(f"  -> Tree Status: {tree_data.get('success')}, Manifests Found: {len(tree_data.get('manifest_files', []))}")
    print(f"  -> Detected Ecosystems: {tree_data.get('detected_ecosystems')}")

    # 5. Direct Sync to AI Threat Model
    print("\n[Test 5/6] Testing Repository Sync to Phoenix AI Threat Model...")
    sample_scan_summary = {
        "overall_risk_score": 75.0,
        "total_findings": 4,
        "critical": 1,
        "high": 2,
        "medium": 1,
        "low": 0
    }
    sample_findings = [
        {
            "source": "SAST",
            "scanner": "SAST_ENGINE",
            "title": "SQL Injection in auth handler",
            "severity": "CRITICAL",
            "file": "routes/auth.js",
            "line": 42,
            "remediation": "Use parameterized queries with prepared statements"
        },
        {
            "source": "SECRETS",
            "scanner": "SECRETS_DETECTOR",
            "title": "Hardcoded AWS Access Secret Key",
            "severity": "HIGH",
            "file": "config/cloud.js",
            "line": 15,
            "remediation": "Store secret in environment variable"
        }
    ]
    r = client.post("/api/repositories/github/sync-to-model", json={
        "repo_url": "https://github.com/acme/payment-gateway",
        "scan_summary": sample_scan_summary,
        "findings": sample_findings,
        "company_name": "Acme Payments Inc."
    })
    assert r.status_code == 200, f"Sync to model failed: {r.status_code}"
    sync_data = r.json()
    model = sync_data.get("ai_threat_model", {})
    print(f"  -> AI Threat Rating: {model.get('ai_threat_rating')}")
    print(f"  -> Associated Ransomware/APT Groups: {[a['actor'] for a in model.get('threat_actors_associated', [])]}")
    print(f"  -> Generated Remediation Patches Count: {len(model.get('remediation_patches', []))}")

    # 6. Unified AI Copilot Question Answering
    print("\n[Test 6/6] Testing Unified AI Copilot (Phoenix)...")
    r = client.post("/api/ai/generate", json={
        "prompt": "How should we remediate the SQL injection finding discovered in the repository?",
        "context": "Repository: payment-gateway, Finding: SQL injection in routes/auth.js"
    })
    assert r.status_code == 200, f"AI generate failed: {r.status_code}"
    ai_resp = r.json().get("response", "")
    print(f"  -> AI Copilot Response snippet: {ai_resp[:120]}...")

    print("\n" + "=" * 60)
    print("ALL 6 INTEGRATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_integration_tests()

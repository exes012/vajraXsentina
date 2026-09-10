# Sentinal — Unified SAST + SCA + DAST Security Assessment Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10+-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React: 18](https://img.shields.io/badge/React-18.2-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)

**Sentinal** is a production-grade, multi-modal DevSecOps and Application Security assessment platform that unifies:

1. **SAST (Static Application Security Testing)** — Multi-language static code analysis (Semgrep + native AST/regex engine covering Python, JS/TS, Java, Go, PHP, C#, C/C++, Ruby, Shell, Dockerfiles, Terraform, Kubernetes YAML).
2. **SCA (Software Composition Analysis)** — Direct dependency scanning across 15+ lockfile formats with real-time OSV.dev CVE and patch vulnerability resolution.
3. **Secret Detection** — High-precision regex and Shannon entropy scanner (Gitleaks integration) with mandatory automatic secret masking and redaction.
4. **DAST (Dynamic Application Security Testing)** — OWASP ZAP adapter and asynchronous HTTP web crawler assessing injection heuristics, reflected XSS, path traversal, and session cookie security flags.
5. **Web Exposure & Misconfigurations** — Nuclei policy adapter (`safe`, `standard`, `deep`) detecting exposed `.git`, `.env`, database SQL dumps, and admin endpoints.
6. **SSL/TLS & Certificate Analysis** — Protocol inspector detecting certificate expirations, obsolete TLS 1.0/1.1, weak ciphers, and security headers (CSP, HSTS, X-Frame-Options, CORS).
7. **Cross-Engine Correlation & AI Risk Scoring** — Graph-linked correlation engine combining code dataflow, live endpoint triggers, and package CVEs into prioritized 0–100 risk scores with grounded AI analysis.
8. **Unified Multi-Format Reporting** — Generates standalone interactive HTML, SARIF-compatible JSON, and PDF security audit reports.

---

## Architecture Overview

```
+-----------------------------------------------------------------------------------+
|                            Sentinal Frontend (React / Vite)                       |
|   - Posture Dashboard    - New Assessment Wizard (GitHub / Upload / Live / Comb)  |
|   - Live Scan Telemetry  - Findings Explorer & Drawer   - Report Exporter         |
+-----------------------------------------------------------------------------------+
                                         | REST APIs & Background Polling
                                         v
+-----------------------------------------------------------------------------------+
|                            Sentinal API Gateway (FastAPI)                         |
|   - JWT Authentication   - Projects & Scopes Manager    - Assessment Controller   |
|   - Findings Controller  - Report Generation Engine     - Health & Capabilities   |
+-----------------------------------------------------------------------------------+
                                         |
               +-------------------------+-------------------------+
               |                                                   |
               v                                                   v
+-----------------------------+                     +-----------------------------+
|   Async Assessment Worker   |                     | Database Layer (SQLAlchemy) |
|  - Lifecycle State Machine  |                     |  - Projects & Users         |
|  - Process Isolation        |                     |  - Assessments & Scan Jobs  |
|  - Fault-Tolerant Execution |                     |  - Normalized Findings      |
+-----------------------------+                     |  - Correlated Risk Chains   |
               |                                    +-----------------------------+
               v
+-----------------------------------------------------------------------------------+
|                         Scanner Orchestration Adapters                            |
|  Base Interface: ScannerAdapter [validate, prepare, execute, parse, normalize, clean]
|  +------------------+-------------------+--------------------+------------------+
|  | SAST Engine      | SCA Parser        | Secret Detector    | DAST & Crawler   |
|  | (Semgrep/AST)    | (OSV Batch/Locks) | (Gitleaks/Entropy) | (OWASP ZAP/HTTP) |
|  +------------------+-------------------+--------------------+------------------+
|  | Web Exposure     | SSL/TLS Monitor   | Tech Fingerprint   | Security Headers |
|  | (Nuclei Policies)| (Certs & Ciphers) | (Framework Stacks) | (CSP/HSTS/CORS)  |
+-----------------------------------------------------------------------------------+
                                         | Raw Evidence
                                         v
+-----------------------------------------------------------------------------------+
|                               Normalization Pipeline                              |
|  1. Unified Finding Schema Standardizer (CWE, CVE, OWASP, Severity, Line, URL)    |
|  2. Secret Masking Layer (Automatic token & credential redaction)                 |
|  3. Deduplication Engine (Deterministic fingerprinting & multi-tool merging)      |
|  4. Correlation Engine (SAST Sink + DAST Endpoint + SCA Package link graph)       |
|  5. 0-100 Dynamic Risk Scoring Engine                                             |
+-----------------------------------------------------------------------------------+
                                         | Structured Grounded Data
                                         v
+-----------------------------------------------------------------------------------+
|                       AI Risk Analysis & Anti-Hallucination                       |
|  - Multi-Provider: OpenAI, Gemini, Anthropic, Ollama, or Built-in Expert Engine   |
|  - Strictly Grounded: Claims verified against scanner evidence                    |
|  - Executive Summary, Technical Risk, False Positive Reasoning, Playbooks         |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                         Report Generation & Export Services                       |
|  - Interactive Standalone HTML Report     - Machine-Readable SARIF JSON           |
|  - Print-Ready Vector PDF Document                                                |
+-----------------------------------------------------------------------------------+
```

---

## Quick Start (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Start the Backend API
```powershell
# From workspace root
cd backend
python -m pip install -r requirements.txt
python run.py
```
The FastAPI backend will start at `http://localhost:8000`. Interactive OpenAPI documentation is available at `http://localhost:8000/docs`.

### 2. Start the Frontend Dashboard
```powershell
# In a new terminal window
cd frontend
npm install
npm run dev
```
The modern dark cybersecurity dashboard will be available at `http://localhost:5173`.

---

## Docker Deployment

To launch the full containerized stack (Frontend, Backend, Database):

```bash
docker compose up --build
```
- **Frontend Dashboard:** `http://localhost:3000`
- **Backend API:** `http://localhost:8000/docs`

---

## Assessment Modalities

Sentinal supports 4 flexible assessment modes:

1. **Input A — GitHub Repository**: Provide a repository URL (e.g. `https://github.com/OWASP/NodeGoat`), branch, and optional access token. Performs SAST, SCA, and Secret Scanning in an isolated workspace.
2. **Input B — Source Code Archive**: Upload a `.zip` or `.tar` archive containing application source code.
3. **Input C — Live Application Target**: Supply a live web URL (e.g. `https://ginandjuice.shop`). Executes DAST active/passive crawls, security header audits, SSL/TLS certificate inspection, and Nuclei exposure policies.
4. **Input D — Combined Assessment**: Assess both repository source code and the live target URL simultaneously. Automatically correlates findings into multi-vector attack chains.

---

## REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new security analyst account |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT bearer token |
| `GET` | `/api/auth/me` | Fetch authenticated profile |
| `GET` | `/api/projects` | List all scoped projects |
| `POST` | `/api/projects` | Create a new target project |
| `POST` | `/api/repositories/github/validate` | Verify GitHub repository accessibility |
| `POST` | `/api/repositories/upload` | Upload source code zip archive |
| `POST` | `/api/assessments` | Start a new asynchronous security scan |
| `GET` | `/api/assessments` | List all assessment runs |
| `GET` | `/api/assessments/{id}` | Get real-time scan progress, logs, and stats |
| `POST` | `/api/assessments/{id}/cancel` | Cancel an active assessment |
| `GET` | `/api/assessments/{id}/correlated-risks` | Retrieve correlated multi-vector attack chains |
| `GET` | `/api/findings` | Filterable findings inventory (severity, source, scanner) |
| `PATCH` | `/api/findings/{id}/status` | Update finding status (`open`, `resolved`, `false_positive`) |
| `GET` | `/api/reports/{id}` | Fetch structured report data |
| `GET` | `/api/reports/{id}/export?format=html\|pdf\|json` | Download report artifact |
| `GET` | `/api/dashboard` | Aggregated risk metrics and distribution |
| `GET` | `/api/capabilities` | Installed scanners, AI engine, and supported ecosystems |

---

## Security & Privacy Guardrails

1. **Automatic Secret Redaction**: Leaked tokens, passwords, and private keys detected by Gitleaks or regex scanners are immediately masked (`AKIA************CDEF`) before rendering in UI or reports.
2. **Anti-Hallucination AI**: The AI prompt pipeline strictly verifies that referenced CVEs, files, and endpoints match actual scanner output.
3. **Graceful Fault Tolerance**: If a single external tool times out, remaining scanners continue running and the report indicates the specific module status without terminating the assessment.

---

## License
MIT License. Built for defensive DevSecOps and AppSec auditing.

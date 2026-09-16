import pytest
import tempfile
import shutil
from pathlib import Path
from app.scanners.sast.sast_engine import (
    scan_file_sast,
    scan_directory_sast,
    detect_languages_and_frameworks
)

@pytest.fixture
def temp_repo():
    temp_dir = Path(tempfile.mkdtemp(prefix="sentina_test_sast_"))
    yield temp_dir
    shutil.rmtree(temp_dir, ignore_errors=True)

def test_language_and_framework_detection(temp_repo):
    # Create Python FastAPI application file
    (temp_repo / "main.py").write_text("""
from fastapi import FastAPI
app = FastAPI()
""", encoding="utf-8")
    
    # Create JavaScript file
    (temp_repo / "index.js").write_text("""
const express = require('express');
const app = express();
""", encoding="utf-8")

    info = detect_languages_and_frameworks(temp_repo)
    assert "Python" in info["languages"]
    assert "JavaScript/TypeScript" in info["languages"]
    assert "FastAPI" in info["frameworks"]
    assert "Express" in info["frameworks"]

def test_sast_sql_injection_detection(temp_repo):
    # Vulnerable Python SQLi
    vuln_file = temp_repo / "vuln_db.py"
    vuln_file.write_text("""
import sqlite3

def get_user(cursor, user_id):
    query = f"SELECT * FROM users WHERE id = {user_id}"
    cursor.execute(query)
""", encoding="utf-8")

    findings = scan_file_sast(vuln_file, temp_repo)
    sqli_findings = [f for f in findings if "SQL Injection" in f.title]
    assert len(sqli_findings) >= 1
    assert "CWE-89" in sqli_findings[0].cwe
    assert sqli_findings[0].severity in ["HIGH", "CRITICAL"]
    assert "File: vuln_db.py" in sqli_findings[0].evidence

def test_sast_sql_injection_safe_parameterized_query(temp_repo):
    # Safe parameterized query - should NOT produce false positives
    safe_file = temp_repo / "safe_db.py"
    safe_file.write_text("""
import sqlite3

def get_user(cursor, user_id):
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
""", encoding="utf-8")

    findings = scan_file_sast(safe_file, temp_repo)
    sqli_findings = [f for f in findings if "SQL Injection" in f.title]
    assert len(sqli_findings) == 0

def test_sast_command_injection_detection(temp_repo):
    vuln_file = temp_repo / "vuln_cmd.py"
    vuln_file.write_text("""
import subprocess

def run_ping(ip):
    subprocess.Popen(f"ping {ip}", shell=True)
""", encoding="utf-8")

    findings = scan_file_sast(vuln_file, temp_repo)
    cmd_findings = [f for f in findings if "Command Injection" in f.title]
    assert len(cmd_findings) >= 1
    assert "CWE-78" in cmd_findings[0].cwe
    assert cmd_findings[0].severity == "CRITICAL"

def test_sast_xss_detection(temp_repo):
    vuln_file = temp_repo / "component.jsx"
    vuln_file.write_text("""
import React from 'react';

function UserProfile({ bioHtml }) {
  return <div dangerouslySetInnerHTML={{ __html: bioHtml }} />;
}
""", encoding="utf-8")

    findings = scan_file_sast(vuln_file, temp_repo)
    xss_findings = [f for f in findings if "Cross-Site Scripting" in f.title or "XSS" in f.title]
    assert len(xss_findings) >= 1
    assert "CWE-79" in xss_findings[0].cwe

def test_sast_path_traversal_detection(temp_repo):
    vuln_file = temp_repo / "file_viewer.py"
    vuln_file.write_text("""
def read_user_file(filename):
    with open(f"/var/www/uploads/{filename}", "r") as f:
        return f.read()
""", encoding="utf-8")

    findings = scan_file_sast(vuln_file, temp_repo)
    pt_findings = [f for f in findings if "Path Traversal" in f.title]
    assert len(pt_findings) >= 1
    assert "CWE-22" in pt_findings[0].cwe

def test_sast_hardcoded_secrets_detection(temp_repo):
    vuln_file = temp_repo / "cloud_config.py"
    vuln_file.write_text("""
AWS_ACCESS_KEY = "AKIA1111222233334444"
API_SECRET_KEY = "sk-live-123456789012345678901234567890"
""", encoding="utf-8")

    findings = scan_file_sast(vuln_file, temp_repo)
    secret_findings = [f for f in findings if "Hardcoded" in f.title or "Secret" in f.title]
    assert len(secret_findings) >= 1
    assert any("CWE-798" in f.cwe for f in secret_findings)

def test_sast_insecure_deserialization_pickle(temp_repo):
    vuln_file = temp_repo / "session.py"
    vuln_file.write_text("""
import pickle

def load_session(raw_bytes):
    return pickle.loads(raw_bytes)
""", encoding="utf-8")

    findings = scan_file_sast(vuln_file, temp_repo)
    deser_findings = [f for f in findings if "Insecure Deserialization" in f.title]
    assert len(deser_findings) >= 1
    assert "CWE-502" in deser_findings[0].cwe
    assert deser_findings[0].severity == "CRITICAL"

def test_sast_weak_cryptography_md5(temp_repo):
    vuln_file = temp_repo / "crypto_utils.py"
    vuln_file.write_text("""
import hashlib

def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()
""", encoding="utf-8")

    findings = scan_file_sast(vuln_file, temp_repo)
    crypto_findings = [f for f in findings if "Weak Cryptographic Hash" in f.title or "MD5" in f.title]
    assert len(crypto_findings) >= 1
    assert "CWE-327" in crypto_findings[0].cwe or "CWE-328" in crypto_findings[0].cwe

import pytest
import asyncio
from pathlib import Path
import tempfile

from app.scanners.sast.sast_engine import scan_file_sast, scan_directory_sast
from app.scanners.secrets.gitleaks_adapter import GitleaksAdapter
from app.scanners.sca.lockfile_parser import parse_package_json, parse_requirements_txt
from app.scanners.ssl.cert_analyzer import inspect_tls_certificate

def test_sast_sqli_detection():
    with tempfile.TemporaryDirectory() as tmpdir:
        test_file = Path(tmpdir) / "vuln.py"
        test_file.write_text("""
def get_user(user_id):
    query = "SELECT * FROM users WHERE id = '" + user_id + "'"
    cursor.execute(f"SELECT * FROM users WHERE name = {user_id}")
""")
        findings = scan_directory_sast(Path(tmpdir))
        assert len(findings) > 0
        assert any("SQL Injection" in f.title for f in findings)
        assert any(f.source == "SAST" for f in findings)

def test_secret_detection():
    with tempfile.TemporaryDirectory() as tmpdir:
        test_file = Path(tmpdir) / "config.js"
        test_file.write_text("""
const AWS_SECRET = "AKIA1234567890ABCDEF";
const GITHUB_TOKEN = "ghp_1234567890abcdef1234567890abcdef12";
""")
        adapter = GitleaksAdapter()
        findings = adapter._scan_file_native(test_file, Path(tmpdir))
        assert len(findings) >= 2
        for f in findings:
            assert f.source == "SECRETS"
            # Verify secrets are masked
            assert "AKIA1234567890ABCDEF" not in (f.evidence or "")
            assert "ghp_1234567890abcdef1234567890abcdef12" not in (f.evidence or "")

def test_lockfile_parsing():
    with tempfile.TemporaryDirectory() as tmpdir:
        pkg_json = Path(tmpdir) / "package.json"
        pkg_json.write_text('{"dependencies": {"lodash": "^4.17.15", "express": "4.18.2"}}')
        deps = parse_package_json(pkg_json, Path(tmpdir))
        assert len(deps) == 2
        assert any(d.name == "lodash" and d.version == "4.17.15" for d in deps)

        req_txt = Path(tmpdir) / "requirements.txt"
        req_txt.write_text('django==3.2.0\npyyaml>=5.3.1\nrequests\n')
        py_deps = parse_requirements_txt(req_txt, Path(tmpdir))
        assert len(py_deps) == 3
        assert any(d.name == "django" and d.version == "3.2.0" for d in py_deps)

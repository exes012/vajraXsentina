import pytest
import tempfile
import shutil
import json
from pathlib import Path
from app.scanners.sca.lockfile_parser import (
    discover_all_dependencies,
    parse_package_json,
    parse_package_lock_json,
    parse_requirements_txt,
    parse_poetry_lock,
    parse_go_mod,
    parse_pom_xml,
    parse_cargo_lock,
    parse_composer_lock,
    parse_gemfile_lock,
    parse_csproj
)
from app.scanners.sca.osv_adapter import (
    is_version_affected,
    OSVAdapter
)

@pytest.fixture
def temp_sca_repo():
    temp_dir = Path(tempfile.mkdtemp(prefix="sentina_test_sca_"))
    yield temp_dir
    shutil.rmtree(temp_dir, ignore_errors=True)

def test_package_json_and_lock_parsing(temp_sca_repo):
    pkg_json = temp_sca_repo / "package.json"
    pkg_json.write_text(json.dumps({
        "dependencies": {
            "lodash": "^4.17.15",
            "express": "4.17.1"
        },
        "devDependencies": {
            "jest": "29.0.0"
        }
    }), encoding="utf-8")

    pkg_lock = temp_sca_repo / "package-lock.json"
    pkg_lock.write_text(json.dumps({
        "name": "test-app",
        "version": "1.0.0",
        "lockfileVersion": 3,
        "packages": {
            "": {
                "dependencies": {
                    "lodash": "^4.17.15",
                    "express": "4.17.1"
                }
            },
            "node_modules/lodash": {
                "version": "4.17.15"
            },
            "node_modules/express": {
                "version": "4.17.1"
            },
            "node_modules/debug": {
                "version": "2.6.9"
            }
        }
    }), encoding="utf-8")

    deps = discover_all_dependencies(temp_sca_repo)
    dep_names = {d.name: d.version for d in deps}
    assert "lodash" in dep_names
    assert dep_names["lodash"] == "4.17.15"
    assert "express" in dep_names

def test_requirements_and_poetry_parsing(temp_sca_repo):
    req_txt = temp_sca_repo / "requirements.txt"
    req_txt.write_text("""
flask==2.0.1
requests>=2.25.0
pyyaml==5.3.1
django==3.2.0
""", encoding="utf-8")

    deps = discover_all_dependencies(temp_sca_repo)
    dep_names = {d.name: d.version for d in deps}
    assert "flask" in dep_names
    assert dep_names["flask"] == "2.0.1"
    assert "pyyaml" in dep_names
    assert dep_names["pyyaml"] == "5.3.1"
    assert "django" in dep_names

def test_go_mod_parsing(temp_sca_repo):
    go_mod = temp_sca_repo / "go.mod"
    go_mod.write_text("""
module example.com/myapp

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/golang-jwt/jwt/v4 v4.4.2 // indirect
)
""", encoding="utf-8")

    deps = discover_all_dependencies(temp_sca_repo)
    gin_dep = next((d for d in deps if "gin" in d.name), None)
    assert gin_dep is not None
    assert gin_dep.version == "1.9.1"
    assert gin_dep.is_direct is True

    jwt_dep = next((d for d in deps if "jwt" in d.name), None)
    assert jwt_dep is not None
    assert jwt_dep.is_direct is False

def test_pom_xml_parsing(temp_sca_repo):
    pom = temp_sca_repo / "pom.xml"
    pom.write_text("""
<project>
    <dependencies>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.14.1</version>
        </dependency>
    </dependencies>
</project>
""", encoding="utf-8")

    deps = discover_all_dependencies(temp_sca_repo)
    assert len(deps) == 1
    assert deps[0].name == "org.apache.logging.log4j:log4j-core"
    assert deps[0].version == "2.14.1"

def test_cargo_lock_parsing(temp_sca_repo):
    cargo = temp_sca_repo / "cargo.lock"
    cargo.write_text("""
version = 3

[[package]]
name = "serde"
version = "1.0.188"

[[package]]
name = "tokio"
version = "1.32.0"
""", encoding="utf-8")

    deps = discover_all_dependencies(temp_sca_repo)
    dep_names = {d.name: d.version for d in deps}
    assert "serde" in dep_names
    assert dep_names["serde"] == "1.0.188"
    assert "tokio" in dep_names

def test_version_range_verification_engine():
    """
    CRITICAL REQUIREMENT TEST:
    Verify that installed versions outside the vulnerable range are NOT flagged.
    """
    # Test case 1: Lodash vulnerability fixed in 4.17.21 (affected: < 4.17.21)
    affected_spec = {
        "ranges": [
            {
                "type": "SEMVER",
                "events": [
                    {"introduced": "0"},
                    {"fixed": "4.17.21"}
                ]
            }
        ]
    }

    # Installed: 4.17.15 -> SHOULD BE AFFECTED
    is_aff_15, _, fixed_15 = is_version_affected("4.17.15", affected_spec)
    assert is_aff_15 is True
    assert fixed_15 == "4.17.21"

    # Installed: 4.17.21 (Patched) -> MUST NOT BE AFFECTED
    is_aff_21, _, _ = is_version_affected("4.17.21", affected_spec)
    assert is_aff_21 is False

    # Installed: 4.18.0 (Newer) -> MUST NOT BE AFFECTED
    is_aff_newer, _, _ = is_version_affected("4.18.0", affected_spec)
    assert is_aff_newer is False

    # Test case 2: Django SQL injection in QuerySet (affected: >= 3.2.0, < 3.2.5)
    django_affected_spec = {
        "ranges": [
            {
                "type": "ECOSYSTEM",
                "events": [
                    {"introduced": "3.2.0"},
                    {"fixed": "3.2.5"}
                ]
            }
        ]
    }

    # Installed: 3.2.0 -> SHOULD BE AFFECTED
    is_aff_dj_320, _, fixed_dj = is_version_affected("3.2.0", django_affected_spec)
    assert is_aff_dj_320 is True
    assert fixed_dj == "3.2.5"

    # Installed: 3.2.5 -> MUST NOT BE AFFECTED
    is_aff_dj_325, _, _ = is_version_affected("3.2.5", django_affected_spec)
    assert is_aff_dj_325 is False

    # Installed: 4.2.0 -> MUST NOT BE AFFECTED
    is_aff_dj_420, _, _ = is_version_affected("4.2.0", django_affected_spec)
    assert is_aff_dj_420 is False

@pytest.mark.asyncio
async def test_osv_adapter_execution(temp_sca_repo):
    # Setup repository with known vulnerable pyyaml 5.3.1 (CVE-2020-14343)
    (temp_sca_repo / "requirements.txt").write_text("pyyaml==5.3.1\n", encoding="utf-8")

    adapter = OSVAdapter()
    assert adapter.validate(temp_sca_repo) is True

    context = adapter.prepare(temp_sca_repo)
    assert len(context["dependencies"]) == 1

    findings = await adapter.execute(temp_sca_repo, context)
    assert len(findings) >= 1
    pyyaml_finding = findings[0]
    assert "pyyaml" in pyyaml_finding.title.lower()
    assert pyyaml_finding.source == "SCA"
    assert "CVE-2020-14343" in pyyaml_finding.cves
    assert "requirements.txt" in pyyaml_finding.file
    assert "5.3.1" in pyyaml_finding.evidence

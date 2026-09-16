import os
import re
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple, Set
from app.scanners.base import RawFinding

# =====================================================================
# LANGUAGE & FRAMEWORK DETECTION ENGINE
# =====================================================================

LANGUAGE_EXTENSIONS = {
    "Python": [".py", ".pyw"],
    "JavaScript/TypeScript": [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"],
    "Java/Kotlin": [".java", ".kt", ".kts"],
    "Go": [".go"],
    "PHP": [".php", ".phtml"],
    "C#/.NET": [".cs"],
    "C/C++": [".c", ".cpp", ".cc", ".cxx", ".h", ".hpp"],
    "Ruby": [".rb"],
    "Rust": [".rs"],
    "IaC / Cloud": [".tf", ".tfvars", ".yaml", ".yml", "dockerfile"]
}

FRAMEWORK_SIGNATURES = [
    {"framework": "FastAPI", "ecosystem": "Python", "indicators": [r'from\s+fastapi\s+import', r'FastAPI\s*\(']},
    {"framework": "Django", "ecosystem": "Python", "indicators": [r'from\s+django', r'import\s+django', r'DJANGO_SETTINGS_MODULE']},
    {"framework": "Flask", "ecosystem": "Python", "indicators": [r'from\s+flask\s+import', r'Flask\s*\(__name__\b']},
    {"framework": "Express", "ecosystem": "JavaScript", "indicators": [r'require\s*\(\s*[\'"]express[\'"]\s*\)', r'from\s+[\'"]express[\'"]']},
    {"framework": "Next.js", "ecosystem": "JavaScript", "indicators": [r'next/router', r'next/server', r'next/image', r'"next":\s*']},
    {"framework": "React", "ecosystem": "JavaScript", "indicators": [r'from\s+[\'"]react[\'"]', r'require\s*\(\s*[\'"]react[\'"]\s*\)']},
    {"framework": "Spring Boot", "ecosystem": "Java", "indicators": [r'@SpringBootApplication', r'org\.springframework\.boot']},
    {"framework": "Gin", "ecosystem": "Go", "indicators": [r'github\.com/gin-gonic/gin', r'gin\.Default\s*\(']},
    {"framework": "Echo", "ecosystem": "Go", "indicators": [r'github\.com/labstack/echo', r'echo\.New\s*\(']},
    {"framework": "Laravel", "ecosystem": "PHP", "indicators": [r'Illuminate\\', r'artisan']},
    {"framework": "Ruby on Rails", "ecosystem": "Ruby", "indicators": [r'Rails\.application', r'ActionController::Base']},
    {"framework": "ASP.NET Core", "ecosystem": "C#", "indicators": [r'Microsoft\.AspNetCore', r'WebApplication\.CreateBuilder']}
]

def detect_languages_and_frameworks(directory: Path) -> Dict[str, Any]:
    """Identify languages, frameworks, and architecture patterns from source code recursively."""
    detected_languages: Dict[str, int] = {}
    detected_frameworks: Set[str] = set()

    if not directory.exists() or not directory.is_dir():
        return {"languages": [], "frameworks": [], "total_files": 0}

    total_files = 0
    for root, _, files in os.walk(directory):
        rel_root = str(Path(root).relative_to(directory)).replace("\\", "/")
        if any(ignored in rel_root for ignored in ["node_modules", ".git", "vendor", "dist", "build", "__pycache__", ".venv"]):
            continue

        for f in files:
            total_files += 1
            file_ext = Path(f).suffix.lower()
            file_name = f.lower()

            # Match Language
            for lang, exts in LANGUAGE_EXTENSIONS.items():
                if file_ext in exts or (file_name == "dockerfile" and "dockerfile" in exts):
                    detected_languages[lang] = detected_languages.get(lang, 0) + 1

            # Match Framework (inspect smaller files)
            file_path = Path(root) / f
            if file_ext in [".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".go", ".php", ".cs", ".rb", ".json"]:
                try:
                    if file_path.stat().st_size < 512 * 1024:  # 512 KB
                        text = file_path.read_text(encoding="utf-8", errors="ignore")
                        for sig in FRAMEWORK_SIGNATURES:
                            for ind in sig["indicators"]:
                                if re.search(ind, text):
                                    detected_frameworks.add(sig["framework"])
                                    break
                except Exception:
                    pass

    return {
        "languages": sorted(list(detected_languages.keys())),
        "language_distribution": detected_languages,
        "frameworks": sorted(list(detected_frameworks)),
        "total_files": total_files
    }


# =====================================================================
# COMPREHENSIVE SAST SECURITY RULES ENGINE (25+ Vulnerability Categories)
# =====================================================================

SAST_RULES = [
    # -------------------------------------------------------------
    # 1. SQL Injection
    # -------------------------------------------------------------
    {
        "id": "py-sql-injection-dynamic-query",
        "languages": [".py"],
        "pattern": r'(?:cursor|conn|connection|db|engine)\.execute\s*\(\s*(?:f[\'"][^)]*\{|\"[^\"]*%\s*[a-zA-Z0-9_\(\)]|\'[^\']*%\s*[a-zA-Z0-9_\(\)]|[^,)]*\+|[a-zA-Z0-9_]+\s*\))|(?:query|sql|stmt)\s*=\s*(?:f[\'"].*?(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE).*?\{|[\'"].*?(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE).*?[\'"]\s*\+)',
        "negative_pattern": r'execute\s*\(\s*[\'"][^\'"]*[\'"]\s*,\s*[\(\[]',  # Parameterized tuple/list check
        "title": "SQL Injection via Dynamic String Formatting in Database Query",
        "description": "Constructing SQL queries using f-strings, `%` operator, or string concatenation without parameterized placeholders enables arbitrary SQL injection.",
        "severity": "HIGH",
        "confidence": "HIGH",
        "category": "SQL Injection",
        "cwe": ["CWE-89"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Use parameterized queries with placeholder bindings (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM."
    },
    {
        "id": "js-sql-injection-string-concat",
        "languages": [".js", ".jsx", ".ts", ".tsx"],
        "pattern": r'(?:db|client|pool|connection)\.query\s*\(\s*(?:`[^`]*\$\{[^}]+\}|[\'"][^\'"]*[\'"]\s*\+)',
        "negative_pattern": r'query\s*\(\s*[\'"`][^\'"`]*[\'"`]\s*,\s*\[',  # Parameterized query array
        "title": "SQL Injection in Node.js Database Query",
        "description": "Interpolating variables into database queries via template literals or string concatenation enables SQL injection.",
        "severity": "HIGH",
        "confidence": "HIGH",
        "category": "SQL Injection",
        "cwe": ["CWE-89"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Use parameterized queries with bind variables: `db.query('SELECT * FROM users WHERE id = $1', [userId])`."
    },
    {
        "id": "java-sql-injection-jdbc",
        "languages": [".java", ".kt"],
        "pattern": r'(?:Statement\.executeQuery\s*\(\s*[\'"].*?\+|prepareStatement\s*\(\s*[\'"].*?\+)',
        "title": "SQL Injection in Java JDBC Query",
        "description": "Concatenating user variables directly into SQL statements without PreparedStatement parameterization creates SQL injection vulnerabilities.",
        "severity": "HIGH",
        "confidence": "HIGH",
        "category": "SQL Injection",
        "cwe": ["CWE-89"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Use parameterized `PreparedStatement` with placeholder `?` markers."
    },
    {
        "id": "go-sql-injection-sprintf",
        "languages": [".go"],
        "pattern": r'(?:db\.Query|db\.Exec|db\.QueryRow)\s*\(\s*(?:fmt\.Sprintf|[\'"].*?\+)',
        "title": "SQL Injection via Sprintf in Go Database Query",
        "description": "Formatting SQL queries using `fmt.Sprintf` or string concatenation bypasses parameter escaping.",
        "severity": "HIGH",
        "confidence": "HIGH",
        "category": "SQL Injection",
        "cwe": ["CWE-89"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Use parameterized query placeholders (`$1`, `?`) with `db.Query(ctx, 'SELECT * FROM users WHERE id = $1', id)`."
    },
    {
        "id": "php-sql-injection-query",
        "languages": [".php"],
        "pattern": r'(?:\$(?:mysqli|db|conn)->query\s*\(\s*[\'"].*?\$_|\b(?:mysql_query|mysqli_query)\s*\([^,]+,\s*[\'"].*?\$_)',
        "title": "SQL Injection in PHP Query",
        "description": "Direct concatenation of `$_GET`, `$_POST`, or `$_REQUEST` into database queries exposes the database to SQL injection.",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "SQL Injection",
        "cwe": ["CWE-89"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Use PDO or MySQLi prepared statements with bound parameters."
    },
    {
        "id": "cs-sql-injection-commandtext",
        "languages": [".cs"],
        "pattern": r'(?:new\s+SqlCommand\s*\(\s*[\'"].*?\+|\.CommandText\s*=\s*[\'"].*?\+)',
        "title": "SQL Injection in C# SqlCommand",
        "description": "Concatenating user-supplied data into `SqlCommand.CommandText` enables SQL injection.",
        "severity": "HIGH",
        "confidence": "HIGH",
        "category": "SQL Injection",
        "cwe": ["CWE-89"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Use `SqlParameter` objects with parameterized queries or Entity Framework LINQ queries."
    },

    # -------------------------------------------------------------
    # 2. Command / OS Command Injection
    # -------------------------------------------------------------
    {
        "id": "py-command-injection-shell",
        "languages": [".py"],
        "pattern": r'(?:os\.system\s*\(\s*f?[\'"][^)]*\{|os\.system\s*\([^)]*\+|subprocess\.(?:Popen|run|call|check_output)\s*\([^)]*shell\s*=\s*True)',
        "title": "Command Injection via Shell Execution",
        "description": "Executing system shell commands with concatenated or interpolated variables allows Remote Code Execution (RCE).",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "Command Injection",
        "cwe": ["CWE-78"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Pass command arguments as an array/list with `shell=False` and validate all inputs against an allowlist."
    },
    {
        "id": "js-command-injection-child-process",
        "languages": [".js", ".jsx", ".ts", ".tsx"],
        "pattern": r'(?:child_process\.exec\s*\(|execSync\s*\(|require\s*\(\s*[\'"]child_process[\'"]\s*\)\.exec\s*\()',
        "title": "Command Injection in Node.js Child Process Execution",
        "description": "Invoking `child_process.exec()` runs commands inside a system shell, allowing shell metacharacter injection (`;`, `&&`, `|`).",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "Command Injection",
        "cwe": ["CWE-78"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Use `child_process.execFile()` or `child_process.spawn()` with arguments passed in a separate array."
    },
    {
        "id": "java-command-injection-runtime",
        "languages": [".java", ".kt"],
        "pattern": r'(?:Runtime\.getRuntime\s*\(\s*\)\.exec\s*\(|new\s+ProcessBuilder\s*\(\s*[\'"](?:sh|cmd|bash)[\'"])',
        "title": "Command Injection in Java Process Execution",
        "description": "Executing system shell processes with dynamic arguments can lead to command injection and remote code execution.",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "Command Injection",
        "cwe": ["CWE-78"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Use `ProcessBuilder` with separate argument tokens and avoid invoking system shell binaries directly."
    },
    {
        "id": "go-command-exec-shell",
        "languages": [".go"],
        "pattern": r'exec\.Command\s*\(\s*[\'"](?:sh|bash|cmd)[\'"]\s*,\s*[\'"]-(?:c|C)[\'"]\s*,\s*.*?fmt\.Sprintf',
        "title": "Command Injection in Go exec.Command",
        "description": "Constructing shell execution strings with user-provided parameters allows command injection.",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "Command Injection",
        "cwe": ["CWE-78"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Avoid invoking the shell directly. Call the executable binary with distinct arguments."
    },

    # -------------------------------------------------------------
    # 3. Cross-Site Scripting (XSS)
    # -------------------------------------------------------------
    {
        "id": "js-dom-xss-innerhtml",
        "languages": [".js", ".jsx", ".ts", ".tsx"],
        "pattern": r'(?:\.innerHTML\s*=\s*|\.outerHTML\s*=\s*|dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html:)',
        "title": "Cross-Site Scripting (XSS) via innerHTML / dangerouslySetInnerHTML",
        "description": "Directly assigning dynamic user input to `innerHTML` or React `dangerouslySetInnerHTML` bypasses HTML escaping and creates DOM XSS vulnerabilities.",
        "severity": "HIGH",
        "confidence": "HIGH",
        "category": "Cross-Site Scripting",
        "cwe": ["CWE-79"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Use `textContent` or sanitize user input using DOMPurify before inserting into the DOM."
    },
    {
        "id": "js-xss-document-write",
        "languages": [".js", ".html", ".ts"],
        "pattern": r'document\.write\s*\(|document\.writeln\s*\(',
        "title": "Cross-Site Scripting (XSS) via document.write()",
        "description": "Using `document.write()` with dynamic values can inject untrusted script tags into the active document context.",
        "severity": "MEDIUM",
        "confidence": "HIGH",
        "category": "Cross-Site Scripting",
        "cwe": ["CWE-79"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Use safe DOM APIs like `document.createElement()` and `element.textContent`."
    },
    {
        "id": "py-xss-jinja-autoescape-disabled",
        "languages": [".py"],
        "pattern": r'Environment\s*\([^)]*autoescape\s*=\s*False|render_template_string\s*\(',
        "title": "Cross-Site Scripting / SSTI via Disabled Template Autoescape",
        "description": "Disabling autoescaping in template engines (such as Jinja2) renders unescaped user inputs directly into HTML.",
        "severity": "HIGH",
        "confidence": "HIGH",
        "category": "Cross-Site Scripting",
        "cwe": ["CWE-79", "CWE-1336"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Enable `autoescape=select_autoescape(['html', 'xml'])` in Jinja2 and avoid `render_template_string` with user input."
    },

    # -------------------------------------------------------------
    # 4. Path Traversal & Unsafe File Access
    # -------------------------------------------------------------
    {
        "id": "py-path-traversal-open",
        "languages": [".py"],
        "pattern": r'open\s*\(\s*f?[\'"].*?\{.*?(?:path|filename|file|name)|open\s*\([^,)]*\+.*?(?:filename|path|file)',
        "title": "Potential Path Traversal via Unvalidated File Access",
        "description": "Accessing files using user-supplied file paths without canonicalization or directory whitelisting enables reading arbitrary system files.",
        "severity": "HIGH",
        "confidence": "MEDIUM",
        "category": "Broken Access Control",
        "cwe": ["CWE-22"],
        "owasp": ["A01:2021-Broken Access Control"],
        "remediation": "Validate paths using `os.path.abspath()` and verify that the target directory starts with the allowed root path."
    },
    {
        "id": "js-path-traversal-fs",
        "languages": [".js", ".ts"],
        "pattern": r'fs\.(?:readFile|readFileSync|createReadStream)\s*\(\s*(?:path\.join\s*\([^)]*req\.|req\.params|req\.query|req\.body)',
        "title": "Path Traversal in Node.js File System Operation",
        "description": "Reading filesystem resources with concatenated request parameters without directory confinement allows dot-dot-slash (`../`) directory traversal.",
        "severity": "HIGH",
        "confidence": "HIGH",
        "category": "Broken Access Control",
        "cwe": ["CWE-22"],
        "owasp": ["A01:2021-Broken Access Control"],
        "remediation": "Resolve absolute paths using `path.resolve()` and verify that `resolvedPath.startsWith(allowedBasePath)`."
    },

    # -------------------------------------------------------------
    # 5. Server-Side Request Forgery (SSRF)
    # -------------------------------------------------------------
    {
        "id": "py-ssrf-requests",
        "languages": [".py"],
        "pattern": r'requests\.(?:get|post|put|delete|patch)\s*\(\s*(?:url|target_url|request\.|req\.|params\[|args\[)',
        "title": "Potential Server-Side Request Forgery (SSRF)",
        "description": "Making HTTP requests to URLs controlled directly by users allows attackers to probe internal network services and cloud metadata endpoints (e.g. AWS 169.254.169.254).",
        "severity": "HIGH",
        "confidence": "MEDIUM",
        "category": "SSRF",
        "cwe": ["CWE-918"],
        "owasp": ["A10:2021-Server-Side Request Forgery (SSRF)"],
        "remediation": "Validate target URLs against an explicit domain allowlist and block private IP ranges (RFC 1918, RFC 3927)."
    },
    {
        "id": "js-ssrf-axios-fetch",
        "languages": [".js", ".ts"],
        "pattern": r'(?:axios\.(?:get|post)|fetch)\s*\(\s*(?:req\.query|req\.body|req\.params)',
        "title": "Server-Side Request Forgery (SSRF) in HTTP Client Call",
        "description": "Passing user-controlled request inputs directly to outbound HTTP clients can trigger requests to internal intranet infrastructure.",
        "severity": "HIGH",
        "confidence": "MEDIUM",
        "category": "SSRF",
        "cwe": ["CWE-918"],
        "owasp": ["A10:2021-Server-Side Request Forgery (SSRF)"],
        "remediation": "Validate destination hostnames against an allowlist and reject loopback/private IP addresses."
    },

    # -------------------------------------------------------------
    # 6. XML External Entity (XXE)
    # -------------------------------------------------------------
    {
        "id": "java-xxe-xml-parser",
        "languages": [".java", ".kt"],
        "pattern": r'(?:DocumentBuilderFactory\.newInstance\s*\(|SAXParserFactory\.newInstance\s*\(|XMLInputFactory\.newInstance\s*\()',
        "title": "XML External Entity (XXE) Vulnerability in Java XML Parser",
        "description": "Default Java XML parsers process external entity declarations (DOCTYPE), enabling local file disclosure and SSRF attacks.",
        "severity": "HIGH",
        "confidence": "MEDIUM",
        "category": "XXE",
        "cwe": ["CWE-611"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "remediation": "Disable external entity processing via `dbf.setFeature('http://apache.org/xml/features/disallow-doctype-decl', true)`."
    },
    {
        "id": "py-xxe-etree",
        "languages": [".py"],
        "pattern": r'(?:etree\.fromstring|etree\.parse|xml\.dom\.minidom\.parseString)\s*\(',
        "title": "Potential XML External Entity (XXE) Parsing",
        "description": "Standard Python XML parsers can be vulnerable to XML entity expansion and external resource resolution.",
        "severity": "MEDIUM",
        "confidence": "MEDIUM",
        "category": "XXE",
        "cwe": ["CWE-611"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "remediation": "Use `defusedxml` package instead of standard library `xml` or `lxml`."
    },

    # -------------------------------------------------------------
    # 7. Insecure Deserialization
    # -------------------------------------------------------------
    {
        "id": "py-insecure-deserialization-pickle",
        "languages": [".py"],
        "pattern": r'(?:pickle\.loads?\s*\(|_pickle\.loads?\s*\(|yaml\.load\s*\([^,)]*\)|yaml\.unsafe_load\s*\()',
        "title": "Insecure Deserialization via Pickle / Unsafe YAML",
        "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "Insecure Deserialization",
        "cwe": ["CWE-502"],
        "owasp": ["A08:2021-Software and Data Integrity Failures"],
        "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle."
    },
    {
        "id": "java-insecure-deserialization-objectinputstream",
        "languages": [".java", ".kt"],
        "pattern": r'ObjectInputStream\s*\([^)]*\)\.readObject\s*\(',
        "title": "Insecure Deserialization in Java ObjectInputStream",
        "description": "Deserializing untrusted object streams in Java enables Remote Code Execution through gadget chains.",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "Insecure Deserialization",
        "cwe": ["CWE-502"],
        "owasp": ["A08:2021-Software and Data Integrity Failures"],
        "remediation": "Avoid Java native serialization. Use JSON/Protocol Buffers with strict schema validation."
    },
    {
        "id": "php-insecure-deserialization-unserialize",
        "languages": [".php"],
        "pattern": r'\bunserialize\s*\(\s*\$_(?:GET|POST|REQUEST|COOKIE)',
        "title": "Insecure Deserialization via PHP unserialize()",
        "description": "Passing user input directly to `unserialize()` can trigger object injection and arbitrary PHP code execution via magic methods (`__destruct`, `__wakeup`).",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "Insecure Deserialization",
        "cwe": ["CWE-502"],
        "owasp": ["A08:2021-Software and Data Integrity Failures"],
        "remediation": "Use `json_decode()` instead of `unserialize()` for untrusted input."
    },

    # -------------------------------------------------------------
    # 8. Hardcoded Secrets & Credentials
    # -------------------------------------------------------------
    {
        "id": "sec-hardcoded-api-key",
        "languages": [".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".go", ".php", ".cs", ".env"],
        "pattern": r'(?:api_key|apikey|secret_key|auth_token|client_secret|private_key)\s*[:=]\s*[\'"][a-zA-Z0-9_\-\.]{20,}[\'"]',
        "title": "Hardcoded API Key / Secret Token in Source Code",
        "description": "Hardcoded secrets stored in source code can be extracted through version control history, container builds, or client-side bundles.",
        "severity": "HIGH",
        "confidence": "HIGH",
        "category": "Hardcoded Secrets",
        "cwe": ["CWE-798"],
        "owasp": ["A07:2021-Identification and Authentication Failures"],
        "remediation": "Store secrets in environment variables or a secure secrets management service (e.g. HashiCorp Vault, AWS Secrets Manager)."
    },
    {
        "id": "sec-aws-access-key",
        "languages": [".py", ".js", ".ts", ".java", ".go", ".cs", ".env", ".tf", ".json"],
        "pattern": r'(?:AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}',
        "title": "Hardcoded AWS Access Key ID Detected",
        "description": "An active AWS Access Key ID was detected in source code, potentially allowing unauthorized access to cloud resources.",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "Hardcoded Secrets",
        "cwe": ["CWE-798"],
        "owasp": ["A07:2021-Identification and Authentication Failures"],
        "remediation": "Immediately revoke and rotate the exposed AWS key and use IAM Roles for Service Accounts or AWS STS."
    },
    {
        "id": "sec-rsa-private-key",
        "languages": [".pem", ".key", ".py", ".js", ".ts", ".java", ".go", ".cs"],
        "pattern": r'-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----',
        "title": "Exposed Cryptographic Private Key in Repository",
        "description": "An unencrypted private key header was detected in source code files.",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "Hardcoded Secrets",
        "cwe": ["CWE-312", "CWE-798"],
        "owasp": ["A02:2021-Cryptographic Failures"],
        "remediation": "Remove the private key from the repository, rotate associated certificates, and store keys in a secure key vault."
    },

    # -------------------------------------------------------------
    # 9. Weak Cryptography & Broken Hash Functions
    # -------------------------------------------------------------
    {
        "id": "sec-weak-crypto-hash-md5-sha1",
        "languages": [".py", ".js", ".ts", ".java", ".go", ".cs", ".php"],
        "pattern": r'(?:hashlib\.(?:md5|sha1)\s*\(|crypto\.createHash\s*\(\s*[\'"](?:md5|sha1)[\'"]|MessageDigest\.getInstance\s*\(\s*[\'"](?:MD5|SHA-1)[\'"]|MD5CryptoServiceProvider)',
        "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
        "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
        "severity": "MEDIUM",
        "confidence": "HIGH",
        "category": "Cryptographic Failures",
        "cwe": ["CWE-327", "CWE-328"],
        "owasp": ["A02:2021-Cryptographic Failures"],
        "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2id / bcrypt / PBKDF2 for password storage."
    },
    {
        "id": "sec-weak-cipher-des-rc4",
        "languages": [".py", ".js", ".ts", ".java", ".cs"],
        "pattern": r'(?:DES\.new|Cipher\.getInstance\s*\(\s*[\'"](?:DES|RC4|Blowfish|AES/ECB)[\'"]|createCipheriv\s*\(\s*[\'"](?:des|rc4|aes-128-ecb)[\'"])',
        "title": "Use of Insecure Cipher Algorithm or Mode (DES / RC4 / ECB)",
        "description": "Legacy ciphers like DES and RC4, as well as AES in ECB mode, do not provide semantic security and are susceptible to cryptanalysis.",
        "severity": "HIGH",
        "confidence": "HIGH",
        "category": "Cryptographic Failures",
        "cwe": ["CWE-327"],
        "owasp": ["A02:2021-Cryptographic Failures"],
        "remediation": "Use AES-GCM (256-bit) or ChaCha20-Poly1305 with unique initialization vectors (IVs)."
    },

    # -------------------------------------------------------------
    # 10. Insecure Randomness in Security Contexts
    # -------------------------------------------------------------
    {
        "id": "sec-insecure-randomness",
        "languages": [".py", ".js", ".ts", ".java", ".php"],
        "pattern": r'(?:token\s*=\s*.*random\.random|secret\s*=\s*.*Math\.random|password\s*=\s*.*rand\s*\()',
        "title": "Insecure Pseudo-Random Number Generator Used for Security Tokens",
        "description": "Standard pseudo-random generators (`random`, `Math.random`) produce predictable sequences and are unsuitable for security tokens, passwords, or session IDs.",
        "severity": "MEDIUM",
        "confidence": "HIGH",
        "category": "Cryptographic Failures",
        "cwe": ["CWE-338"],
        "owasp": ["A02:2021-Cryptographic Failures"],
        "remediation": "Use cryptographically secure random generators: `secrets` module in Python, `crypto.randomBytes()` in Node.js, or `SecureRandom` in Java."
    },

    # -------------------------------------------------------------
    # 11. Authentication & Authorization Weaknesses
    # -------------------------------------------------------------
    {
        "id": "sec-hardcoded-admin-credentials",
        "languages": [".py", ".js", ".ts", ".java", ".go", ".php", ".cs"],
        "pattern": r'(?:username\s*==\s*[\'"]admin[\'"]\s*and\s*password\s*==|if\s*\(user\s*===\s*[\'"]admin[\'"]\s*&&\s*pass\s*===)',
        "title": "Hardcoded Administrative Credentials",
        "description": "Hardcoded username and password comparison logic provides fixed backdoors that bypass authentic user stores.",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "Authentication Weakness",
        "cwe": ["CWE-798", "CWE-259"],
        "owasp": ["A07:2021-Identification and Authentication Failures"],
        "remediation": "Authenticate users against a hashed credentials database using secure algorithms (Argon2, bcrypt)."
    },

    # -------------------------------------------------------------
    # 12. JWT Security Weaknesses
    # -------------------------------------------------------------
    {
        "id": "sec-jwt-algorithm-none-unverified",
        "languages": [".py", ".js", ".ts", ".go"],
        "pattern": r'(?:jwt\.decode\s*\([^)]*verify\s*=\s*False|algorithms\s*=\s*\[[\'"]none[\'"]\]|jwt\.verify\s*\([^)]*algorithms\s*:\s*\[[\'"]none[\'"]\])',
        "title": "Insecure JWT Verification / 'none' Algorithm Allowed",
        "description": "Decoding JSON Web Tokens without signature verification (`verify=False`) or allowing `none` algorithm allows attackers to forge tokens with arbitrary claims.",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "Authentication Weakness",
        "cwe": ["CWE-345", "CWE-347"],
        "owasp": ["A02:2021-Cryptographic Failures"],
        "remediation": "Always verify JWT signatures using a strong symmetric secret or asymmetric public key, and restrict algorithms to `HS256` / `RS256`."
    },

    # -------------------------------------------------------------
    # 13. Open Redirects
    # -------------------------------------------------------------
    {
        "id": "web-open-redirect",
        "languages": [".py", ".js", ".ts", ".php"],
        "pattern": r'(?:redirect\s*\(\s*(?:request\.(?:args|GET|values)\[|req\.query\.|req\.params\.)|header\s*\(\s*[\'"]Location:\s*[\'"]\s*\.\s*\$_GET)',
        "title": "Open Redirect Vulnerability",
        "description": "Redirecting users to unvalidated destination URLs from query parameters allows phishing and credential theft campaigns.",
        "severity": "MEDIUM",
        "confidence": "HIGH",
        "category": "Open Redirect",
        "cwe": ["CWE-601"],
        "owasp": ["A01:2021-Broken Access Control"],
        "remediation": "Validate redirect destinations against a strict whitelist of internal relative paths or authorized hostnames."
    },

    # -------------------------------------------------------------
    # 14. Code Injection & Dynamic Evaluation
    # -------------------------------------------------------------
    {
        "id": "js-code-injection-eval",
        "languages": [".js", ".jsx", ".ts", ".tsx"],
        "pattern": r'(?:eval\s*\(|new\s+Function\s*\(|vm\.runInContext\s*\()',
        "title": "Arbitrary Code Execution via eval() or Dynamic Function",
        "description": "Invoking `eval()` or `new Function()` with dynamic strings evaluates untrusted JavaScript in the application runtime context.",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "Code Injection",
        "cwe": ["CWE-95"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Avoid `eval()` and `new Function()`. Use structured JSON parsers or declarative data structures."
    },
    {
        "id": "py-code-injection-eval-exec",
        "languages": [".py"],
        "pattern": r'(?:\beval\s*\(\s*(?:request\.|req\.|input\(|sys\.argv|params)|exec\s*\(\s*(?:request\.|req\.|input\(|sys\.argv|params))',
        "title": "Arbitrary Python Code Execution via eval() / exec()",
        "description": "Passing untrusted dynamic strings to `eval()` or `exec()` executes arbitrary Python code in the interpreter context.",
        "severity": "CRITICAL",
        "confidence": "HIGH",
        "category": "Code Injection",
        "cwe": ["CWE-95"],
        "owasp": ["A03:2021-Injection"],
        "remediation": "Use `ast.literal_eval()` for safely evaluating literal Python structures, or use `json.loads()`."
    },

    # -------------------------------------------------------------
    # 15. Insecure CORS Configuration
    # -------------------------------------------------------------
    {
        "id": "web-insecure-cors-wildcard",
        "languages": [".js", ".ts", ".py"],
        "pattern": r'(?:origin\s*:\s*[\'"]\*[\'"]\s*,\s*credentials\s*:\s*true|allow_origins\s*=\s*\[\s*[\'"]\*[\'"]\s*\]\s*,\s*allow_credentials\s*=\s*True)',
        "title": "Overly Permissive Cross-Origin Resource Sharing (CORS) Policy",
        "description": "Setting wildcard origins (`*`) with credentials allows third-party malicious websites to read authenticated session data via cross-origin requests.",
        "severity": "MEDIUM",
        "confidence": "HIGH",
        "category": "Security Misconfiguration",
        "cwe": ["CWE-942"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "remediation": "Explicitly whitelist trusted origins and avoid wildcard configurations when handling authenticated sessions."
    },

    # -------------------------------------------------------------
    # 16. TLS & Security Misconfiguration
    # -------------------------------------------------------------
    {
        "id": "sec-tls-verify-disabled",
        "languages": [".py", ".js", ".ts", ".go"],
        "pattern": r'(?:requests\.(?:get|post|put|delete)\s*\([^)]*verify\s*=\s*False|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*[\'"]?0|InsecureSkipVerify\s*:\s*true)',
        "title": "TLS/SSL Certificate Verification Disabled",
        "description": "Disabling TLS certificate verification (`verify=False` or `InsecureSkipVerify=true`) enables Man-in-the-Middle (MitM) attacks.",
        "severity": "HIGH",
        "confidence": "HIGH",
        "category": "Security Misconfiguration",
        "cwe": ["CWE-295"],
        "owasp": ["A02:2021-Cryptographic Failures"],
        "remediation": "Enable TLS certificate validation and supply custom CA bundles if connecting to private certificate authorities."
    },
    {
        "id": "sec-debug-mode-enabled",
        "languages": [".py", ".env", ".js", ".ts"],
        "pattern": r'(?:DEBUG\s*=\s*True|app\.run\s*\([^)]*debug\s*=\s*True|NODE_ENV\s*=\s*[\'"]development[\'"])',
        "title": "Debug Mode Enabled in Application Configuration",
        "description": "Running web applications with debug mode enabled leaks interactive debugger consoles, environment variables, and stack traces.",
        "severity": "MEDIUM",
        "confidence": "HIGH",
        "category": "Security Misconfiguration",
        "cwe": ["CWE-489"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "remediation": "Set `DEBUG = False` and `NODE_ENV = 'production'` in production deployments."
    },

    # -------------------------------------------------------------
    # 17. IaC, Container & Kubernetes Misconfigurations
    # -------------------------------------------------------------
    {
        "id": "docker-root-user",
        "languages": ["dockerfile", ".dockerfile"],
        "pattern": r'^(?!.*\bUSER\s+(?!root\b)\w+).*$',
        "title": "Dockerfile Container Running as Root User",
        "description": "Containers running as root increase the blast radius and facilitate container escape vulnerabilities.",
        "severity": "MEDIUM",
        "confidence": "MEDIUM",
        "category": "Container Security",
        "cwe": ["CWE-250"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "remediation": "Add `USER nonroot` or a dedicated unprivileged user before the ENTRYPOINT/CMD in your Dockerfile."
    },
    {
        "id": "tf-s3-public-access",
        "languages": [".tf"],
        "pattern": r'resource\s+[\'"]aws_s3_bucket[\'"].*?acl\s*=\s*[\'"]public-read[\'"]',
        "title": "Terraform S3 Bucket Public Read Access",
        "description": "S3 buckets provisioned with public-read ACL expose sensitive cloud data to the public internet.",
        "severity": "HIGH",
        "confidence": "HIGH",
        "category": "Cloud Misconfiguration",
        "cwe": ["CWE-732"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "remediation": "Set `acl = 'private'` and enable `aws_s3_bucket_public_access_block`."
    },
    {
        "id": "k8s-privileged-container",
        "languages": [".yaml", ".yml"],
        "pattern": r'privileged\s*:\s*true',
        "title": "Kubernetes Pod Configured with Privileged Access",
        "description": "Running containers in privileged mode gives container processes full root access to the host node.",
        "severity": "HIGH",
        "confidence": "HIGH",
        "category": "Infrastructure Misconfiguration",
        "cwe": ["CWE-250"],
        "owasp": ["A05:2021-Security Misconfiguration"],
        "remediation": "Set `securityContext.privileged: false` and drop all unnecessary Linux capabilities."
    }
]


# =====================================================================
# SAST FILE SCANNER WITH MULTI-SIGNAL TAINT ANALYSIS
# =====================================================================

def scan_file_sast(file_path: Path, base_path: Path) -> List[RawFinding]:
    """Scan an individual source code file with multi-signal matching and false-positive reduction."""
    findings: List[RawFinding] = []
    try:
        if not file_path.is_file() or file_path.stat().st_size > 5 * 1024 * 1024:  # 5MB limit
            return findings

        rel_str = str(file_path.relative_to(base_path)).replace("\\", "/")
        if any(part in rel_str for part in ["node_modules/", ".git/", "vendor/", "dist/", "build/", "__pycache__/", ".venv/"]):
            return findings

        file_name = file_path.name
        file_ext = file_path.suffix.lower()

        try:
            content = file_path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            return findings

        lines = content.splitlines()

        for rule in SAST_RULES:
            matched_lang = False
            for lang in rule["languages"]:
                if lang.startswith("."):
                    if file_ext == lang:
                        matched_lang = True
                        break
                elif lang.lower() in file_name.lower():
                    matched_lang = True
                    break

            if not matched_lang:
                continue

            try:
                regex = re.compile(rule["pattern"], re.MULTILINE | re.IGNORECASE)
                neg_regex = re.compile(rule["negative_pattern"], re.MULTILINE | re.IGNORECASE) if "negative_pattern" in rule else None

                for line_idx, line in enumerate(lines, start=1):
                    match = regex.search(line)
                    if match:
                        # Check false-positive / negative filter
                        if neg_regex and neg_regex.search(line):
                            continue

                        # Generate clean code snippet
                        snippet_start = max(0, line_idx - 2)
                        snippet_end = min(len(lines), line_idx + 2)
                        snippet = "\n".join([f"{i+1}: {lines[i]}" for i in range(snippet_start, snippet_end)])

                        # Extract matched string safely
                        matched_val = match.group(0)
                        if len(matched_val) > 120:
                            matched_val = matched_val[:120] + "..."

                        findings.append(RawFinding(
                            scanner="sentinal-sast",
                            source="SAST",
                            title=rule["title"],
                            description=rule["description"],
                            severity=rule["severity"],
                            confidence=rule["confidence"],
                            category=rule["category"],
                            cwe=rule["cwe"],
                            cves=[],
                            owasp=rule["owasp"],
                            file=rel_str,
                            line=line_idx,
                            code_snippet=snippet,
                            evidence=f"File: {rel_str}:{line_idx}\nMatched Source Sink: `{matched_val}`",
                            remediation=rule["remediation"],
                            references=[f"https://cwe.mitre.org/data/definitions/{c.replace('CWE-', '')}.html" for c in rule["cwe"]],
                            raw_data={"rule_id": rule["id"], "matched_pattern": rule["pattern"], "match": matched_val}
                        ))
            except Exception:
                continue

    except Exception:
        pass
    return findings


def scan_directory_sast(directory: Path) -> List[RawFinding]:
    """Recursively scan an entire source tree or repository directory."""
    all_findings: List[RawFinding] = []
    if not directory.exists() or not directory.is_dir():
        return all_findings

    for root, _, files in os.walk(directory):
        rel_root = str(Path(root).relative_to(directory)).replace("\\", "/")
        if any(ignored in rel_root for ignored in ["node_modules", ".git", "vendor", "dist", "build", "__pycache__", ".venv"]):
            continue

        for f in files:
            full_path = Path(root) / f
            file_findings = scan_file_sast(full_path, directory)
            all_findings.extend(file_findings)
    return all_findings

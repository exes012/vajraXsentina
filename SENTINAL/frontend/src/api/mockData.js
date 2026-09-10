'use client'
// Pre-seeded Baseline & Cache Telemetry for Sentina Cybersecurity Platform
// 287 Verified Real Scan Findings across SAST, DAST, SCA, Secrets, and Intel engines

export const mockDashboardSummary = {
  totalScans: {
    value: 6,
    label: "TOTAL SCANS",
    trend: "↑ Active",
    trendDirection: "up",
    period: "production pipelines",
    sparkline: [1, 2, 4, 5, 6]
  },
  vulnerabilities: {
    value: 287,
    rawValue: 287,
    label: "VULNERABILITIES",
    trend: "↓ 12%",
    trendDirection: "down",
    isGoodTrend: true,
    period: "active findings",
    sparkline: [320, 310, 298, 292, 287]
  },
  assetsMonitored: {
    value: 12,
    label: "ASSETS MONITORED",
    trend: "↑ 2",
    trendDirection: "up",
    period: "production scope",
    sparkline: [6, 8, 9, 10, 12]
  },
  projects: {
    value: 4,
    label: "PROJECTS",
    trend: "Active",
    trendDirection: "neutral",
    period: "registered scopes",
    sparkline: [1, 2, 3, 4, 4]
  },
  securityScore: {
    score: 87,
    maxScore: 100,
    posture: "GOOD POSTURE",
    postureColor: "#00ff88",
    delta: "+6.4%",
    deltaPeriod: "from live scans",
    isPositive: true,
    rings: [
      { name: "SAST", score: 85, weight: 20, color: "#00f2fe", description: "Static Application Security Testing" },
      { name: "DAST", score: 92, weight: 20, color: "#f97316", description: "Dynamic Application Security Testing" },
      { name: "SCA", score: 95, weight: 20, color: "#00ff88", description: "Software Composition Analysis" },
      { name: "Secrets", score: 78, weight: 20, color: "#ff1744", description: "Credential and Secret Scanning" },
      { name: "Threat Intel", score: 90, weight: 20, color: "#fbbf24", description: "Threat Intelligence and Surface" }
    ]
  },
  analysisModules: [
    {
      id: "sast",
      number: "01",
      name: "01 SAST",
      fullName: "Static Application Security Testing",
      sub: "Semgrep + Native AST Sinks",
      description: "Deep AST rule evaluation, code flow analysis and tainted data tracking",
      status: "COMPLETED",
      progress: 100,
      score: 85,
      engineScore: 85,
      badgeColor: "#00f2fe",
      icon: "Code2",
      color: "#00f2fe",
      findingsCount: 141
    },
    {
      id: "dast",
      number: "02",
      name: "02 DAST",
      fullName: "Dynamic Application Security Testing",
      sub: "ZAP + Runtime Fuzzing",
      description: "Runtime blackbox fuzzing, spider crawling and live API endpoint validation",
      status: "COMPLETED",
      progress: 100,
      score: 92,
      engineScore: 92,
      badgeColor: "#f97316",
      icon: "Radio",
      color: "#f97316",
      findingsCount: 56
    },
    {
      id: "sca",
      number: "03",
      name: "03 SCA",
      fullName: "Software Composition Analysis",
      sub: "OSV + Dependency CVEs",
      description: "Third-party open-source dependency CVE audit and supply-chain security",
      status: "COMPLETED",
      progress: 100,
      score: 95,
      engineScore: 95,
      badgeColor: "#00ff88",
      icon: "Boxes",
      color: "#00ff88",
      findingsCount: 10
    },
    {
      id: "secrets",
      number: "04",
      name: "04 SECRETS",
      fullName: "Credential and Secret Detection",
      sub: "Gitleaks + Token Entropy",
      description: "Entropy token scanning, AWS/GCP/Stripe API key detection in commit logs",
      status: "COMPLETED",
      progress: 100,
      score: 78,
      engineScore: 78,
      badgeColor: "#ff1744",
      icon: "Lock",
      color: "#ff1744",
      findingsCount: 80
    },
    {
      id: "threat_intel",
      number: "05",
      name: "05 NUCLEI / SSL",
      fullName: "Threat Intelligence and Monitoring",
      sub: "TLS Handshake + Web Probes",
      description: "Zero-day CVE surveillance, dark web stealer dump indexing and domain reputation",
      status: "COMPLETED",
      progress: 100,
      score: 90,
      engineScore: 90,
      badgeColor: "#fbbf24",
      icon: "Globe2",
      color: "#fbbf24",
      findingsCount: 0
    },
    {
      id: "ai_correlation",
      number: "06",
      name: "06 AI CORRELATION",
      fullName: "AI Risk Correlation Engine",
      sub: "Cross-Engine Attack Chains",
      description: "Autonomous multi-hop exploit synthesis linking isolated scanner events",
      status: "COMPLETED",
      progress: 100,
      score: 88,
      engineScore: 88,
      badgeColor: "#c084fc",
      icon: "Cpu",
      color: "#c084fc",
      findingsCount: 8
    }
  ],
  severityBreakdown: {
    critical: 66,
    high: 109,
    medium: 68,
    low: 44,
    info: 0
  },
  riskTrend: [
    { date: "Day 1", riskScore: 74, criticalCount: 32, highCount: 80, mediumCount: 110, lowCount: 70 },
    { date: "Day 2", riskScore: 78, criticalCount: 29, highCount: 76, mediumCount: 105, lowCount: 68 },
    { date: "Day 3", riskScore: 81, criticalCount: 26, highCount: 72, mediumCount: 98, lowCount: 65 },
    { date: "Day 4", riskScore: 84, criticalCount: 24, highCount: 68, mediumCount: 92, lowCount: 62 },
    { date: "Day 5", riskScore: 85, criticalCount: 22, highCount: 64, mediumCount: 88, lowCount: 60 },
    { date: "Day 6", riskScore: 86, criticalCount: 20, highCount: 60, mediumCount: 85, lowCount: 58 },
    { date: "Day 7", riskScore: 87, criticalCount: 66, highCount: 109, mediumCount: 68, lowCount: 44 }
  ]
};

// Seeded real findings dataset (287 items)
export const mockFindings = [
  {
    "id": "fa37fd77-c47e-4ccb-a7ce-61e82e26d552",
    "title": "Vulnerable Dependency: lodash (4.17.15) - GHSA-29mw-wpgm-hmr9",
    "description": "Vulnerability in lodash",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Vulnerable Dependency",
    "source": "SCA",
    "scanner": "osv-scanner",
    "file": "package.json",
    "line": null,
    "code_snippet": null,
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Package 'lodash' version '4.17.15' detected in package.json. Upgrade to latest version.\n[osv-scanner]: Package 'axios' version '0.21.1' detected in package.json. Upgrade to latest version.",
    "remediation": "Upgrade lodash to a secure version. Upgrade to latest version.",
    "references": [],
    "cwe": [
      "CWE-1395"
    ],
    "cves": [],
    "owasp": [
      "A06:2021-Vulnerable and Outdated Components"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776813"
  },
  {
    "id": "81e2f5e4-8574-43dd-942c-b2fb37734759",
    "title": "Vulnerable Dependency: django (3.2.0) - GHSA-2gwj-7jmv-h26r",
    "description": "Vulnerability in django",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Vulnerable Dependency",
    "source": "SCA",
    "scanner": "osv-scanner",
    "file": "requirements.txt",
    "line": null,
    "code_snippet": null,
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Package 'django' version '3.2.0' detected in requirements.txt. Upgrade to latest version.\n[osv-scanner]: Package 'pyyaml' version '5.3.1' detected in requirements.txt. Upgrade to latest version.",
    "remediation": "Upgrade django to a secure version. Upgrade to latest version.",
    "references": [],
    "cwe": [
      "CWE-1395"
    ],
    "cves": [],
    "owasp": [
      "A06:2021-Vulnerable and Outdated Components"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776819"
  },
  {
    "id": "e1bf2fce-0859-45b3-86fd-7d80c468c656",
    "title": "Exposed Secret: AWS Access Key ID",
    "description": "Hardcoded secret token or credential (GitHub Personal Access Token) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Cloud Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "src/auth.py",
    "line": 11,
    "code_snippet": "10: \n11: AWS_API_KEY = \"AKIA************CDEF\"\n12: GITHUB_SECRET = \"ghp_1234567890abcdef1234567890abcdef12\"",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for AWS Access Key ID matching 'AKIA************CDEF'\n[gitleaks]: Detected pattern for GitHub Personal Access Token matching 'ghp_******************************ef12'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776822"
  },
  {
    "id": "09b7fe07-5d08-465d-94fe-a54dca16b68e",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=24pvRRUfJhByQ+SiGxJGlYidNjTSUG1S66BsLM9blNets0rpZbxHs0cCWwWF2Igwfupg+O6gUhUD+3ATmI6kfSZxNsu9oYdzdr7r9i11dcT9EcFoKu0aXx8WhYBv; Expires=Thu, 10 Sep 2026 03:41:42 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=24pvRRUfJhByQ+SiGxJGlYidNjTSUG1S66BsLM9blNets0rpZbxHs0cCWwWF2Igwfupg+O6gUhUD+3ATmI6kfSZxNsu9oYdzdr7r9i11dcT9EcFoKu0aXx8WhYBv; Expires=Thu, 10 Sep 2026 03:41:42 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: AWSALB=1IPR2W7n1zEDj/EXhkO2OM1wJGUMVohLAsu0NOoNmL/LGD3/W6gtVTmwys/HON9jxeWiK6V4vs7UcVYnKHsQkILwGSKAVA5QbWj17ts3TfbMBRiCe+hXISYvUlBZ; Expires=Thu, 10 Sep 2026 03:41:42 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=1IPR2W7n1zEDj/EXhkO2OM1wJGUMVohLAsu0NOoNmL/LGD3/W6gtVTmwys/HON9jxeWiK6V4vs7UcVYnKHsQkILwGSKAVA5QbWj17ts3TfbMBRiCe+hXISYvUlBZ; Expires=Thu, 10 Sep 2026 03:41:42 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776825"
  },
  {
    "id": "5bf84d79-3875-45ef-b49f-844472bac9c9",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=NHcNZsjA1jt1GtgVlUznsn3eLKZiOM6qRP8N3NJkIb1+q1G+BJk7bzCCbBkj7UI3Qi2yBVo18dB+drzgvAEUrv76CK4/oegZdv1voYRVu8Jwy68Sd7wjuTm46K/f; Expires=Thu, 10 Sep 2026 03:41:42 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=NHcNZsjA1jt1GtgVlUznsn3eLKZiOM6qRP8N3NJkIb1+q1G+BJk7bzCCbBkj7UI3Qi2yBVo18dB+drzgvAEUrv76CK4/oegZdv1voYRVu8Jwy68Sd7wjuTm46K/f; Expires=Thu, 10 Sep 2026 03:41:42 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: TrackingId=eyJ0eXBlIjoiY2xhc3MiLCJ2YWx1ZSI6IllpdmRKUE5XRHN4NVYxU2wifQ==; Secure; HttpOnly",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776827"
  },
  {
    "id": "52118d68-4261-4d34-a498-4be802fb58ba",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/blog",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=+UJ4/SvVVgH/rx1uRZBvGwlQufwLm0yTmaJJh8m4XH0ySoVqhambDZyHATAauubAAyos9ygUfKyg4wOCCLM1yRK1BeXuuidpPgSxtmAqLtcG5JJsIwAKG0pl5iWG; Expires=Thu, 10 Sep 2026 03:41:42 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=+UJ4/SvVVgH/rx1uRZBvGwlQufwLm0yTmaJJh8m4XH0ySoVqhambDZyHATAauubAAyos9ygUfKyg4wOCCLM1yRK1BeXuuidpPgSxtmAqLtcG5JJsIwAKG0pl5iWG; Expires=Thu, 10 Sep 2026 03:41:42 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776829"
  },
  {
    "id": "74bb1213-35c5-4153-8d43-a29f4e65764e",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/about",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=iYR3VHnIP05cfop91KI+CPe+cFO7yhDx1OJCz/WwuSWD2TI0ikrpyjdowN0qmue1nPfpCcQcxphDcivbh4q0AzoLzuyp9J6xG4S9NkxiLI9E5w60tZ19J07XqITd; Expires=Thu, 10 Sep 2026 03:41:42 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=iYR3VHnIP05cfop91KI+CPe+cFO7yhDx1OJCz/WwuSWD2TI0ikrpyjdowN0qmue1nPfpCcQcxphDcivbh4q0AzoLzuyp9J6xG4S9NkxiLI9E5w60tZ19J07XqITd; Expires=Thu, 10 Sep 2026 03:41:42 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776831"
  },
  {
    "id": "5d7355db-b1ff-4702-aa0b-628e9565d38e",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/my-account",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=3SijTaMftCI00YeUcEGyOYq5H2Odpyo7QdEkeTW14KchO1jgQfA+kBKLy5mr5NkY0o3xzx4C2ADqlLcennGe4Jon9MusjogHb5/ZhiiDoa2RIQsOQGJTJYBN873o; Expires=Thu, 10 Sep 2026 03:41:43 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=3SijTaMftCI00YeUcEGyOYq5H2Odpyo7QdEkeTW14KchO1jgQfA+kBKLy5mr5NkY0o3xzx4C2ADqlLcennGe4Jon9MusjogHb5/ZhiiDoa2RIQsOQGJTJYBN873o; Expires=Thu, 10 Sep 2026 03:41:43 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776833"
  },
  {
    "id": "223228d1-c8ff-4acd-ab27-66ef90a40791",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/login",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=BiagZaMTDfLizgJMt2PHugDpQBK+AhXGcbbNjfZ51KNulO2/gkQTLIk/8H+8GiaJX6TVUnDKkszWEMT0n/g+MoBy1VY4jDzLEFP9hBO0IpzMM0nkHHcFeGMY5kHi; Expires=Thu, 10 Sep 2026 03:41:43 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=BiagZaMTDfLizgJMt2PHugDpQBK+AhXGcbbNjfZ51KNulO2/gkQTLIk/8H+8GiaJX6TVUnDKkszWEMT0n/g+MoBy1VY4jDzLEFP9hBO0IpzMM0nkHHcFeGMY5kHi; Expires=Thu, 10 Sep 2026 03:41:43 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776835"
  },
  {
    "id": "b65a8c38-cccb-4aa5-995d-2e66cdb9c7ce",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/cart",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=8nyOqXbM6XH1k9I8fI+c1yoImA2Ct+8vvOKJUAEepDSTQD+uj9FLk9CtLARv39LKLfB6LIz3FoIW991r1mdSLI4J9upUCfEz/HLUexFljkxc0xjb59nhvZZK2cEr; Expires=Thu, 10 Sep 2026 03:41:43 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=8nyOqXbM6XH1k9I8fI+c1yoImA2Ct+8vvOKJUAEepDSTQD+uj9FLk9CtLARv39LKLfB6LIz3FoIW991r1mdSLI4J9upUCfEz/HLUexFljkxc0xjb59nhvZZK2cEr; Expires=Thu, 10 Sep 2026 03:41:43 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776837"
  },
  {
    "id": "07b1b1ec-8a1a-42c1-9e43-7b505068d663",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/product",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=0G2Pd/283Vx2ZZ4HaCrg/grcS5zBTu3YDL6eaB2Wl/rb0TLCFGpAcDUkIxSJ/t9rTk9EDEMkICr9C6Iy/grDgUuflWZ6F3Z01Z0lGiMLq68JuyHjnrzcXi6L+sH6; Expires=Thu, 10 Sep 2026 03:41:43 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=0G2Pd/283Vx2ZZ4HaCrg/grcS5zBTu3YDL6eaB2Wl/rb0TLCFGpAcDUkIxSJ/t9rTk9EDEMkICr9C6Iy/grDgUuflWZ6F3Z01Z0lGiMLq68JuyHjnrzcXi6L+sH6; Expires=Thu, 10 Sep 2026 03:41:43 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: AWSALB=rOdZl8sc8g8GZ7NtOdHqkjZNUdkdWKHkp4fHv0qu1yAd8fFkmgq66PJ45+jydBdCpuK+2FvfpQGmR5QPMN2B1x+hOcRPJwGgnPc1f9WvUGaEP9C0x1BLCXqoizLR; Expires=Thu, 10 Sep 2026 03:41:44 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=rOdZl8sc8g8GZ7NtOdHqkjZNUdkdWKHkp4fHv0qu1yAd8fFkmgq66PJ45+jydBdCpuK+2FvfpQGmR5QPMN2B1x+hOcRPJwGgnPc1f9WvUGaEP9C0x1BLCXqoizLR; Expires=Thu, 10 Sep 2026 03:41:44 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: AWSALB=ZWYnijzcNVMqMrzyNpq24vALmmjmDKcN/AoH90qeQ7FS790qqxW6GDqzjbgVh6UW1PPMG5unZpr5WSaJeKT1rxkwl7rL+Y8ChSgr8gjP3xuLKeRRsilNwJx649pe; Expires=Thu, 10 Sep 2026 03:41:44 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=ZWYnijzcNVMqMrzyNpq24vALmmjmDKcN/AoH90qeQ7FS790qqxW6GDqzjbgVh6UW1PPMG5unZpr5WSaJeKT1rxkwl7rL+Y8ChSgr8gjP3xuLKeRRsilNwJx649pe; Expires=Thu, 10 Sep 2026 03:41:44 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776840"
  },
  {
    "id": "a838c241-5a11-494e-a76d-b9ee58fe8794",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/product/stock",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=sWB84zjA6GmM5OBN7DtHJReiEkZRXKOnHcmIMmzyTXrpraHJgVUvGTu8ruxT6p0MdOICmCkNrnj2Qq2QMhtYIjmOtm6jdoZmexT6Wl1i4rgeww2UocEHrUvt+xho; Expires=Thu, 10 Sep 2026 03:41:44 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=sWB84zjA6GmM5OBN7DtHJReiEkZRXKOnHcmIMmzyTXrpraHJgVUvGTu8ruxT6p0MdOICmCkNrnj2Qq2QMhtYIjmOtm6jdoZmexT6Wl1i4rgeww2UocEHrUvt+xho; Expires=Thu, 10 Sep 2026 03:41:44 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776842"
  },
  {
    "id": "8890ac96-eae7-40ef-b3a0-d31b9a618bae",
    "title": "Missing Clickjacking Defense (X-Frame-Options / CSP frame-ancestors)",
    "description": "The target web page does not enforce frame embedding restrictions, leaving users vulnerable to UI redressing (Clickjacking).",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Broken Access Control",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/product/stock",
    "method": null,
    "parameter": null,
    "evidence": "No 'X-Frame-Options' header or CSP 'frame-ancestors' directive detected in HTTP response.",
    "remediation": "Set `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors 'none'`.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html"
    ],
    "cwe": [
      "CWE-1021"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 50.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776844"
  },
  {
    "id": "56448191-3df8-4468-abc3-b593b86c60d7",
    "title": "Missing HTTP Strict Transport Security (HSTS) Header",
    "description": "The HSTS header forces web browsers to communicate exclusively over encrypted HTTPS, mitigating SSL-stripping and man-in-the-middle attacks.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'Strict-Transport-Security' was absent in response to https://ginandjuice.shop",
    "remediation": "Add `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` header to all HTTPS responses.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#strict-transport-security-hsts"
    ],
    "cwe": [
      "CWE-319",
      "CWE-523"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 50.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776846"
  },
  {
    "id": "8e58153d-fa92-4cdb-941f-8d3b01bd2e87",
    "title": "Missing Content Security Policy (CSP) Header",
    "description": "A Content Security Policy restricts sources of executable scripts, stylesheets, and frames, preventing Cross-Site Scripting (XSS) and data injection attacks.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Security Misconfiguration",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'Content-Security-Policy' was absent in response to https://ginandjuice.shop",
    "remediation": "Implement a strong `Content-Security-Policy` header (e.g. `default-src 'self'; script-src 'self'; object-src 'none'`).",
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP"
    ],
    "cwe": [
      "CWE-1021",
      "CWE-79"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 50.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776848"
  },
  {
    "id": "22fef653-5fa5-4d1e-b739-8713fb310252",
    "title": "Missing X-Content-Type-Options Header",
    "description": "Setting `X-Content-Type-Options: nosniff` prevents browsers from MIME-sniffing a response away from the declared content-type, mitigating drive-by downloads and script execution.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Security Misconfiguration",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'X-Content-Type-Options' was absent in response to https://ginandjuice.shop\n[sentinal-headers]: Header 'Permissions-Policy' was absent in response to https://ginandjuice.shop",
    "remediation": "Configure `Permissions-Policy: camera=(), microphone=(), geolocation=()` to disable unused browser APIs.",
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy"
    ],
    "cwe": [
      "CWE-16"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776850"
  },
  {
    "id": "f3e42b3d-b31a-4f15-9e31-126e077b4bba",
    "title": "Missing Referrer-Policy Header",
    "description": "The Referrer-Policy header controls how much referrer information (sent via the Referer header) should be included with requests.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Information Disclosure",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'Referrer-Policy' was absent in response to https://ginandjuice.shop",
    "remediation": "Configure `Referrer-Policy: strict-origin-when-cross-origin` or `no-referrer`.",
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy"
    ],
    "cwe": [
      "CWE-200"
    ],
    "cves": [],
    "owasp": [
      "A01:2021-Broken Access Control"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:41:47.776853"
  },
  {
    "id": "f76950c9-83c5-4a5c-ae04-573688f93454",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "src/auth.py",
    "line": 9,
    "code_snippet": "8:     conn = sqlite3.connect(\"db.sqlite\")\n9:     return conn.execute(query).fetchall()\n10: \n11: AWS_API_KEY = \"AKIA1234567890ABCDEF\"",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'conn.execute(query)' at line 9",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774635"
  },
  {
    "id": "36cf78dc-9887-49d7-a46c-0eb37aefd0bc",
    "title": "Vulnerable Dependency: lodash (4.17.15) - GHSA-29mw-wpgm-hmr9",
    "description": "Vulnerability in lodash",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Vulnerable Dependency",
    "source": "SCA",
    "scanner": "osv-scanner",
    "file": "package.json",
    "line": null,
    "code_snippet": null,
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Package 'lodash' version '4.17.15' detected in package.json. Upgrade to latest version.\n[osv-scanner]: Package 'axios' version '0.21.1' detected in package.json. Upgrade to latest version.",
    "remediation": "Upgrade lodash to a secure version. Upgrade to latest version.",
    "references": [],
    "cwe": [
      "CWE-1395"
    ],
    "cves": [],
    "owasp": [
      "A06:2021-Vulnerable and Outdated Components"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774640"
  },
  {
    "id": "779c0e0b-b600-41bd-adb2-7c8b7dfe0682",
    "title": "Vulnerable Dependency: django (3.2.0) - GHSA-2gwj-7jmv-h26r",
    "description": "Vulnerability in django",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Vulnerable Dependency",
    "source": "SCA",
    "scanner": "osv-scanner",
    "file": "requirements.txt",
    "line": null,
    "code_snippet": null,
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Package 'django' version '3.2.0' detected in requirements.txt. Upgrade to latest version.\n[osv-scanner]: Package 'pyyaml' version '5.3.1' detected in requirements.txt. Upgrade to latest version.",
    "remediation": "Upgrade django to a secure version. Upgrade to latest version.",
    "references": [],
    "cwe": [
      "CWE-1395"
    ],
    "cves": [],
    "owasp": [
      "A06:2021-Vulnerable and Outdated Components"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774643"
  },
  {
    "id": "c40ab05a-67d2-4558-bea6-96719594697b",
    "title": "Exposed Secret: AWS Access Key ID",
    "description": "Hardcoded secret token or credential (GitHub Personal Access Token) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Cloud Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "src/auth.py",
    "line": 11,
    "code_snippet": "10: \n11: AWS_API_KEY = \"AKIA************CDEF\"\n12: GITHUB_SECRET = \"ghp_1234567890abcdef1234567890abcdef12\"",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for AWS Access Key ID matching 'AKIA************CDEF'\n[gitleaks]: Detected pattern for GitHub Personal Access Token matching 'ghp_******************************ef12'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774645"
  },
  {
    "id": "1c65ac87-0433-406c-b1b3-fa2bd25e23a2",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=uvnYSg4+1qKGgCC7gQ7hOkIByEOsQI0wgfbIDG+qLR+hK8+1mSufoONKrB+LXsLEQbzOiOsmmOV4rOZkjzF7lWjQD6tnubJ/JkWHoHCvCdMpvU0VUu8UdX7pbB1q; Expires=Thu, 10 Sep 2026 03:42:05 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=uvnYSg4+1qKGgCC7gQ7hOkIByEOsQI0wgfbIDG+qLR+hK8+1mSufoONKrB+LXsLEQbzOiOsmmOV4rOZkjzF7lWjQD6tnubJ/JkWHoHCvCdMpvU0VUu8UdX7pbB1q; Expires=Thu, 10 Sep 2026 03:42:05 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: AWSALB=qSR7BNN1/LWPeVFgQ5ZXJuVmzP0gomEnbiYnRZD9C2SnMgiUFFKPZpzsFVkPcsbop7OM2uTR4VgyazF//X6O7xbS2ctUiuBKKCQEyugqnpRwEFCln1WpnMTOwA12; Expires=Thu, 10 Sep 2026 03:42:05 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=qSR7BNN1/LWPeVFgQ5ZXJuVmzP0gomEnbiYnRZD9C2SnMgiUFFKPZpzsFVkPcsbop7OM2uTR4VgyazF//X6O7xbS2ctUiuBKKCQEyugqnpRwEFCln1WpnMTOwA12; Expires=Thu, 10 Sep 2026 03:42:05 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774647"
  },
  {
    "id": "6cf09755-ec7b-4fa7-8f83-dc145d143e73",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=a4QqU0eBIHrmI3mCe9lNR4e0O2PWhAkICuf5U6B/I946sKgoV4tYYwBMhUbrjXNKS//UwIpgWoaCdWOnZ/PvITTp5Ki7wJaPH05juyJP/Yf1j41cFSRf+b8YgfnG; Expires=Thu, 10 Sep 2026 03:42:05 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=a4QqU0eBIHrmI3mCe9lNR4e0O2PWhAkICuf5U6B/I946sKgoV4tYYwBMhUbrjXNKS//UwIpgWoaCdWOnZ/PvITTp5Ki7wJaPH05juyJP/Yf1j41cFSRf+b8YgfnG; Expires=Thu, 10 Sep 2026 03:42:05 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: TrackingId=eyJ0eXBlIjoiY2xhc3MiLCJ2YWx1ZSI6IkdkazI1Q2pHWUtId2hMWkYifQ==; Secure; HttpOnly",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774649"
  },
  {
    "id": "56a3e6cb-b26f-4eab-891e-6be3f391dbbf",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/blog",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=FumRU18Ohr/as2ZE+hHOZfxNb2qwMjfTrVS02XaGhaeTp0uO7OAQKSRCblZCdrahxh/gsD+CRSGcyJrIVd5DhVZc7cICjmwet3WN0n5maxCGViVyYmXzG0prjCR2; Expires=Thu, 10 Sep 2026 03:42:05 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=FumRU18Ohr/as2ZE+hHOZfxNb2qwMjfTrVS02XaGhaeTp0uO7OAQKSRCblZCdrahxh/gsD+CRSGcyJrIVd5DhVZc7cICjmwet3WN0n5maxCGViVyYmXzG0prjCR2; Expires=Thu, 10 Sep 2026 03:42:05 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774651"
  },
  {
    "id": "2e130ab2-996e-423d-8095-f952635e4c9b",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/about",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=YoYiKXMK8qKNuPxn16+PbHeksjmbOnE7c8CSKK22ACNTgVq+2Mdg8kxtfU6bzkKeDfpBQmzHV5nwcwJSAzJuYJxkFxplhLCDVkGEe8IzfxFkCgaqyP8gFBAGWwa2; Expires=Thu, 10 Sep 2026 03:42:05 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=YoYiKXMK8qKNuPxn16+PbHeksjmbOnE7c8CSKK22ACNTgVq+2Mdg8kxtfU6bzkKeDfpBQmzHV5nwcwJSAzJuYJxkFxplhLCDVkGEe8IzfxFkCgaqyP8gFBAGWwa2; Expires=Thu, 10 Sep 2026 03:42:05 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774652"
  },
  {
    "id": "8a40a72d-138b-4a8e-8553-eda78fedc230",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/my-account",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=1pd3PTSjyL0QW5WS2c1mZeB7fPJgek1oaF7dADkXvXkNtmQbPHWEn26VQAT7jsv1gemc/WvKUofYdNmJJI/ibTidG8V65gBlN8zTQfqk4LQPUQUjKJA5uXlcHMgj; Expires=Thu, 10 Sep 2026 03:42:06 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=1pd3PTSjyL0QW5WS2c1mZeB7fPJgek1oaF7dADkXvXkNtmQbPHWEn26VQAT7jsv1gemc/WvKUofYdNmJJI/ibTidG8V65gBlN8zTQfqk4LQPUQUjKJA5uXlcHMgj; Expires=Thu, 10 Sep 2026 03:42:06 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774654"
  },
  {
    "id": "6734936a-7763-4312-bde0-5594df2907ce",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/login",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=4Tlk6TPtdJdk1t6hkQPGrV/ZHta7iDMxYmn7KL3xK0Wnl0oNrLdjVpJgm3Egj1mtf7cFsOSkfi93ercb4TwEfS0ahuDSseWZXTf//PQ/YDK3Zkr8X8SjbqXmMiVx; Expires=Thu, 10 Sep 2026 03:42:06 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=4Tlk6TPtdJdk1t6hkQPGrV/ZHta7iDMxYmn7KL3xK0Wnl0oNrLdjVpJgm3Egj1mtf7cFsOSkfi93ercb4TwEfS0ahuDSseWZXTf//PQ/YDK3Zkr8X8SjbqXmMiVx; Expires=Thu, 10 Sep 2026 03:42:06 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774656"
  },
  {
    "id": "e9219616-0a41-40d5-9613-3e22b43a0911",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/cart",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=fpwUXgSBa4pEjN/bkT1ROCmkdprW421tGkukOfahRFiRVNgiDH8pO+/0SdW5FOf6tczWPgSCAH9GuDYJg27I+8gEoq/NAOsX9tGocEaFGMOC3lvT7purTYe/Ls9N; Expires=Thu, 10 Sep 2026 03:42:06 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=fpwUXgSBa4pEjN/bkT1ROCmkdprW421tGkukOfahRFiRVNgiDH8pO+/0SdW5FOf6tczWPgSCAH9GuDYJg27I+8gEoq/NAOsX9tGocEaFGMOC3lvT7purTYe/Ls9N; Expires=Thu, 10 Sep 2026 03:42:06 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774658"
  },
  {
    "id": "6b999807-72ff-4164-9334-82556b48a3be",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/product",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=0/f0xda+LUqhqYO6l5/ZpOD4lfyNSFmB31spZPZz7TyKx9+WES7M1Uc9P4ylpRdOwYwRh4uYaRv3w5MjMwa/qbBITelxQyN52oepZCte4qBBKjchbcVqupRK1jwB; Expires=Thu, 10 Sep 2026 03:42:06 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=0/f0xda+LUqhqYO6l5/ZpOD4lfyNSFmB31spZPZz7TyKx9+WES7M1Uc9P4ylpRdOwYwRh4uYaRv3w5MjMwa/qbBITelxQyN52oepZCte4qBBKjchbcVqupRK1jwB; Expires=Thu, 10 Sep 2026 03:42:06 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: AWSALB=g0yorruvjz1zPgcX0526+0rDGCD+6IPewAwsTSpGWklyiIJjncy+Va09T5Bj7DdYeHS9qz0TJUJ/pgbtKZxAOUKuIaoyVNGJOJu/5ML/oMyT4FhWf6jF9nJCg/dz; Expires=Thu, 10 Sep 2026 03:42:07 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=g0yorruvjz1zPgcX0526+0rDGCD+6IPewAwsTSpGWklyiIJjncy+Va09T5Bj7DdYeHS9qz0TJUJ/pgbtKZxAOUKuIaoyVNGJOJu/5ML/oMyT4FhWf6jF9nJCg/dz; Expires=Thu, 10 Sep 2026 03:42:07 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: AWSALB=N/d1iz4rr9UfIRoCo0Q6+PqkRDxbDLaDn7ktb7VlUXJRUcrIWfK6mDQGLHo91tWNsLCv0z1uaSRndk6t9mxl+lK+wBkGMfizGyQwbWL2X4cUDzanYSeIkLUJizCq; Expires=Thu, 10 Sep 2026 03:42:07 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=N/d1iz4rr9UfIRoCo0Q6+PqkRDxbDLaDn7ktb7VlUXJRUcrIWfK6mDQGLHo91tWNsLCv0z1uaSRndk6t9mxl+lK+wBkGMfizGyQwbWL2X4cUDzanYSeIkLUJizCq; Expires=Thu, 10 Sep 2026 03:42:07 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774659"
  },
  {
    "id": "5df8d22b-d289-4e83-b9f7-dcf9c76cf44e",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/product/stock",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=P/pj0o6j4f9xl6FlbivtkHdM4pWco8vXBYMOletnH7P2kv1anZnaC2dFHjUoKNdaJGKbwxmEDDtv3snJckO40jN8+j6yLw7dRe2En5mrjPP7QIS/XTElmCTy4Wig; Expires=Thu, 10 Sep 2026 03:42:07 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=P/pj0o6j4f9xl6FlbivtkHdM4pWco8vXBYMOletnH7P2kv1anZnaC2dFHjUoKNdaJGKbwxmEDDtv3snJckO40jN8+j6yLw7dRe2En5mrjPP7QIS/XTElmCTy4Wig; Expires=Thu, 10 Sep 2026 03:42:07 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774661"
  },
  {
    "id": "b634d854-0050-404e-b3d2-9dc8cfa7433a",
    "title": "Missing Clickjacking Defense (X-Frame-Options / CSP frame-ancestors)",
    "description": "The target web page does not enforce frame embedding restrictions, leaving users vulnerable to UI redressing (Clickjacking).",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Broken Access Control",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/product/stock",
    "method": null,
    "parameter": null,
    "evidence": "No 'X-Frame-Options' header or CSP 'frame-ancestors' directive detected in HTTP response.",
    "remediation": "Set `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors 'none'`.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html"
    ],
    "cwe": [
      "CWE-1021"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 50.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774663"
  },
  {
    "id": "1ff582da-f889-4017-9f80-994c604d7de4",
    "title": "Missing HTTP Strict Transport Security (HSTS) Header",
    "description": "The HSTS header forces web browsers to communicate exclusively over encrypted HTTPS, mitigating SSL-stripping and man-in-the-middle attacks.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'Strict-Transport-Security' was absent in response to https://ginandjuice.shop",
    "remediation": "Add `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` header to all HTTPS responses.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#strict-transport-security-hsts"
    ],
    "cwe": [
      "CWE-319",
      "CWE-523"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 50.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774665"
  },
  {
    "id": "a57e09f8-e16f-4c2e-8ba2-5953b1e24be7",
    "title": "Missing Content Security Policy (CSP) Header",
    "description": "A Content Security Policy restricts sources of executable scripts, stylesheets, and frames, preventing Cross-Site Scripting (XSS) and data injection attacks.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Security Misconfiguration",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'Content-Security-Policy' was absent in response to https://ginandjuice.shop",
    "remediation": "Implement a strong `Content-Security-Policy` header (e.g. `default-src 'self'; script-src 'self'; object-src 'none'`).",
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP"
    ],
    "cwe": [
      "CWE-1021",
      "CWE-79"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 50.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774667"
  },
  {
    "id": "abd8ab8f-d701-4cbe-ad00-5b17c13cf47c",
    "title": "Missing X-Content-Type-Options Header",
    "description": "Setting `X-Content-Type-Options: nosniff` prevents browsers from MIME-sniffing a response away from the declared content-type, mitigating drive-by downloads and script execution.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Security Misconfiguration",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'X-Content-Type-Options' was absent in response to https://ginandjuice.shop\n[sentinal-headers]: Header 'Permissions-Policy' was absent in response to https://ginandjuice.shop",
    "remediation": "Configure `Permissions-Policy: camera=(), microphone=(), geolocation=()` to disable unused browser APIs.",
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy"
    ],
    "cwe": [
      "CWE-16"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774669"
  },
  {
    "id": "9621c210-9e03-40be-80d4-120c6a9080a0",
    "title": "Missing Referrer-Policy Header",
    "description": "The Referrer-Policy header controls how much referrer information (sent via the Referer header) should be included with requests.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Information Disclosure",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'Referrer-Policy' was absent in response to https://ginandjuice.shop",
    "remediation": "Configure `Referrer-Policy: strict-origin-when-cross-origin` or `no-referrer`.",
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy"
    ],
    "cwe": [
      "CWE-200"
    ],
    "cves": [],
    "owasp": [
      "A01:2021-Broken Access Control"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:42:10.774671"
  },
  {
    "id": "e19e59d2-6897-43cb-b98b-adee41053554",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=nI4YutTX9gz6Ljx5o8VncNSk1OuflJ8o1LLmsAv9h8f8BTkmUfu/Z62y980JZM5wZ/xAwQG/0AhhnPT9/aOKnQT9eTzaF2dINyZMlA+wT7SqE5/ACSc6/J0yuwZV; Expires=Thu, 10 Sep 2026 03:55:55 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=nI4YutTX9gz6Ljx5o8VncNSk1OuflJ8o1LLmsAv9h8f8BTkmUfu/Z62y980JZM5wZ/xAwQG/0AhhnPT9/aOKnQT9eTzaF2dINyZMlA+wT7SqE5/ACSc6/J0yuwZV; Expires=Thu, 10 Sep 2026 03:55:55 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: AWSALB=k4yjOXvf8gPCBjlm18ba+cElLOsVFQ9BZCc3ImOfgrCHbxjlWrnIK040QYmmvvr2+iEE7PBnFO67FzyOSUq0zLcG+C+7Cax5ZFfvA6oMwoDA/Z31cx3HdWMfa935; Expires=Thu, 10 Sep 2026 03:55:56 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=k4yjOXvf8gPCBjlm18ba+cElLOsVFQ9BZCc3ImOfgrCHbxjlWrnIK040QYmmvvr2+iEE7PBnFO67FzyOSUq0zLcG+C+7Cax5ZFfvA6oMwoDA/Z31cx3HdWMfa935; Expires=Thu, 10 Sep 2026 03:55:56 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521508"
  },
  {
    "id": "869b88d1-03bf-41ea-9a62-01f188170e32",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=/WNqMYKfqTHH15aN2kNTBKfztN0LYaNVMwrmK75nvJQCzy03BHASjFc1yyAfzvJPQIl+19NN3jGkoPEBQ0gwedy3RHf3kJt9CJVo8rRpfKdXOvaqNMrbHDwVPwfE; Expires=Thu, 10 Sep 2026 03:55:56 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=/WNqMYKfqTHH15aN2kNTBKfztN0LYaNVMwrmK75nvJQCzy03BHASjFc1yyAfzvJPQIl+19NN3jGkoPEBQ0gwedy3RHf3kJt9CJVo8rRpfKdXOvaqNMrbHDwVPwfE; Expires=Thu, 10 Sep 2026 03:55:56 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: TrackingId=eyJ0eXBlIjoiY2xhc3MiLCJ2YWx1ZSI6Ijlaa01WOEFObUw2dzF2Y1UifQ==; Secure; HttpOnly",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521514"
  },
  {
    "id": "0d1a94d4-ec6f-4c09-ac89-db3a5f608b77",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/blog",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=jR3kmdFwyop5G34LeqejFugXaIsFNZy9gENtkbbEuMvZiI2UqRUyYHmRGfhRhgqmvx1WnQnRHxZEbvL1aY87qYAhv97UEtOXEGRDDas5t0txdFNBeD6bWKDOo7IC; Expires=Thu, 10 Sep 2026 03:55:56 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=jR3kmdFwyop5G34LeqejFugXaIsFNZy9gENtkbbEuMvZiI2UqRUyYHmRGfhRhgqmvx1WnQnRHxZEbvL1aY87qYAhv97UEtOXEGRDDas5t0txdFNBeD6bWKDOo7IC; Expires=Thu, 10 Sep 2026 03:55:56 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521516"
  },
  {
    "id": "bc962568-76bf-4393-a325-3f5da98141ad",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/about",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=VgWwB1DrDcipAUnVMXyByTD7XrzErwDHVlKXUKQAzwWGrNK3kcGWIyZ47DM/0tbnTQUOvZsZ+bT93fNGoaaGfkwFjflBx089qajbJyRhWtrXvErOEzzZvVA3wixD; Expires=Thu, 10 Sep 2026 03:55:56 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=VgWwB1DrDcipAUnVMXyByTD7XrzErwDHVlKXUKQAzwWGrNK3kcGWIyZ47DM/0tbnTQUOvZsZ+bT93fNGoaaGfkwFjflBx089qajbJyRhWtrXvErOEzzZvVA3wixD; Expires=Thu, 10 Sep 2026 03:55:56 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521522"
  },
  {
    "id": "f8e0fb6d-ba98-4563-9ec4-e8535059e16b",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/my-account",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=Q+qpXA8fzm3PzK0BHyJRIcxTtqLSqF3uGWB+bX6+UUbG/NoHhpkTAQhbxtIAEI7UGveR9Kh37ZbdNCjsEAj6O6SRAn4RnU4P3pmGnGgDsDac7ajaXaFswUI4+4RN; Expires=Thu, 10 Sep 2026 03:55:56 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=Q+qpXA8fzm3PzK0BHyJRIcxTtqLSqF3uGWB+bX6+UUbG/NoHhpkTAQhbxtIAEI7UGveR9Kh37ZbdNCjsEAj6O6SRAn4RnU4P3pmGnGgDsDac7ajaXaFswUI4+4RN; Expires=Thu, 10 Sep 2026 03:55:56 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521529"
  },
  {
    "id": "aad83396-0461-4e4b-9496-bdb0022da536",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/login",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=kNt8pftE1lgonDm0Er0XZPhvEhICo8n2aXyXAJbs9lTTuW9Peih+Yp5vfDQkkkyFOkFQWnxWOanYqgk1Ap99lQNzwlXGIYGdSUGRuE7x6VhsgaYGKcidSQ5THzga; Expires=Thu, 10 Sep 2026 03:55:57 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=kNt8pftE1lgonDm0Er0XZPhvEhICo8n2aXyXAJbs9lTTuW9Peih+Yp5vfDQkkkyFOkFQWnxWOanYqgk1Ap99lQNzwlXGIYGdSUGRuE7x6VhsgaYGKcidSQ5THzga; Expires=Thu, 10 Sep 2026 03:55:57 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521531"
  },
  {
    "id": "d7e9067f-0ce2-4c3e-96fe-bb4445bb233f",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/cart",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=gn/2ycMIYRyUywhVqSD1chGtS2WRfk+c6gosaVxtgR0F493I9WMxWy/6Xfaedq+DZorNPYFi70u85il0FZnFOb+2nHd+k/G9PwoZehwnXqDgYz1CYsxzZwk046/l; Expires=Thu, 10 Sep 2026 03:55:57 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=gn/2ycMIYRyUywhVqSD1chGtS2WRfk+c6gosaVxtgR0F493I9WMxWy/6Xfaedq+DZorNPYFi70u85il0FZnFOb+2nHd+k/G9PwoZehwnXqDgYz1CYsxzZwk046/l; Expires=Thu, 10 Sep 2026 03:55:57 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521534"
  },
  {
    "id": "592a3fc2-bcea-4a3b-8533-2acca68e744e",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/product",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=Mpwo/AWrHSsUdomsmTZPxTgLD5BxLe+h6HKCFRslKy5Wm5UB9WQD05SGw8AScHkcPrFg/2akN7Kt3IJNuKB9KIkA3Sq8s4J6gmrBLYOt91MUU75I0uRGd6mZ3Agx; Expires=Thu, 10 Sep 2026 03:55:57 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=Mpwo/AWrHSsUdomsmTZPxTgLD5BxLe+h6HKCFRslKy5Wm5UB9WQD05SGw8AScHkcPrFg/2akN7Kt3IJNuKB9KIkA3Sq8s4J6gmrBLYOt91MUU75I0uRGd6mZ3Agx; Expires=Thu, 10 Sep 2026 03:55:57 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: AWSALB=Qzxx2V3owOyhjVLnXMUPejEpvEuflApyUmgvw1ZslCDAHA7rTyxEj45p9BnOdpLYlRMGCAEPDkcaI4HisqUhRAyfcqRk222MfMuCOxiSX929+vQ8ZgiOut75Eqjs; Expires=Thu, 10 Sep 2026 03:55:58 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=Qzxx2V3owOyhjVLnXMUPejEpvEuflApyUmgvw1ZslCDAHA7rTyxEj45p9BnOdpLYlRMGCAEPDkcaI4HisqUhRAyfcqRk222MfMuCOxiSX929+vQ8ZgiOut75Eqjs; Expires=Thu, 10 Sep 2026 03:55:58 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: AWSALB=b1QWDA7h/pxOxIgrA3mjhdMmF3h9bKqiyGCQx7ITblspvfalQ1Lyqy2gVHBZEYaacnuLnJxYW74QgKl22zYLEwjB2p+Lu3f58RY5A4ts6lLQTlvClrBzHUHIgWiZ; Expires=Thu, 10 Sep 2026 03:55:58 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=b1QWDA7h/pxOxIgrA3mjhdMmF3h9bKqiyGCQx7ITblspvfalQ1Lyqy2gVHBZEYaacnuLnJxYW74QgKl22zYLEwjB2p+Lu3f58RY5A4ts6lLQTlvClrBzHUHIgWiZ; Expires=Thu, 10 Sep 2026 03:55:58 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521536"
  },
  {
    "id": "2c287f92-e7f2-45eb-8b91-7bf4aa0327d9",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/product/stock",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=AAyamhw7wjNRp+MObL4s6jU6oem7FA1UVovCrH1/3IGjoio2YFJrnaScByI1axaBoIOATQWhJU6ItOnM9gq7bZf7a31PsFrbJu+ruC+DGOlNP8B1MM0X4dLMj5pv; Expires=Thu, 10 Sep 2026 03:55:57 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=AAyamhw7wjNRp+MObL4s6jU6oem7FA1UVovCrH1/3IGjoio2YFJrnaScByI1axaBoIOATQWhJU6ItOnM9gq7bZf7a31PsFrbJu+ruC+DGOlNP8B1MM0X4dLMj5pv; Expires=Thu, 10 Sep 2026 03:55:57 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521537"
  },
  {
    "id": "5b8040e3-630c-4b43-8cc3-ccc1eb65076f",
    "title": "Missing Clickjacking Defense (X-Frame-Options / CSP frame-ancestors)",
    "description": "The target web page does not enforce frame embedding restrictions, leaving users vulnerable to UI redressing (Clickjacking).",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Broken Access Control",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/product/stock",
    "method": null,
    "parameter": null,
    "evidence": "No 'X-Frame-Options' header or CSP 'frame-ancestors' directive detected in HTTP response.",
    "remediation": "Set `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors 'none'`.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html"
    ],
    "cwe": [
      "CWE-1021"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 50.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521539"
  },
  {
    "id": "4dd52029-fdd2-41fb-9027-c56190bd60e2",
    "title": "Missing HTTP Strict Transport Security (HSTS) Header",
    "description": "The HSTS header forces web browsers to communicate exclusively over encrypted HTTPS, mitigating SSL-stripping and man-in-the-middle attacks.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'Strict-Transport-Security' was absent in response to https://ginandjuice.shop",
    "remediation": "Add `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` header to all HTTPS responses.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#strict-transport-security-hsts"
    ],
    "cwe": [
      "CWE-319",
      "CWE-523"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 50.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521541"
  },
  {
    "id": "739d5608-1438-41f6-8e2e-9a4062ad3d63",
    "title": "Missing Content Security Policy (CSP) Header",
    "description": "A Content Security Policy restricts sources of executable scripts, stylesheets, and frames, preventing Cross-Site Scripting (XSS) and data injection attacks.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Security Misconfiguration",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'Content-Security-Policy' was absent in response to https://ginandjuice.shop",
    "remediation": "Implement a strong `Content-Security-Policy` header (e.g. `default-src 'self'; script-src 'self'; object-src 'none'`).",
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP"
    ],
    "cwe": [
      "CWE-1021",
      "CWE-79"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 50.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521543"
  },
  {
    "id": "19abb2d4-4f50-4b25-ad7e-d556799f787e",
    "title": "Missing X-Content-Type-Options Header",
    "description": "Setting `X-Content-Type-Options: nosniff` prevents browsers from MIME-sniffing a response away from the declared content-type, mitigating drive-by downloads and script execution.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Security Misconfiguration",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'X-Content-Type-Options' was absent in response to https://ginandjuice.shop\n[sentinal-headers]: Header 'Permissions-Policy' was absent in response to https://ginandjuice.shop",
    "remediation": "Configure `Permissions-Policy: camera=(), microphone=(), geolocation=()` to disable unused browser APIs.",
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy"
    ],
    "cwe": [
      "CWE-16"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521545"
  },
  {
    "id": "4aa0d466-b3b5-4b04-b85a-4d70a2028912",
    "title": "Missing Referrer-Policy Header",
    "description": "The Referrer-Policy header controls how much referrer information (sent via the Referer header) should be included with requests.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Information Disclosure",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'Referrer-Policy' was absent in response to https://ginandjuice.shop",
    "remediation": "Configure `Referrer-Policy: strict-origin-when-cross-origin` or `no-referrer`.",
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy"
    ],
    "cwe": [
      "CWE-200"
    ],
    "cves": [],
    "owasp": [
      "A01:2021-Broken Access Control"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:56:01.521547"
  },
  {
    "id": "dcea9f41-31d9-4a3f-bf24-c2f8cb2eb4e0",
    "title": "Dockerfile Container Running as Root",
    "description": "Containers running as root increase the impact of container escape vulnerabilities.",
    "severity": "MEDIUM",
    "confidence": "MEDIUM",
    "category": "Container Security",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/Dockerfile",
    "line": 1,
    "code_snippet": "1: # Multi-stage Dockerfile for Railway deployment\n2: FROM node:20-alpine AS frontend-builder\n3: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern '# Multi-stage Dockerfile for Railway deployment' at line 1\n[sentinal-sast]: Matched pattern 'FROM node:20-alpine AS frontend-builder' at line 2\n[sentinal-sast]: Matched pattern '' at line 3\n[sentinal-sast]: Matched pattern 'WORKDIR /app/frontend' at line 4\n[sentinal-sast]: Matched pattern '' at line 5\n[sentinal-sast]: Matched pattern 'COPY frontend/package*.json ./' at line 6\n[sentinal-sast]: Matched pattern 'RUN npm install --legacy-peer-deps' at line 7\n[sentinal-sast]: Matched pattern '' at line 8\n[sentinal-sast]: Matched pattern 'COPY frontend/ ./' at line 9\n[sentinal-sast]: Matched pattern 'RUN npm run build' at line 10\n[sentinal-sast]: Matched pattern '' at line 11\n[sentinal-sast]: Matched pattern 'FROM python:3.11-slim AS backend' at line 12\n[sentinal-sast]: Matched pattern '' at line 13\n[sentinal-sast]: Matched pattern 'WORKDIR /app' at line 14\n[sentinal-sast]: Matched pattern '' at line 15\n[sentinal-sast]: Matched pattern 'COPY backend/requirements.txt ./' at line 16\n[sentinal-sast]: Matched pattern 'RUN pip install --no-cache-dir -r requirements.txt' at line 17\n[sentinal-sast]: Matched pattern '' at line 18\n[sentinal-sast]: Matched pattern 'COPY backend/ ./' at line 19\n[sentinal-sast]: Matched pattern '' at line 20\n[sentinal-sast]: Matched pattern '# Copy frontend build to backend for serving' at line 21\n[sentinal-sast]: Matched pattern 'COPY --from=frontend-builder /app/frontend/out ./frontend/out' at line 22\n[sentinal-sast]: Matched pattern '' at line 23\n[sentinal-sast]: Matched pattern 'ENV DATABASE_URL=postgresql://neondb_owner:npg_WzCOhSJ0dn6f@ep-nameless-bird-ay266zed.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require' at line 24\n[sentinal-sast]: Matched pattern 'ENV PORT=8000' at line 25\n[sentinal-sast]: Matched pattern '' at line 26\n[sentinal-sast]: Matched pattern 'EXPOSE 8000' at line 27\n[sentinal-sast]: Matched pattern '' at line 28\n[sentinal-sast]: Matched pattern 'CMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]' at line 29",
    "remediation": "Add `USER nonroot` or a dedicated unprivileged user before the ENTRYPOINT/CMD.",
    "references": [
      "https://cwe.mitre.org/data/definitions/250.html"
    ],
    "cwe": [
      "CWE-250"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 38.2,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094778"
  },
  {
    "id": "6291235b-26fe-4efd-93c0-282d59165a7a",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/aiohttp/client.py",
    "line": 869,
    "code_snippet": "868:             r_key = resp.headers.get(hdrs.SEC_WEBSOCKET_ACCEPT, \"\")\n869:             match = base64.b64encode(hashlib.sha1(sec_key + WS_KEY).digest()).decode()\n870:             if r_key != match:\n871:                 raise WSServerHandshakeError(",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 869",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094793"
  },
  {
    "id": "3dd69f58-a665-4aa7-931a-a6fb3831dacb",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/aiohttp/cookiejar.py",
    "line": 114,
    "code_snippet": "113:         with file_path.open(mode=\"rb\") as f:\n114:             self._cookies = pickle.load(f)\n115: \n116:     def clear(self, predicate: Optional[ClearCookiePredicate] = None) -> None:",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.load(' at line 114",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094802"
  },
  {
    "id": "72cb9148-9aeb-4146-8f6f-c326c167fa60",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/aiohttp/web_ws.py",
    "line": 212,
    "code_snippet": "211:         accept_val = base64.b64encode(\n212:             hashlib.sha1(key.encode() + WS_KEY).digest()\n213:         ).decode()\n214:         response_headers = CIMultiDict(",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 212",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094810"
  },
  {
    "id": "bb3db939-1a27-4b67-98ef-b14d622a1751",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/anyio/to_process.py",
    "line": 77,
    "code_snippet": "76: \n77:         retval = pickle.loads(pickled_response)\n78:         if status == b\"EXCEPTION\":\n79:             assert isinstance(retval, BaseException)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 77\n[sentinal-sast]: Matched pattern 'pickle.load(' at line 200",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094818"
  },
  {
    "id": "6631c067-5414-4e66-b847-5d6aa0a201e1",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/apscheduler/jobstores/mongodb.py",
    "line": 115,
    "code_snippet": "114:     def _reconstitute_job(self, job_state):\n115:         job_state = pickle.loads(job_state)\n116:         job = Job.__new__(Job)\n117:         job.__setstate__(job_state)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 115",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094825"
  },
  {
    "id": "990c077b-373d-424c-9e7f-36f9aed81ce2",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/apscheduler/jobstores/redis.py",
    "line": 123,
    "code_snippet": "122:     def _reconstitute_job(self, job_state):\n123:         job_state = pickle.loads(job_state)\n124:         job = Job.__new__(Job)\n125:         job.__setstate__(job_state)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 123",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094831"
  },
  {
    "id": "cf209824-961e-4891-94b7-16df9d4b9561",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/apscheduler/jobstores/rethinkdb.py",
    "line": 125,
    "code_snippet": "124:     def _reconstitute_job(self, job_state):\n125:         job_state = pickle.loads(job_state)\n126:         job = Job.__new__(Job)\n127:         job.__setstate__(job_state)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 125",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094836"
  },
  {
    "id": "f44cb337-7781-4ef3-b5f5-ddeaef47dbb3",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/apscheduler/jobstores/sqlalchemy.py",
    "line": 73,
    "code_snippet": "72:         with self.engine.begin() as connection:\n73:             job_state = connection.execute(selectable).scalar()\n74:             return self._reconstitute_job(job_state) if job_state else None\n75: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(selectable)' at line 73\n[sentinal-sast]: Matched pattern 'connection.execute(selectable)' at line 85\n[sentinal-sast]: Matched pattern 'connection.execute(insert)' at line 101\n[sentinal-sast]: Matched pattern 'connection.execute(update)' at line 111\n[sentinal-sast]: Matched pattern 'connection.execute(delete)' at line 118\n[sentinal-sast]: Matched pattern 'connection.execute(delete)' at line 125\n[sentinal-sast]: Matched pattern 'connection.execute(selectable)' at line 146\n[sentinal-sast]: Matched pattern 'connection.execute(delete)' at line 156",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094844"
  },
  {
    "id": "99507f3f-e055-43cf-bbbb-ea97c402786a",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/apscheduler/jobstores/sqlalchemy.py",
    "line": 131,
    "code_snippet": "130:     def _reconstitute_job(self, job_state):\n131:         job_state = pickle.loads(job_state)\n132:         job_state['jobstore'] = self\n133:         job = Job.__new__(Job)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 131",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094851"
  },
  {
    "id": "2c0a1951-e9ad-4172-81b6-3688f2f4e3e3",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/apscheduler/jobstores/zookeeper.py",
    "line": 70,
    "code_snippet": "69:             content, _ = self.client.get(node_path)\n70:             doc = pickle.loads(content)\n71:             job = self._reconstitute_job(doc['job_state'])\n72:             return job",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 70\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 155",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094858"
  },
  {
    "id": "e321c351-7a70-44a4-b851-97d3cf711b52",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/cryptography/x509/extensions.py",
    "line": 72,
    "code_snippet": "71: \n72:     return hashlib.sha1(data).digest()\n73: \n74: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 72",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094866"
  },
  {
    "id": "c85a1d1e-beee-4820-9a73-fd30bac44fc2",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/dns/dnssec.py",
    "line": 234,
    "code_snippet": "233:     if algorithm == DSDigest.SHA1:\n234:         dshash = hashlib.sha1()\n235:     elif algorithm == DSDigest.SHA256:\n236:         dshash = hashlib.sha256()",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 234\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 794\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 796",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094875"
  },
  {
    "id": "9b9937d1-cd56-432d-8209-47cf7fa8be7a",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/dns/entropy.py",
    "line": 37,
    "code_snippet": "36:         self.lock = threading.Lock()\n37:         self.hash = hashlib.sha1()\n38:         self.hash_len = 20\n39:         self.pool = bytearray(b\"\\0\" * self.hash_len)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 37",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094884"
  },
  {
    "id": "24506290-7fc4-465c-a022-07ad5df2cdf2",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_eddsa.py",
    "line": 374,
    "code_snippet": "373:     g = generator_ed25519\n374:     assert pickle.loads(pickle.dumps(g)) == g\n375: \n376: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 374",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094892"
  },
  {
    "id": "44e3559e-e4d2-46c7-b400-4f1415a1e939",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_jacobi.py",
    "line": 778,
    "code_snippet": "777:         pj = PointJacobi(curve=CurveFp(23, 1, 1, 1), x=2, y=3, z=1, order=1)\n778:         self.assertEqual(pickle.loads(pickle.dumps(pj)), pj)\n779: \n780:     @pytest.mark.slow",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 778",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094901"
  },
  {
    "id": "b7eeaff8-816a-4e8d-b852-d5c53dda5c11",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_keys.py",
    "line": 937,
    "code_snippet": "936: assert len(data) % 4 == 0\n937: sha1 = hashlib.sha1()\n938: sha1.update(data)\n939: data_hash = sha1.digest()",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 937",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094910"
  },
  {
    "id": "49cbbf38-26f6-40cd-a309-e1587f0be8b7",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_pyecdsa.py",
    "line": 2038,
    "code_snippet": "2037:             secexp=int(\"6FAB034934E4C0FC9AE67F5B5659A9D7D1FEFD187EE09FD4\", 16),\n2038:             hsh=hashlib.sha1(b\"sample\").digest(),\n2039:             hash_func=hashlib.sha1,\n2040:             expected=int(",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 2038\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 2071\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 2107",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094919"
  },
  {
    "id": "ed735ef5-59f8-4ed3-9d57-9bac32db156f",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/google/protobuf/proto_builder.py",
    "line": 68,
    "code_snippet": "67:   # proto files.\n68:   fields_hash = hashlib.sha1()\n69:   for f_name, f_type in field_items:\n70:     fields_hash.update(f_name.encode('utf-8'))",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 68",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094927"
  },
  {
    "id": "9a865773-7135-4845-9d48-59eeae606135",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/httpx/_auth.py",
    "line": 311,
    "code_snippet": "310: \n311:         return hashlib.sha1(s).hexdigest()[:16].encode()\n312: \n313:     def _get_header_value(self, header_fields: typing.Dict[str, bytes]) -> str:",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 311",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094936"
  },
  {
    "id": "ec93f058-af7f-43df-a36d-2b5efe5c8dbe",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/packaging/_structures.py",
    "line": 10,
    "code_snippet": "9: ``packaging._structures.NegativeInfinityType``.  This module provides minimal\n10: stand-in classes so that ``pickle.loads()`` can resolve those references.\n11: The deserialized objects are not used for comparisons \u2014 ``Version.__setstate__``\n12: discards the stale ``_key`` cache and recomputes it from the core version fields.",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 10",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094945"
  },
  {
    "id": "9cce7322-6fab-405a-9f11-0e08db3bbf10",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/passlib/handlers/digests.py",
    "line": 126,
    "code_snippet": "125:         data = render_bytes(\"%s:%s:%s\", user, realm, secret)\n126:         return hashlib.md5(data).hexdigest()\n127: \n128:     @classmethod",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.md5(' at line 126",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094954"
  },
  {
    "id": "a2596f62-941b-4e67-98f0-4fdc75379405",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/passlib/tests/test_context.py",
    "line": 1737,
    "code_snippet": "1736:             secret = secret.encode(\"utf-8\")\n1737:         return str_to_uascii(hashlib.sha1(b\"prefix\" + secret).hexdigest())\n1738: \n1739: #=============================================================================",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 1737",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094962"
  },
  {
    "id": "3b44aada-b0f4-4bf0-a564-1ec145b19f1d",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/passlib/tests/test_utils_handlers.py",
    "line": 121,
    "code_snippet": "120:                     raise ValueError(\"invalid hash\")\n121:                 return hashlib.sha1(b\"xyz\" + secret).hexdigest()\n122: \n123:             @classmethod",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 121\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 802\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 832",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094971"
  },
  {
    "id": "3f129b46-4ff5-4bef-8c3b-2d8b4457a372",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/passlib/tests/test_utils_pbkdf2.py",
    "line": 318,
    "code_snippet": "317:         def prf(key, msg):\n318:             return hashlib.md5(key+msg+b'fooey').digest()\n319:         self.assertRaises(NotImplementedError, pbkdf2, b'secret', b'salt', 1000, 20, prf)\n320: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.md5(' at line 318",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094980"
  },
  {
    "id": "fedc1c15-f609-4c40-a0d4-46fc8687d260",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/psycopg2/extras.py",
    "line": 907,
    "code_snippet": "906:         # get the oid for the hstore\n907:         curs.execute(f\"\"\"SELECT t.oid, {typarray}\n908: FROM pg_type t JOIN pg_namespace ns\n909:     ON typnamespace = ns.oid",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'execute(f\"\"\"SELECT t.oid, {' at line 907",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.094989"
  },
  {
    "id": "fef7c533-6036-4180-a477-e1e7953277f8",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/pydantic/deprecated/parse.py",
    "line": 54,
    "code_snippet": "53:         bb = b if isinstance(b, bytes) else b.encode()  # type: ignore\n54:         return pickle.loads(bb)\n55:     else:\n56:         raise TypeError(f'Unknown protocol: {proto}')",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 54",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095001"
  },
  {
    "id": "6e61fe5f-c0cc-483c-aaf4-e06089ec540f",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/pydantic/v1/parse.py",
    "line": 42,
    "code_snippet": "41:         bb = b if isinstance(b, bytes) else b.encode()\n42:         return pickle.loads(bb)\n43:     else:\n44:         raise TypeError(f'Unknown protocol: {proto}')",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 42",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095010"
  },
  {
    "id": "e0dc7f6a-db22-4036-9945-b2db381ad24c",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/pytz/__init__.py",
    "line": 293,
    "code_snippet": "292:     17\n293:     >>> new = pickle.loads(p)\n294:     >>> new == dt\n295:     True",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 293\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 496\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 498",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095018"
  },
  {
    "id": "170ad70f-0df7-43dd-8fa6-142662085d5c",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/commands/core.py",
    "line": 5099,
    "code_snippet": "5098:             script = encoder.encode(script)\n5099:         self.sha = hashlib.sha1(script).hexdigest()\n5100: \n5101:     def __call__(",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 5099\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 5148\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 5917",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095027"
  },
  {
    "id": "e26fa934-019c-4fa9-a3c0-60ece976224d",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/reportlab/lib/fontfinder.py",
    "line": 231,
    "code_snippet": "230:         f = open(fileName, 'rb')\n231:         finder2 = pickle.load(f)\n232:         f.close()\n233:         self.__dict__.update(finder2.__dict__)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.load(' at line 231",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095036"
  },
  {
    "id": "9424d891-9fb8-43cf-ab48-4ca064083eb6",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/reportlab/lib/utils.py",
    "line": 122,
    "code_snippet": "121: def decode_label(label):\n122:     return pickle.loads(base64_decodebytes(label.encode('latin1')))\n123: \n124: def rawUnicode(s):",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 122\n[sentinal-sast]: Matched pattern 'pickle.load(' at line 907",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095044"
  },
  {
    "id": "83ce10a6-7501-4f61-a795-39212f52cc2f",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/reportlab/pdfgen/canvas.py",
    "line": 1119,
    "code_snippet": "1118:         if isUnicode(command):\n1119:             rawName = 'PS' + hashlib.md5(command.encode('utf-8')).hexdigest()\n1120:         else:\n1121:             rawName = 'PS' + hashlib.md5(command).hexdigest()",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.md5(' at line 1119\n[sentinal-sast]: Matched pattern 'hashlib.md5(' at line 1121",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095053"
  },
  {
    "id": "0c9a5cc1-19ad-4c84-9f7b-bf7d0fa6e492",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/requests/auth.py",
    "line": 179,
    "code_snippet": "178:                     x = x.encode(\"utf-8\")\n179:                 return hashlib.md5(x, usedforsecurity=False).hexdigest()\n180: \n181:             hash_utf8 = md5_utf8",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.md5(' at line 179\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 187\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 237",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095061"
  },
  {
    "id": "3a162817-fc63-4616-bd45-d50c409c89dd",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mssql/base.py",
    "line": 3185,
    "code_snippet": "3184:         cursor = dbapi_connection.cursor()\n3185:         cursor.execute(f\"SET TRANSACTION ISOLATION LEVEL {level}\")\n3186:         cursor.close()\n3187:         if level == \"SNAPSHOT\":",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(f\"' at line 3185\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3321\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3334\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3343\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3360\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3377\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3408\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3998",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095070"
  },
  {
    "id": "43377cb7-2c4d-421d-aadb-46f8fb674155",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mysql/asyncmy.py",
    "line": 102,
    "code_snippet": "101:             if parameters is None:\n102:                 result = await self._cursor.execute(operation)\n103:             else:\n104:                 result = await self._cursor.execute(operation, parameters)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(operation)' at line 102",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095078"
  },
  {
    "id": "537ea0bb-0c36-4141-a286-09b2110a0a79",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mysql/base.py",
    "line": 2527,
    "code_snippet": "2526:         cursor = dbapi_connection.cursor()\n2527:         cursor.execute(f\"SET SESSION TRANSACTION ISOLATION LEVEL {level}\")\n2528:         cursor.execute(\"COMMIT\")\n2529:         cursor.close()",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(f\"' at line 2527",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095087"
  },
  {
    "id": "74c7bd5e-8ca2-4067-9fd7-114f6f19bc71",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mysql/mysqldb.py",
    "line": 165,
    "code_snippet": "164:                 cursor = conn.cursor()\n165:                 cursor.execute(\"SET NAMES %s\" % charset_name)\n166:                 cursor.close()\n167: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(\"SET NAMES %s' at line 165",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095095"
  },
  {
    "id": "74818263-2028-4dd8-a4ff-0a5bb0d0ab21",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/oracle/cx_oracle.py",
    "line": 1165,
    "code_snippet": "1164:             with dbapi_connection.cursor() as cursor:\n1165:                 cursor.execute(f\"ALTER SESSION SET ISOLATION_LEVEL={level}\")\n1166: \n1167:     def _detect_decimal_char(self, connection):",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(f\"' at line 1165",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095104"
  },
  {
    "id": "4fa3d670-fc19-45d1-823e-d86d8e083f6e",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/oracle/provision.py",
    "line": 203,
    "code_snippet": "202:     cursor = dbapi_connection.cursor()\n203:     cursor.execute(\"ALTER SESSION SET CURRENT_SCHEMA=%s\" % schema_name)\n204:     cursor.close()\n205: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(\"ALTER SESSION SET CURRENT_SCHEMA=%s' at line 203",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095112"
  },
  {
    "id": "f80ff7f4-e905-4c9e-97a3-85db6713687c",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/postgresql/base.py",
    "line": 325,
    "code_snippet": "324:         cursor = dbapi_connection.cursor()\n325:         cursor.execute(\"SET SESSION search_path='%s'\" % schema_name)\n326:         cursor.close()\n327:         dbapi_connection.autocommit = existing_autocommit",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(\"SET SESSION search_path='%s' at line 325",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095121"
  },
  {
    "id": "4ed6a96d-57a4-4c54-bc29-72256a705baf",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/postgresql/pg8000.py",
    "line": 362,
    "code_snippet": "361:     def fetchone(self):\n362:         self.cursor.execute(\"FETCH FORWARD 1 FROM \" + self.ident)\n363:         return self.cursor.fetchone()\n364: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(\"FETCH FORWARD 1 FROM \" +' at line 362\n[sentinal-sast]: Matched pattern 'cursor.execute(\"FETCH FORWARD ALL FROM \" +' at line 375\n[sentinal-sast]: Matched pattern 'cursor.execute(\"CLOSE \" +' at line 379",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095130"
  },
  {
    "id": "125ff574-2e8a-45e8-9416-e8e5bdec6e23",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/postgresql/provision.py",
    "line": 83,
    "code_snippet": "82:     cursor = dbapi_connection.cursor()\n83:     cursor.execute(\"SET SESSION search_path='%s'\" % schema_name)\n84:     cursor.close()\n85:     dbapi_connection.autocommit = existing_autocommit",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(\"SET SESSION search_path='%s' at line 83\n[sentinal-sast]: Matched pattern 'conn.execute(\"ROLLBACK PREPARED '%s' at line 94",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095137"
  },
  {
    "id": "f6dbc8eb-35a7-4e09-9eca-1cac5d38e902",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/postgresql/psycopg.py",
    "line": 495,
    "code_snippet": "494:                 self._do_autocommit(dbapi_conn, True)\n495:             dbapi_conn.execute(command)\n496:         finally:\n497:             if not before_autocommit:",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'conn.execute(command)' at line 495",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095144"
  },
  {
    "id": "6471a461-0d57-416a-b44c-ed86f5e421b5",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/sqlite/aiosqlite.py",
    "line": 126,
    "code_snippet": "125:             if parameters is None:\n126:                 self.await_(_cursor.execute(operation))\n127:             else:\n128:                 self.await_(_cursor.execute(operation, parameters))",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(operation)' at line 126",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095151"
  },
  {
    "id": "caa63f5c-53b4-41f7-86c7-cc1e97a882d5",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/sqlite/base.py",
    "line": 2052,
    "code_snippet": "2051:         cursor = dbapi_connection.cursor()\n2052:         cursor.execute(f\"PRAGMA read_uncommitted = {isolation_level}\")\n2053:         cursor.close()\n2054: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(f\"' at line 2052",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095157"
  },
  {
    "id": "e3968b60-a1c0-4f02-94de-edff1bc2735e",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/sqlite/pysqlcipher.py",
    "line": 137,
    "code_snippet": "136:             cursor = conn.cursor()\n137:             cursor.execute('pragma key=\"%s\"' % passphrase)\n138:             for prag in self.pragmas:\n139:                 value = url_query.get(prag, None)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute('pragma key=\"%s' at line 137\n[sentinal-sast]: Matched pattern 'cursor.execute('pragma %s' at line 141",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095164"
  },
  {
    "id": "f0a9d269-b834-4d2d-a2b5-0fedfd805290",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py",
    "line": 372,
    "code_snippet": "371:           list or dictionary is totally empty, will invoke the\n372:           statement on the cursor as ``cursor.execute(statement)``,\n373:           not passing the parameter collection at all.\n374:           Some DBAPIs such as psycopg2 and mysql-python consider",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(statement)' at line 372\n[sentinal-sast]: Matched pattern 'cursor.execute(\"use %s' at line 3091",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095171"
  },
  {
    "id": "912400b0-fab0-408b-864c-2cde7ecff487",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py",
    "line": 925,
    "code_snippet": "924:     def do_execute_no_params(self, cursor, statement, context=None):\n925:         cursor.execute(statement)\n926: \n927:     def is_disconnect(self, e, connection, cursor):",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(statement)' at line 925",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095179"
  },
  {
    "id": "fef9c69a-762e-4ff5-9a88-79a75e223b2f",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/engine/interfaces.py",
    "line": 2207,
    "code_snippet": "2206:     ) -> None:\n2207:         \"\"\"Provide an implementation of ``cursor.execute(statement)``.\n2208: \n2209:         The parameter collection should not be sent.",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(statement)' at line 2207",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095186"
  },
  {
    "id": "61cfc2ca-906a-447b-ae0a-75a3fac15c86",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/engine/result.py",
    "line": 1108,
    "code_snippet": "1107:             statement = select(table.c.x, table.c.y, table.c.z)\n1108:             result = connection.execute(statement)\n1109: \n1110:             for z, y in result.columns('z', 'y'):",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(statement)' at line 1108\n[sentinal-sast]: Matched pattern 'connection.execute(query)' at line 2156",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095192"
  },
  {
    "id": "6eb50e52-5f96-4cfd-b687-aa5f89079d57",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/ext/serializer.py",
    "line": 60,
    "code_snippet": "59:   (i.e. is not already declared in the application).   Regular\n60:   pickle.loads()/dumps() can be used to fully dump any ``MetaData`` object,\n61:   typically one which was reflected from an existing database at some previous\n62:   point in time.  The serializer module is specifically for the opposite case,",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 60\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 147\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 150\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 153\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 157",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095199"
  },
  {
    "id": "d7486dba-8821-4750-9f84-6c62086db7b7",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/ddl.py",
    "line": 353,
    "code_snippet": "352:       drop_spow = DDL('ALTER TABLE users SET secretpowers FALSE')\n353:       connection.execute(drop_spow)\n354: \n355:     When operating on Table events, the following ``statement``",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(drop_spow)' at line 353",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095206"
  },
  {
    "id": "5e13082b-fc02-4b95-bbf8-1abbe426b721",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/dml.py",
    "line": 528,
    "code_snippet": "527: \n528:             result = connection.execute(stmt)\n529: \n530:             server_created_at = result.returned_defaults['created_at']",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(stmt)' at line 528",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095213"
  },
  {
    "id": "7f1bcbda-2243-484f-85d7-82c9d2f9aca3",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/elements.py",
    "line": 2330,
    "code_snippet": "2329:         t = text(\"SELECT * FROM users\")\n2330:         result = connection.execute(t)\n2331: \n2332: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(t)' at line 2330\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 2581\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 2594",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095220"
  },
  {
    "id": "f050c632-8d98-411d-88b0-bacc0ff02273",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/lambdas.py",
    "line": 104,
    "code_snippet": "103: \n104:         result = connection.execute(stmt)\n105: \n106:     The object returned is an instance of :class:`_sql.StatementLambdaElement`.",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(stmt)' at line 104",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095227"
  },
  {
    "id": "dffe9f4e-46f1-4be2-a1d4-9716f076be36",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/selectable.py",
    "line": 2597,
    "code_snippet": "2596: \n2597:             result = conn.execute(statement).fetchall()\n2598: \n2599:         Example 2, WITH RECURSIVE::",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'conn.execute(statement)' at line 2597\n[sentinal-sast]: Matched pattern 'conn.execute(statement)' at line 2637\n[sentinal-sast]: Matched pattern 'connection.execute(upsert)' at line 2673",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095235"
  },
  {
    "id": "85589742-18b4-454a-9d8e-1ecdc9feff56",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/sqltypes.py",
    "line": 1787,
    "code_snippet": "1786:     PickleType builds upon the Binary type to apply Python's\n1787:     ``pickle.dumps()`` to incoming objects, and ``pickle.loads()`` on\n1788:     the way out, allowing any pickleable Python object to be stored as\n1789:     a serialized binary field.",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 1787",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095242"
  },
  {
    "id": "f6e14766-5a98-4e60-bf9e-dcd1b1c5f8a9",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/_elements_constructors.py",
    "line": 555,
    "code_snippet": "554:         stmt = select(users_table).where(users_table.c.name == 'Wendy')\n555:         result = connection.execute(stmt)\n556: \n557:     We would see SQL logging output as::",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(stmt)' at line 555\n[sentinal-sast]: Matched pattern 'connection.execute(t)' at line 1590\n[sentinal-sast]: Matched pattern 'connection.execute(t)' at line 1628",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095249"
  },
  {
    "id": "e6980e00-d0b5-484f-b59b-d736181cbea5",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/testing/suite/test_dialect.py",
    "line": 534,
    "code_snippet": "533: \n534:         row = connection.execute(stmt).first()\n535: \n536:     @testing.fixture",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(stmt)' at line 534",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095255"
  },
  {
    "id": "74ea32c4-9489-44cb-8f54-07c2b92ea4a4",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/testing/suite/test_results.py",
    "line": 110,
    "code_snippet": "109:         s2 = select(datetable.c.id, s.label(\"somelabel\"))\n110:         row = connection.execute(s2).first()\n111: \n112:         eq_(row.somelabel, datetime.datetime(2006, 5, 12, 12, 0, 0))",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(s2)' at line 110\n[sentinal-sast]: Matched pattern 'conn.execute(statement)' at line 334\n[sentinal-sast]: Matched pattern 'conn.execute(s2)' at line 388",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095261"
  },
  {
    "id": "d03f84c0-4a51-44ac-a10a-24c3ca74463a",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/testing/suite/test_rowcount.py",
    "line": 65,
    "code_snippet": "64:         ).order_by(employees_table.c.employee_id)\n65:         rows = connection.execute(s).fetchall()\n66: \n67:         eq_(rows, self.data)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(s)' at line 65\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 102\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 188",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095266"
  },
  {
    "id": "233e0803-55d8-42b2-9855-a1cb5add4f69",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/testing/suite/test_select.py",
    "line": 67,
    "code_snippet": "66:         with config.db.connect() as conn:\n67:             eq_(conn.execute(select).fetchall(), result)\n68: \n69:     @testing.requires.order_by_collation",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'conn.execute(select)' at line 67\n[sentinal-sast]: Matched pattern 'conn.execute(select)' at line 117\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 1474\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 1486",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095272"
  },
  {
    "id": "b8cbb7d3-d081-4206-9d18-d79a644bf7dd",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/testing/suite/test_types.py",
    "line": 84,
    "code_snippet": "83:                 )\n84:                 connection.execute(ins)\n85: \n86:             ins = t.insert().values(",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(ins)' at line 84\n[sentinal-sast]: Matched pattern 'connection.execute(ins)' at line 89\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 119\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 128",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095278"
  },
  {
    "id": "ba3aac30-ceb1-4793-9c25-8bd8451a7165",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/testing/suite/test_update_delete.py",
    "line": 111,
    "code_snippet": "110: \n111:         r = connection.execute(stmt)\n112:         assert not r.is_insert\n113:         assert r.returns_rows",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(stmt)' at line 111",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095284"
  },
  {
    "id": "bf6d7aa4-37c9-4554-8c11-cd2cb2fa33b0",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/util/compat.py",
    "line": 127,
    "code_snippet": "126:     def md5_not_for_security() -> Any:\n127:         return hashlib.md5(usedforsecurity=False)\n128: \n129: else:",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.md5(' at line 127\n[sentinal-sast]: Matched pattern 'hashlib.md5(' at line 132",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095290"
  },
  {
    "id": "95bb5adb-1ccf-4f75-ae77-31623f248779",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/starlette/_compat.py",
    "line": 16,
    "code_snippet": "15:     # that reject usedforsecurity=True\n16:     hashlib.md5(b\"data\", usedforsecurity=False)  # type: ignore[call-arg]\n17: \n18:     def md5_hexdigest(",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.md5(' at line 16\n[sentinal-sast]: Matched pattern 'hashlib.md5(' at line 21\n[sentinal-sast]: Matched pattern 'hashlib.md5(' at line 28",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095295"
  },
  {
    "id": "145a2729-6428-48a7-8a88-42c2eb5d1957",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/websockets/utils.py",
    "line": 32,
    "code_snippet": "31:     \"\"\"\n32:     sha1 = hashlib.sha1((key + GUID).encode()).digest()\n33:     return base64.b64encode(sha1).decode()\n34: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 32",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095301"
  },
  {
    "id": "f62dcac9-72fe-492d-bc76-7149f0eda009",
    "title": "Dockerfile Container Running as Root",
    "description": "Containers running as root increase the impact of container escape vulnerabilities.",
    "severity": "MEDIUM",
    "confidence": "MEDIUM",
    "category": "Container Security",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/frontend/Dockerfile",
    "line": 1,
    "code_snippet": "1: FROM node:20-alpine AS base\n2: \n3: # Install dependencies only when needed",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'FROM node:20-alpine AS base' at line 1\n[sentinal-sast]: Matched pattern '' at line 2\n[sentinal-sast]: Matched pattern '# Install dependencies only when needed' at line 3\n[sentinal-sast]: Matched pattern 'FROM base AS deps' at line 4\n[sentinal-sast]: Matched pattern 'RUN apk add --no-cache libc6-compat' at line 5\n[sentinal-sast]: Matched pattern 'WORKDIR /app' at line 6\n[sentinal-sast]: Matched pattern '' at line 7\n[sentinal-sast]: Matched pattern 'COPY package.json package-lock.json* ./' at line 8\n[sentinal-sast]: Matched pattern 'COPY npmrc* ./' at line 9\n[sentinal-sast]: Matched pattern 'RUN npm ci' at line 10\n[sentinal-sast]: Matched pattern '' at line 11\n[sentinal-sast]: Matched pattern '# Rebuild the source code only when needed' at line 12\n[sentinal-sast]: Matched pattern 'FROM base AS builder' at line 13\n[sentinal-sast]: Matched pattern 'WORKDIR /app' at line 14\n[sentinal-sast]: Matched pattern 'COPY --from=deps /app/node_modules ./node_modules' at line 15\n[sentinal-sast]: Matched pattern 'COPY . .' at line 16\n[sentinal-sast]: Matched pattern '' at line 17\n[sentinal-sast]: Matched pattern 'ENV NEXT_TELEMETRY_DISABLED 1' at line 18\n[sentinal-sast]: Matched pattern '' at line 19\n[sentinal-sast]: Matched pattern 'RUN npm run build' at line 20\n[sentinal-sast]: Matched pattern '' at line 21\n[sentinal-sast]: Matched pattern '# Production image, copy all the files and run next' at line 22\n[sentinal-sast]: Matched pattern 'FROM base AS runner' at line 23\n[sentinal-sast]: Matched pattern 'WORKDIR /app' at line 24\n[sentinal-sast]: Matched pattern '' at line 25\n[sentinal-sast]: Matched pattern 'ENV NODE_ENV production' at line 26\n[sentinal-sast]: Matched pattern 'ENV NEXT_TELEMETRY_DISABLED 1' at line 27\n[sentinal-sast]: Matched pattern '' at line 28\n[sentinal-sast]: Matched pattern 'RUN addgroup --system --gid 1001 nodejs' at line 29\n[sentinal-sast]: Matched pattern 'RUN adduser --system --uid 1001 nextjs' at line 30\n[sentinal-sast]: Matched pattern '' at line 31\n[sentinal-sast]: Matched pattern 'COPY --from=builder /app/public ./public' at line 32\n[sentinal-sast]: Matched pattern '' at line 33\n[sentinal-sast]: Matched pattern '# Set the correct permission for prerender cache' at line 34\n[sentinal-sast]: Matched pattern 'RUN mkdir .next' at line 35\n[sentinal-sast]: Matched pattern 'RUN chown nextjs:nodejs .next' at line 36\n[sentinal-sast]: Matched pattern '' at line 37\n[sentinal-sast]: Matched pattern 'COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./' at line 38\n[sentinal-sast]: Matched pattern 'COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static' at line 39\n[sentinal-sast]: Matched pattern '' at line 40\n[sentinal-sast]: Matched pattern '' at line 42\n[sentinal-sast]: Matched pattern 'EXPOSE 3000' at line 43\n[sentinal-sast]: Matched pattern '' at line 44\n[sentinal-sast]: Matched pattern 'ENV PORT 3000' at line 45\n[sentinal-sast]: Matched pattern 'ENV HOSTNAME \"0.0.0.0\"' at line 46\n[sentinal-sast]: Matched pattern '' at line 47\n[sentinal-sast]: Matched pattern 'CMD [\"node\", \"server.js\"]' at line 48",
    "remediation": "Add `USER nonroot` or a dedicated unprivileged user before the ENTRYPOINT/CMD.",
    "references": [
      "https://cwe.mitre.org/data/definitions/250.html"
    ],
    "cwe": [
      "CWE-250"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 38.2,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095306"
  },
  {
    "id": "1e912c98-8763-47c3-bdaa-89434fc46c1d",
    "title": "Cross-Site Scripting (XSS) via innerHTML / dangerouslySetInnerHTML",
    "description": "Directly assigning unsanitized dynamic user input to innerHTML creates Document Object Model (DOM) Cross-Site Scripting vulnerabilities.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Cross-Site Scripting",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/frontend/public/domain-analysis/app.js",
    "line": 245,
    "code_snippet": "244:         document.documentElement.setAttribute('data-theme', theme);\n245:         elements.themeToggle.innerHTML = theme === 'dark' \n246:             ? '<i class=\"fa-solid fa-sun\"></i>' \n247:             : '<i class=\"fa-solid fa-moon\"></i>';",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern '.innerHTML = ' at line 245\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 479\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 480\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 484\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 526\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 527\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 598\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 602\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 641\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 648\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 659\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 716\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 731\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 735\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 755",
    "remediation": "Use `textContent` or sanitize user input using DOMPurify before inserting into the DOM.",
    "references": [
      "https://cwe.mitre.org/data/definitions/79.html"
    ],
    "cwe": [
      "CWE-79"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 80.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095313"
  },
  {
    "id": "117ebedf-456f-4660-94e0-ce922a68baa8",
    "title": "Vulnerable Dependency: fastapi (0.104.1) - PYSEC-2024-38",
    "description": "Vulnerability in python-multipart",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Vulnerable Dependency",
    "source": "SCA",
    "scanner": "osv-scanner",
    "file": "rutu4669-hue-vajra-c6d6652/backend/requirements.txt",
    "line": null,
    "code_snippet": null,
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Package 'fastapi' version '0.104.1' detected in rutu4669-hue-vajra-c6d6652/backend/requirements.txt. Upgrade to latest version.\n[osv-scanner]: Package 'uvicorn' version 'latest' detected in rutu4669-hue-vajra-c6d6652/backend/requirements.txt. Upgrade to latest version.\n[osv-scanner]: Package 'python-jose' version 'latest' detected in rutu4669-hue-vajra-c6d6652/backend/requirements.txt. Upgrade to latest version.\n[osv-scanner]: Package 'python-multipart' version '0.0.6' detected in rutu4669-hue-vajra-c6d6652/backend/requirements.txt. Upgrade to latest version.\n[osv-scanner]: Package 'aiohttp' version '3.9.1' detected in rutu4669-hue-vajra-c6d6652/backend/requirements.txt. Upgrade to latest version.\n[osv-scanner]: Package 'python-dotenv' version '1.0.0' detected in rutu4669-hue-vajra-c6d6652/backend/requirements.txt. Upgrade to latest version.",
    "remediation": "Upgrade python-multipart to a secure version. Upgrade to latest version.",
    "references": [],
    "cwe": [
      "CWE-1395"
    ],
    "cves": [],
    "owasp": [
      "A06:2021-Vulnerable and Outdated Components"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095319"
  },
  {
    "id": "b5c15dd1-4803-454f-98fe-4b643ec5cc1c",
    "title": "Vulnerable Dependency: brace-expansion (5.0.7) - GHSA-mh99-v99m-4gvg",
    "description": "Vulnerability in brace-expansion",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Vulnerable Dependency",
    "source": "SCA",
    "scanner": "osv-scanner",
    "file": "rutu4669-hue-vajra-c6d6652/frontend/package-lock.json",
    "line": null,
    "code_snippet": null,
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Package 'brace-expansion' version '5.0.7' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'brace-expansion' version '1.1.16' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'browserslist' version '4.28.6' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'd3-color' version '2.0.0' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'dompurify' version '2.5.9' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'js-yaml' version '4.3.0' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'jspdf' version '2.5.2' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'nanoid' version '3.3.16' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'next' version '15.5.20' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'postcss' version '8.4.31' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'postcss' version '8.5.18' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'sharp' version '0.34.5' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.",
    "remediation": "Upgrade brace-expansion to a secure version. Upgrade to latest version.",
    "references": [],
    "cwe": [
      "CWE-1395"
    ],
    "cves": [],
    "owasp": [
      "A06:2021-Vulnerable and Outdated Components"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095326"
  },
  {
    "id": "8dc781e1-23a7-405f-8cc2-64d30f5301ca",
    "title": "Vulnerable Dependency: axios (1.6.0) - GHSA-35jp-ww65-95wh",
    "description": "Vulnerability in postcss",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Vulnerable Dependency",
    "source": "SCA",
    "scanner": "osv-scanner",
    "file": "rutu4669-hue-vajra-c6d6652/frontend/package.json",
    "line": null,
    "code_snippet": null,
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Package 'axios' version '1.6.0' detected in rutu4669-hue-vajra-c6d6652/frontend/package.json. Upgrade to latest version.\n[osv-scanner]: Package 'jspdf' version '2.5.1' detected in rutu4669-hue-vajra-c6d6652/frontend/package.json. Upgrade to latest version.\n[osv-scanner]: Package 'next' version '15.0.0' detected in rutu4669-hue-vajra-c6d6652/frontend/package.json. Upgrade to latest version.\n[osv-scanner]: Package 'postcss' version '8.4.0' detected in rutu4669-hue-vajra-c6d6652/frontend/package.json. Upgrade to latest version.\n[osv-scanner]: Package 'zod' version '3.22.0' detected in rutu4669-hue-vajra-c6d6652/frontend/package.json. Upgrade to latest version.",
    "remediation": "Upgrade postcss to a secure version. Upgrade to latest version.",
    "references": [],
    "cwe": [
      "CWE-1395"
    ],
    "cves": [],
    "owasp": [
      "A06:2021-Vulnerable and Outdated Components"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095333"
  },
  {
    "id": "f372a4ac-f968-4bae-949e-64ddd059263e",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/docker-compose.yml",
    "line": 48,
    "code_snippet": "47:     environment:\n48:       DATABASE_URL: postgresql://${POSTGRES_USER:-ai_*****************************************************ord}@postgres:5432/${POSTGRES_DB:-ai_security_platform}\n49:       REDIS_URL: redis://redis:6379/0\n50:       SECRET_KEY: ${SECRET_KEY:-your-super-secret-jwt-key-change-this-in-production}",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '-ai_*****************************************************ord}'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095340"
  },
  {
    "id": "0216a59c-0239-4d27-b431-cd11d902303d",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/Dockerfile",
    "line": 24,
    "code_snippet": "23: \n24: ENV DATABASE_URL=postgresql://neondb_owner:npg_********dn6f@ep-nameless-bird-ay266zed.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require\n25: ENV PORT=8000\n26: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'npg_********dn6f'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095346"
  },
  {
    "id": "3356c113-29a3-42fa-b807-01b1a871184b",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/README.md",
    "line": 212,
    "code_snippet": "211: ```\n212: DATABASE_URL=postgresql://user:********@localhost:5432/ai_security_platform\n213: REDIS_URL=redis://localhost:6379/0\n214: SECRET_KEY=your-super-secret-jwt-key",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '********'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095353"
  },
  {
    "id": "4052f031-d2a7-4296-95a6-4190af660155",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/render.yaml",
    "line": 12,
    "code_snippet": "11:       - key: DATABASE_URL\n12:         value: postgresql://neondb_owner:npg_********dn6f@ep-nameless-bird-ay266zed-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require\n13:       - key: SECRET_KEY\n14:         value: qHpvQjjfYQ0jrsiwvNQ0vzAw9OGKM36ucCzZadzMED4",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'npg_********dn6f'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095360"
  },
  {
    "id": "6705bf72-f778-4f14-968c-6a19e7026380",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/vajra-cdc56-firebase-adminsdk-fbsvc-b200c1088e.json",
    "line": 5,
    "code_snippet": "4:   \"private_key_id\": \"b200c1088e307852c5fd74284e0035b5c040a208\",\n5:   \"private_key\": \"----*******************----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2KtvcIg/MWQYu\\nsM0X3yG8s4eJ8FJFmQg4l1BpOsduQsJBrwrv++2X9Ei6ZkZvezUt64QnOHy4ZtqA\\nAbDE4LxGWPz8uL/9GkRHiYGZPBviVLgmFciyRE/dUEbItaYhIUKSmhx3/cu2QQu/\\nGdTGNHiR0GlLdBZmYzSBB+UQA/nxVg38R8xoJK7+FfzNxkANHYK9S+cPky4eryPm\\nxdsBpfjdRfdqsfjU9B5O97rrhwrg7JN6Pkc5VftFzr93ozWB4Cyi7tdb0Ei9LmTH\\nRkUiXKUtEUNqYLuU3Chg9W3xnKTYiB28MKrEnv0PqErQ+RE08NnFvNI0PMhVDWwr\\nCmEygScjAgMBAAECggEAO51E/AItl1se2dLEG2bK/Jzn4y1BT0NoXFSwXO9+akfw\\nmFw3QRf5xfuMfWuQ61Svr4peYhNrRVFree6Tsao2EvN2PyIaujKJW7vVLJduLKA6\\n70O7vRL769okf/RqHHds+Nr0LBRjQQ6CUJScfAyZ1GYWvzmLRxB6EyvJO3eBqQdJ\\n+nx00ekxMTTkbqimgYO6yxXdX+MBCndhqtzIFC2Y1opTBCLv4W6lNRdMXUvOkZLr\\nb5ZeT46T6L8NKfMxa60xJvx94nTzqU5i0JLPLmmDZ6E+7YJG+hGRvM4tbVZZBXus\\n5ykXlEDhiqsiktzXPOzRpVoP+j2TTKycAUzZ30sN8QKBgQDfTZLUzOhhPH7rjNCE\\n6gpPaX0cYO0lgXk4ZhCjbAm83P5IqrrU/hUFE+kwUc943oAK/S73BlzjLXBlWnWV\\nldB5AnFii6u20dgLrtgJOexi7VlUb2XgAvB933veBXO+7k63OkFCfQ88WYWjyDNR\\naXrRNpAWxpYTeFuCM0D7I2yrawKBgQDQ11VOJBMGxAMeuS6td8XcYoR7bW98M1qD\\n7X2qcupAISOUjk9+N6VCUaV4xbZtEt3SSQT6QgayMLUVPa1Blx1Vx+Jqegwrq0Ma\\n6EKAgPo4zjUdp5b64xHUOx9qbJMCKJJYiz7iDPLEhklDi10aAD4/cNkKxyTL0yKP\\nw/8TGWTZKQKBgQC2GGlLVUmOual6ZltIeB4uQgS/Vp8sfZefkUOyMJEETWajVW6D\\n8Cqt+F2phJ1eoHrj+zEISk0HCO/mBs1qTUAy3fYeeW1u6VJ3vH35kB2fUpQNEcaO\\n1XbN/qfhFqsboPPZ4QyErrz05r/fHowSsKRx5T+9AvYxLG3bD/bGlU2xvwKBgErc\\n9ip1yhBB0bCAx5fNeLMg6cbpGu7V5dunFcY1PX3Ro1SMkzh2sBoO9JdPoK6G9dd8\\n73jalFXqGe/MVUBO8GggqCxtJdG9qeeKXNR957TXTrkbq4ayQWDn9MIMu8IpUxTE\\njb0w0RHb5YV9/tjkP2w0gslXS/x46knJA7YQA1PJAoGBAIe66MFkgCtvTXued2aW\\nplmgUND76ITS0e1GS7Vgn7eeR+ZMPIwpPsk+agfApH40HO4xfaRwG3A1tPqAE2NM\\niObrAtbdBoV6T0rexDQ78R+rruVBWgkOpDpPZIvaH8vm4/TIPrWypWe2upGok1M+\\nnOG1RKunlA2qJVAU26se8vsn\\n-----END PRIVATE KEY-----\\n\",\n6:   \"client_email\": \"firebase-adminsdk-fbsvc@vajra-cdc56.iam.gserviceaccount.com\",\n7:   \"client_id\": \"117365507564368341028\",",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----*******************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095367"
  },
  {
    "id": "4330670b-cd70-42d7-84bc-64b339d27b1e",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/.env.example",
    "line": 2,
    "code_snippet": "1: # Database\n2: DATABASE_URL=postgresql://user:********@localhost:5432/ai_security_platform\n3: POSTGRES_USER=ai_security_user\n4: POSTGRES_PASSWORD=your_secure_********",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '********'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095383"
  },
  {
    "id": "6b58e527-e8da-4092-9d90-8e68cb0b39b2",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/create_admin.py",
    "line": 9,
    "code_snippet": "8: # Set the DATABASE_URL to Neon before importing database\n9: os.environ[\"DATABASE_URL\"] = \"postgresql://neondb_owner:npg_********dn6f@ep-nameless-bird-ay266zed-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require\"\n10: \n11: from database.database import SessionLocal, engine, Base",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'npg_********dn6f'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095391"
  },
  {
    "id": "c8eebe15-427b-436d-9ba4-2a57f3fb6ec5",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/render.yaml",
    "line": 9,
    "code_snippet": "8:       - key: DATABASE_URL\n9:         value: postgresql://neondb_owner:npg_********dn6f@ep-nameless-bird-ay266zed-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require\n10:       - key: SECRET_KEY\n11:         value: qHpvQjjfYQ0jrsiwvNQ0vzAw9OGKM36ucCzZadzMED4",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'npg_********dn6f'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095399"
  },
  {
    "id": "203a1655-4c93-4be0-bae4-c764f129c99d",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/reset_admin_password.py",
    "line": 9,
    "code_snippet": "8: if not os.getenv(\"DATABASE_URL\"):\n9:     os.environ[\"DATABASE_URL\"] = \"postgresql://neondb_owner:npg_********dn6f@ep-nameless-bird-ay266zed-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require\"\n10: \n11: from database.database import SessionLocal, engine, Base",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'npg_********dn6f'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095406"
  },
  {
    "id": "6805f18b-1d39-43e1-968a-2d4b21fb5413",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/database/database.py",
    "line": 10,
    "code_snippet": "9: BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))\n10: DEFAULT_NEON_DB = \"postgresql://neondb_owner:npg_********dn6f@ep-nameless-bird-ay266zed-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require\"\n11: raw_db_url = os.getenv(\"DATABASE_URL\") or DEFAULT_NEON_DB\n12: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'npg_********dn6f'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095413"
  },
  {
    "id": "fbeff6ff-e7f5-4e7c-a5e5-c184c26a26ac",
    "title": "Exposed Secret: JSON Web Token (JWT)",
    "description": "Hardcoded secret token or credential (JSON Web Token (JWT)) found in source code repository.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Authentication Token",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/services/cloudsec_service.py",
    "line": 10,
    "code_snippet": "9:     def __init__(self):\n10:         self.token = os.getenv(\"CLOUDSEC_TOKEN\", \"eyJh*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************ZPBs\")\n11:         # Updated base URL based on the token structure\n12:         self.base_url = \"https://integrations.pollinations.ai\"",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for JSON Web Token (JWT) matching 'eyJh*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************ZPBs'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095419"
  },
  {
    "id": "68accac7-5d74-4273-8f32-1426d5166c8f",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/cryptography/hazmat/primitives/serialization/ssh.py",
    "line": 78,
    "code_snippet": "77: _SK_MAGIC = b\"openssh-key-v1\\0\"\n78: _SK_START = b\"----***************************----\"\n79: _SK_END = b\"-----END OPENSSH PRIVATE KEY-----\"\n80: _BCRYPT = b\"bcrypt\"",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***************************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095426"
  },
  {
    "id": "89dd78a2-3f12-4dde-8f83-aefc17c64814",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/keys.py",
    "line": 972,
    "code_snippet": "971:         # have the \"EC PARAMETERS\" section; it's just \"PRIVATE KEY\".\n972:         private_key_index = string.find(b\"----**********************----\")\n973:         if private_key_index == -1:\n974:             private_key_index = string.index(b\"-----BEGIN PRIVATE KEY-----\")",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----**********************----'\n[gitleaks]: Detected pattern for Private Cryptographic Key matching '----*******************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095433"
  },
  {
    "id": "e50d70e3-922c-49b5-8c66-87d70ec3b21f",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_ecdh.py",
    "line": 305,
    "code_snippet": "304: pem_local_private_key = (\n305:     \"----**********************----\\n\"\n306:     \"MF8CAQEEGF7IQgvW75JSqULpiQQ8op9WH6Uldw6xxaAKBggqhkjOPQMBAaE0AzIA\\n\"\n307:     \"BLiBd9CE7xf15FY5QIAoNg+fWbSk1yZOYtoGUdzkejWkxbRc9RWTQjqLVXucIJnz\\n\"",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----**********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095440"
  },
  {
    "id": "a4b72f00-866e-4264-869e-abacb41b8635",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_keys.py",
    "line": 144,
    "code_snippet": "143:         prv_key_str = (\n144:             \"----**********************----\\n\"\n145:             \"MF8CAQEEGF7IQgvW75JSqULpiQQ8op9WH6Uldw6xxaAKBggqhkjOPQMBAaE0AzIA\\n\"\n146:             \"BLiBd9CE7xf15FY5QIAoNg+fWbSk1yZOYtoGUdzkejWkxbRc9RWTQjqLVXucIJnz\\n\"",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----**********************----'\n[gitleaks]: Detected pattern for Private Cryptographic Key matching '----*******************----'\n[gitleaks]: Detected pattern for Private Cryptographic Key matching '----***************************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095447"
  },
  {
    "id": "2cf8e012-f92c-4761-b56e-29251431bdbc",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_pyecdsa.py",
    "line": 245,
    "code_snippet": "244:         self.assertEqual(type(s1), binary_type)\n245:         self.assertTrue(s1.startswith(b\"----**********************----\"))\n246:         self.assertTrue(s1.strip().endswith(b\"-----END EC PRIVATE KEY-----\"))\n247:         priv2 = SigningKey.from_pem(s1)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----**********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095454"
  },
  {
    "id": "e14b4f88-159c-44fe-935d-e623b1561b75",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa-0.19.2.dist-info/METADATA",
    "line": 371,
    "code_snippet": "370: formats that OpenSSL uses. The PEM file looks like the familiar ASCII-armored\n371: `\"----**********************----\"` base64-encoded format, and the DER format\n372: is a shorter binary form of the same data.\n373: `SigningKey.from_pem()/.from_der()` will undo this serialization. These",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----**********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095463"
  },
  {
    "id": "1bea7f67-0b60-427b-ac3a-b1e613e8e33b",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/google/auth/crypt/_python_rsa.py",
    "line": 39,
    "code_snippet": "38: _CERTIFICATE_MARKER = b\"-----BEGIN CERTIFICATE-----\"\n39: _PKCS1_MARKER = (\"----***********************----\", \"-----END RSA PRIVATE KEY-----\")\n40: _PKCS8_MARKER = (\"-----BEGIN PRIVATE KEY-----\", \"-----END PRIVATE KEY-----\")\n41: _PKCS8_SPEC = PrivateKeyInfo()",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***********************----'\n[gitleaks]: Detected pattern for Private Cryptographic Key matching '----*******************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095469"
  },
  {
    "id": "82f5ca60-6c1b-4caf-8ebb-4e81de9cc66a",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/google/auth/transport/_mtls_helper.py",
    "line": 42,
    "code_snippet": "41: # support various format of key files, e.g.\n42: # \"----*******************----...\",\n43: # \"-----BEGIN EC PRIVATE KEY-----...\",\n44: # \"-----BEGIN RSA PRIVATE KEY-----...\"",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----*******************----'\n[gitleaks]: Detected pattern for Private Cryptographic Key matching '----**********************----'\n[gitleaks]: Detected pattern for Private Cryptographic Key matching '----***********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095476"
  },
  {
    "id": "5f89e91f-3275-47a0-8271-8094be738f9d",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/google/oauth2/gdch_credentials.py",
    "line": 50,
    "code_snippet": "49:             \"private_key_id\": \"<key id>\",\n50:             \"private_key\": \"----**********************----\\n<key bytes>\\n-----END EC PRIVATE KEY-----\\n\",\n51:             \"name\": \"<service identity name>\",\n52:             \"ca_cert_path\": \"<CA cert path>\",",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----**********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095483"
  },
  {
    "id": "67af1ef2-7015-441a-a284-a1153832858c",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/googleapiclient/discovery_cache/documents/appengine.v1.json",
    "line": 3140,
    "code_snippet": "3139: \"privateKey\": {\n3140: \"description\": \"Unencrypted PEM encoded RSA private key. This field is set once on certificate creation and then encrypted. The key size must be 2048 bits or fewer. Must include the header and footer. Example: ----***********************---- -----END RSA PRIVATE KEY----- @InputOnly\",\n3141: \"type\": \"string\"\n3142: },",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095490"
  },
  {
    "id": "886cd623-d4fc-41fa-8dee-55f5e6de2620",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/googleapiclient/discovery_cache/documents/appengine.v1alpha.json",
    "line": 1584,
    "code_snippet": "1583: \"privateKey\": {\n1584: \"description\": \"Unencrypted PEM encoded RSA private key. This field is set once on certificate creation and then encrypted. The key size must be 2048 bits or fewer. Must include the header and footer. Example: ----***********************---- -----END RSA PRIVATE KEY----- @InputOnly\",\n1585: \"type\": \"string\"\n1586: },",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095496"
  },
  {
    "id": "0d0168fb-9d8f-4d33-8eb4-ba53249e9b3f",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/googleapiclient/discovery_cache/documents/appengine.v1beta.json",
    "line": 3369,
    "code_snippet": "3368: \"privateKey\": {\n3369: \"description\": \"Unencrypted PEM encoded RSA private key. This field is set once on certificate creation and then encrypted. The key size must be 2048 bits or fewer. Must include the header and footer. Example: ----***********************---- -----END RSA PRIVATE KEY----- @InputOnly\",\n3370: \"type\": \"string\"\n3371: },",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095503"
  },
  {
    "id": "94413e66-d89f-4765-acc8-43a9bd98be3c",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/limits/aio/storage/mongodb.py",
    "line": 54,
    "code_snippet": "53:         \"\"\"\n54:         :param uri: uri of the form ``async+mongodb://[user:pass*ord]@host:port?...``,\n55:          This uri is passed directly to :class:`~motor.motor_asyncio.AsyncIOMotorClient`\n56:         :param database_name: The database to use for storing the rate limit",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'pass*ord]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095510"
  },
  {
    "id": "3ecf7e75-993c-4dca-8436-efbae7f64602",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/limits/aio/storage/redis/__init__.py",
    "line": 73,
    "code_snippet": "72: \n73:          - ``async+redis://[:pass*ord]@host:port``\n74:          - ``async+redis://[:pass*ord]@host:port/db``\n75:          - ``async+rediss://[:pass*ord]@host:port``",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'pass*ord]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095517"
  },
  {
    "id": "695c2f6c-b3e1-442f-b6c7-7a723bca640a",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/limits/storage/mongodb.py",
    "line": 41,
    "code_snippet": "40:         \"\"\"\n41:         :param uri: uri of the form ``mongodb://[user:pass*ord]@host:port?...``,\n42:          This uri is passed directly to :class:`~pymongo.mongo_client.MongoClient`\n43:         :param database_name: The database to use for storing the rate limit",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'pass*ord]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095523"
  },
  {
    "id": "017ea898-b0f8-420b-b548-10c9cc153490",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/limits/storage/redis.py",
    "line": 76,
    "code_snippet": "75:         \"\"\"\n76:         :param uri: uri of the form ``redis://[:pass*ord]@host:port``,\n77:          ``redis://[:pass*ord]@host:port/db``,\n78:          ``rediss://[:pass*ord]@host:port``, ``redis+unix:///path/to/sock`` etc.",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'pass*ord]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095531"
  },
  {
    "id": "14e93b40-662f-463f-a6df-ae23abc8305b",
    "title": "Exposed Secret: JSON Web Token (JWT)",
    "description": "Hardcoded secret token or credential (JSON Web Token (JWT)) found in source code repository.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Authentication Token",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/python_jose-3.3.0.dist-info/METADATA",
    "line": 116,
    "code_snippet": "115:     >>> token = jwt.encode({'key': 'value'}, 'secret', algorithm='HS256')\n116:     u'eyJh*********************************************************************************************jmWg'\n117: \n118:     >>> jwt.decode(token, 'secret', algorithms=['HS256'])",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for JSON Web Token (JWT) matching 'eyJh*********************************************************************************************jmWg'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095537"
  },
  {
    "id": "f798fd32-8b8d-4059-9302-51f992c280b2",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/client.py",
    "line": 103,
    "code_snippet": "102: \n103:             redis://[[username]:[pas***rd]]@localhost:6379/0\n104:             rediss://[[username]:[pas***rd]]@localhost:6379/0\n105:             unix://[username@]/path/to/socket.sock?db=0[&password=password]",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '[pas***rd]]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095544"
  },
  {
    "id": "5aa2eb1d-e09d-4716-9541-5231c7ae9534",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/cluster.py",
    "line": 453,
    "code_snippet": "452: \n453:             redis://[[username]:[pas***rd]]@localhost:6379/0\n454:             rediss://[[username]:[pas***rd]]@localhost:6379/0\n455:             unix://[username@]/path/to/socket.sock?db=0[&password=password]",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '[pas***rd]]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095551"
  },
  {
    "id": "50960e76-233e-4643-b7d2-4f16b6c7df0a",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/connection.py",
    "line": 937,
    "code_snippet": "936: \n937:             redis://[[username]:[pas***rd]]@localhost:6379/0\n938:             rediss://[[username]:[pas***rd]]@localhost:6379/0\n939:             unix://[username@]/path/to/socket.sock?db=0[&password=password]",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '[pas***rd]]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095558"
  },
  {
    "id": "f9ee999f-4f22-411a-a91e-966c39b8e652",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/asyncio/client.py",
    "line": 125,
    "code_snippet": "124: \n125:             redis://[[username]:[pas***rd]]@localhost:6379/0\n126:             rediss://[[username]:[pas***rd]]@localhost:6379/0\n127:             unix://[username@]/path/to/socket.sock?db=0[&password=password]",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '[pas***rd]]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095566"
  },
  {
    "id": "b46dc383-adf6-4090-abe9-4498aa115166",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/asyncio/cluster.py",
    "line": 183,
    "code_snippet": "182: \n183:             redis://[[username]:[pas***rd]]@localhost:6379/0\n184:             rediss://[[username]:[pas***rd]]@localhost:6379/0\n185: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '[pas***rd]]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095572"
  },
  {
    "id": "a924e1db-a3f8-45a1-b299-8ffe59ce24c0",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/asyncio/connection.py",
    "line": 954,
    "code_snippet": "953: \n954:             redis://[[username]:[pas***rd]]@localhost:6379/0\n955:             rediss://[[username]:[pas***rd]]@localhost:6379/0\n956:             unix://[username@]/path/to/socket.sock?db=0[&password=password]",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '[pas***rd]]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095578"
  },
  {
    "id": "6d2431c4-8ec6-48e8-89d4-2edf72dc1355",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/rsa/key.py",
    "line": 603,
    "code_snippet": "602: \n603:         The contents of the file before the \"----***********************----\" and\n604:         after the \"-----END RSA PRIVATE KEY-----\" lines is ignored.\n605: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095584"
  },
  {
    "id": "a0857e6c-4bbd-40b2-b19e-a75a52861866",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/rsa/pem.py",
    "line": 88,
    "code_snippet": "87:     :param pem_marker: the marker of the PEM content, such as 'RSA PRIVATE KEY'\n88:         when your file has '----***********************----' and\n89:         '-----END RSA PRIVATE KEY-----' markers.\n90: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095589"
  },
  {
    "id": "c7704d91-6e45-4aec-8411-bf9d29774e50",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mysql/aiomysql.py",
    "line": 13,
    "code_snippet": "12:     :dbapi: aiomysql\n13:     :connectstring: mysql+aiomysql://user:********@host:port/dbname[?key=value&key=value...]\n14:     :url: https://github.com/aio-libs/aiomysql\n15: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '********'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095595"
  },
  {
    "id": "671e5de8-55e4-41d1-a499-ee75b7ef9776",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mysql/cymysql.py",
    "line": 14,
    "code_snippet": "13:     :dbapi: cymysql\n14:     :connectstring: mysql+cymysql://<username>:<pas**ord>@<host>/<dbname>[?<options>]\n15:     :url: https://github.com/nakagami/CyMySQL\n16: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '<pas**ord>'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095600"
  },
  {
    "id": "cf91eaf0-9faa-451c-9e90-b4f7d14d4535",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mysql/pymysql.py",
    "line": 15,
    "code_snippet": "14:     :dbapi: pymysql\n15:     :connectstring: mysql+pymysql://<username>:<pas**ord>@<host>/<dbname>[?<options>]\n16:     :url: https://pymysql.readthedocs.io/\n17: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '<pas**ord>'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095606"
  },
  {
    "id": "870e7450-a0cc-4cf5-9152-5010e5dbdfaa",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=yQybRBrdNn69BkAbMNJDCTAV3eSzcOvChR5zucGmL9Hxm4+YUaAwtvoKV4vRzdIbUchmhjMagNxDgoYkbqSjU/j/O22927yrf9D42ig13kr9hsmsUtqb4v5UEzpJ; Expires=Thu, 10 Sep 2026 03:59:22 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=yQybRBrdNn69BkAbMNJDCTAV3eSzcOvChR5zucGmL9Hxm4+YUaAwtvoKV4vRzdIbUchmhjMagNxDgoYkbqSjU/j/O22927yrf9D42ig13kr9hsmsUtqb4v5UEzpJ; Expires=Thu, 10 Sep 2026 03:59:22 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: AWSALB=bfMgs4vlo/BvwosV53n24fnQn9y2+ShG2nlzx2gMgNf6LCusMticM4XRnDOGKW/oqj6GjC2k3kaREcJ3LroM4ihYvGTqP15IkPeOzg6wb7qWyV/Z+zuqaJxggfSJ; Expires=Thu, 10 Sep 2026 03:59:22 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=bfMgs4vlo/BvwosV53n24fnQn9y2+ShG2nlzx2gMgNf6LCusMticM4XRnDOGKW/oqj6GjC2k3kaREcJ3LroM4ihYvGTqP15IkPeOzg6wb7qWyV/Z+zuqaJxggfSJ; Expires=Thu, 10 Sep 2026 03:59:22 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095612"
  },
  {
    "id": "74d98b7f-560d-42f1-ae8d-3111fee4a3d8",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=HSp/1X0d83OI77bMpCH+cBKblJLfxUcPVvdLzsegRZHgceCDRsrR9051QbwNYf2BuNE1W+IMNx6ooqK/zhp/cUpgf2WOByw1GYLjSIgqwefK62tlRIsQVYts+tUF; Expires=Thu, 10 Sep 2026 03:59:22 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=HSp/1X0d83OI77bMpCH+cBKblJLfxUcPVvdLzsegRZHgceCDRsrR9051QbwNYf2BuNE1W+IMNx6ooqK/zhp/cUpgf2WOByw1GYLjSIgqwefK62tlRIsQVYts+tUF; Expires=Thu, 10 Sep 2026 03:59:22 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: TrackingId=eyJ0eXBlIjoiY2xhc3MiLCJ2YWx1ZSI6IjZlc2EyRXR0VkdvMnhjbG4ifQ==; Secure; HttpOnly",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095617"
  },
  {
    "id": "b1e54d91-5aa1-4ac5-b081-05390dc6ce96",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/blog",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=LRW7/M93iFHxp1e66RTNZGfhrzn5cm89YDjN6x+9fnUGm48W+14e8w694t1U+vEcvxDjLnx3/i+21WumD/gqY0oTamzDkc83YjrOn53lh4kDHE4lHepW1uc4sMI1; Expires=Thu, 10 Sep 2026 03:59:22 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=LRW7/M93iFHxp1e66RTNZGfhrzn5cm89YDjN6x+9fnUGm48W+14e8w694t1U+vEcvxDjLnx3/i+21WumD/gqY0oTamzDkc83YjrOn53lh4kDHE4lHepW1uc4sMI1; Expires=Thu, 10 Sep 2026 03:59:22 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095623"
  },
  {
    "id": "6e62363e-eed0-4f49-b84d-fdfff39b41ee",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/about",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=K3iXLpaWkUxBu8F4irDtMYP739Cu7+a53PwFKmN7vNTEkiwpxEsb6OlEPnN+qKJ/dR1Gkg1XJWWDeomNNZ2n7fUE150bko52/khtwJT1qmZg2KvdR9dwOFYPLfTh; Expires=Thu, 10 Sep 2026 03:59:22 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=K3iXLpaWkUxBu8F4irDtMYP739Cu7+a53PwFKmN7vNTEkiwpxEsb6OlEPnN+qKJ/dR1Gkg1XJWWDeomNNZ2n7fUE150bko52/khtwJT1qmZg2KvdR9dwOFYPLfTh; Expires=Thu, 10 Sep 2026 03:59:22 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095628"
  },
  {
    "id": "57af2d96-1549-4898-9a31-14d334cbc3ce",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/my-account",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=h3QjbDFVdCWl9DEFI5EI2TNkM7qWGASMxSq3BUb2S8Fbu8e1z8r0pJaqPdVRSiI/uLwMtGDaI9PNUSSdsmMmkfpsblUK2YeHJtj8i85sCQQ8R38bTclCgYE9jNJj; Expires=Thu, 10 Sep 2026 03:59:23 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=h3QjbDFVdCWl9DEFI5EI2TNkM7qWGASMxSq3BUb2S8Fbu8e1z8r0pJaqPdVRSiI/uLwMtGDaI9PNUSSdsmMmkfpsblUK2YeHJtj8i85sCQQ8R38bTclCgYE9jNJj; Expires=Thu, 10 Sep 2026 03:59:23 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095634"
  },
  {
    "id": "8a132c0b-ebde-4d69-92e0-cfa13dcfbb51",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/login",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=9FJlFBAE5/31jTQkKk05PaZBfTCbc4BiLcDIX7IhOvJK2ZV4tKUxGxRV1Lh9d2st10ihnzwLWIek/l2BvjUFB4AJW94oHSLrWTRSTK8bWuPz/vsPupXwFUhyQaS7; Expires=Thu, 10 Sep 2026 03:59:23 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=9FJlFBAE5/31jTQkKk05PaZBfTCbc4BiLcDIX7IhOvJK2ZV4tKUxGxRV1Lh9d2st10ihnzwLWIek/l2BvjUFB4AJW94oHSLrWTRSTK8bWuPz/vsPupXwFUhyQaS7; Expires=Thu, 10 Sep 2026 03:59:23 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095640"
  },
  {
    "id": "6b1fb9fe-a2f2-47e3-b2fe-27c8ad74f5e4",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/cart",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=LYVzyJzeA8ksjQODyozNS/37bHje2eRO6x18ZIM3VBMxP8sJkWZRfaRAjX+kZEdyaEatzjf141kS9lHdm+xAgxeS1Z2rp3IJOs5oQUazVrykH1Ip+QPOZ2q9YaF7; Expires=Thu, 10 Sep 2026 03:59:23 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=LYVzyJzeA8ksjQODyozNS/37bHje2eRO6x18ZIM3VBMxP8sJkWZRfaRAjX+kZEdyaEatzjf141kS9lHdm+xAgxeS1Z2rp3IJOs5oQUazVrykH1Ip+QPOZ2q9YaF7; Expires=Thu, 10 Sep 2026 03:59:23 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095647"
  },
  {
    "id": "470fdecb-1f4f-41a6-b252-1192445c9552",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/product",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=lk+wkXlukhNK6LdtUCmhm0bqXuuKnDtZZJ70ZbrQMnezNed8gZQDJmHIadBrnTYWK5Rlbiq3llkDk0il2pSGGgyKMCQU+ynQuPqUMFNqLEHKVPd0PIEIhR3qtREY; Expires=Thu, 10 Sep 2026 03:59:23 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=lk+wkXlukhNK6LdtUCmhm0bqXuuKnDtZZJ70ZbrQMnezNed8gZQDJmHIadBrnTYWK5Rlbiq3llkDk0il2pSGGgyKMCQU+ynQuPqUMFNqLEHKVPd0PIEIhR3qtREY; Expires=Thu, 10 Sep 2026 03:59:23 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: AWSALB=5kTQ+cuR9A5GtTfcSVzHY+N0SIfZsnwz5M1PzLAV52zfQjOc5DDpICBX0TDQfDxRnpOiiAKxw67GLUehxZA8xmRkQFxuynyLcKgaFSMuR292zyXZs5LIWoAEWqBY; Expires=Thu, 10 Sep 2026 03:59:24 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=5kTQ+cuR9A5GtTfcSVzHY+N0SIfZsnwz5M1PzLAV52zfQjOc5DDpICBX0TDQfDxRnpOiiAKxw67GLUehxZA8xmRkQFxuynyLcKgaFSMuR292zyXZs5LIWoAEWqBY; Expires=Thu, 10 Sep 2026 03:59:24 GMT; Path=/; SameSite=None; Secure\n[owasp-zap]: Set-Cookie: AWSALB=nnVE1Tp1HrepxhewznVAtUXSb/CB7llfKnnafAcMKMc6WDwnMj+VSxExcmDRjVUsuP/zhA2HdXV86z3gz6PHlC04qpphT0TwFFSSi9TYLKd1iHygNUNqiQ5TBqiT; Expires=Thu, 10 Sep 2026 03:59:24 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=nnVE1Tp1HrepxhewznVAtUXSb/CB7llfKnnafAcMKMc6WDwnMj+VSxExcmDRjVUsuP/zhA2HdXV86z3gz6PHlC04qpphT0TwFFSSi9TYLKd1iHygNUNqiQ5TBqiT; Expires=Thu, 10 Sep 2026 03:59:24 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095653"
  },
  {
    "id": "e4879fb8-1b2b-41c5-8f2b-68aee72cf118",
    "title": "Insecure Cookie Attribute (HttpOnly, Secure, SameSite) on 'AWSALB'",
    "description": "The cookie 'AWSALB' is set without the HttpOnly, Secure, SameSite flag(s), allowing potential access via XSS or CSRF.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Session Management",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/product/stock",
    "method": null,
    "parameter": null,
    "evidence": "Set-Cookie: AWSALB=XxzBiXRySOh5mGeBqBVTC8RFUaSiATtiIQaoyIsZwI10pjplJZwHWGJjijWmHb1QKQulApfosVcV156DLQUtMdP1g84HZusmKQnA3bswUKLaCxpyGcZz034dT7ZP; Expires=Thu, 10 Sep 2026 03:59:24 GMT; Path=/\n[owasp-zap]: Set-Cookie: AWSALBCORS=XxzBiXRySOh5mGeBqBVTC8RFUaSiATtiIQaoyIsZwI10pjplJZwHWGJjijWmHb1QKQulApfosVcV156DLQUtMdP1g84HZusmKQnA3bswUKLaCxpyGcZz034dT7ZP; Expires=Thu, 10 Sep 2026 03:59:24 GMT; Path=/; SameSite=None; Secure",
    "remediation": "Add HttpOnly, Secure, SameSite attributes to the Set-Cookie header.",
    "references": [
      "https://owasp.org/www-community/controls/SecureCookieAttribute"
    ],
    "cwe": [
      "CWE-614",
      "CWE-1004"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095661"
  },
  {
    "id": "51c4448f-6335-4c8d-9bb5-bac418cac8c3",
    "title": "Missing Clickjacking Defense (X-Frame-Options / CSP frame-ancestors)",
    "description": "The target web page does not enforce frame embedding restrictions, leaving users vulnerable to UI redressing (Clickjacking).",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Broken Access Control",
    "source": "DAST",
    "scanner": "owasp-zap",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/catalog/product/stock",
    "method": null,
    "parameter": null,
    "evidence": "No 'X-Frame-Options' header or CSP 'frame-ancestors' directive detected in HTTP response.",
    "remediation": "Set `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors 'none'`.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html"
    ],
    "cwe": [
      "CWE-1021"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 50.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095668"
  },
  {
    "id": "703849bb-92b8-48b7-b9fc-d0ad35599a41",
    "title": "Missing HTTP Strict Transport Security (HSTS) Header",
    "description": "The HSTS header forces web browsers to communicate exclusively over encrypted HTTPS, mitigating SSL-stripping and man-in-the-middle attacks.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'Strict-Transport-Security' was absent in response to https://ginandjuice.shop",
    "remediation": "Add `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` header to all HTTPS responses.",
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html#strict-transport-security-hsts"
    ],
    "cwe": [
      "CWE-319",
      "CWE-523"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 50.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095674"
  },
  {
    "id": "a12fdbc2-005b-4095-9af6-3e24c7696da8",
    "title": "Missing Content Security Policy (CSP) Header",
    "description": "A Content Security Policy restricts sources of executable scripts, stylesheets, and frames, preventing Cross-Site Scripting (XSS) and data injection attacks.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Security Misconfiguration",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'Content-Security-Policy' was absent in response to https://ginandjuice.shop",
    "remediation": "Implement a strong `Content-Security-Policy` header (e.g. `default-src 'self'; script-src 'self'; object-src 'none'`).",
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP"
    ],
    "cwe": [
      "CWE-1021",
      "CWE-79"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 60.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095681"
  },
  {
    "id": "c7478faa-af3d-43b2-82b4-dffe8521a11f",
    "title": "Missing X-Content-Type-Options Header",
    "description": "Setting `X-Content-Type-Options: nosniff` prevents browsers from MIME-sniffing a response away from the declared content-type, mitigating drive-by downloads and script execution.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Security Misconfiguration",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'X-Content-Type-Options' was absent in response to https://ginandjuice.shop\n[sentinal-headers]: Header 'Permissions-Policy' was absent in response to https://ginandjuice.shop",
    "remediation": "Configure `Permissions-Policy: camera=(), microphone=(), geolocation=()` to disable unused browser APIs.",
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy"
    ],
    "cwe": [
      "CWE-16"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095687"
  },
  {
    "id": "2b74daaa-66b4-4248-bb47-4ecc1acb5085",
    "title": "Missing Referrer-Policy Header",
    "description": "The Referrer-Policy header controls how much referrer information (sent via the Referer header) should be included with requests.",
    "severity": "LOW",
    "confidence": "HIGH",
    "category": "Information Disclosure",
    "source": "WEB",
    "scanner": "sentinal-headers",
    "file": null,
    "line": null,
    "code_snippet": null,
    "endpoint": "/",
    "method": null,
    "parameter": null,
    "evidence": "Header 'Referrer-Policy' was absent in response to https://ginandjuice.shop",
    "remediation": "Configure `Referrer-Policy: strict-origin-when-cross-origin` or `no-referrer`.",
    "references": [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy"
    ],
    "cwe": [
      "CWE-200"
    ],
    "cves": [],
    "owasp": [
      "A01:2021-Broken Access Control"
    ],
    "risk_score": 25.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T03:59:29.095694"
  },
  {
    "id": "c88dd6f2-3b01-4eb0-a1ed-d9822d2486b9",
    "title": "Dockerfile Container Running as Root",
    "description": "Containers running as root increase the impact of container escape vulnerabilities.",
    "severity": "MEDIUM",
    "confidence": "MEDIUM",
    "category": "Container Security",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/Dockerfile",
    "line": 1,
    "code_snippet": "1: # Multi-stage Dockerfile for Railway deployment\n2: FROM node:20-alpine AS frontend-builder\n3: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern '# Multi-stage Dockerfile for Railway deployment' at line 1\n[sentinal-sast]: Matched pattern 'FROM node:20-alpine AS frontend-builder' at line 2\n[sentinal-sast]: Matched pattern '' at line 3\n[sentinal-sast]: Matched pattern 'WORKDIR /app/frontend' at line 4\n[sentinal-sast]: Matched pattern '' at line 5\n[sentinal-sast]: Matched pattern 'COPY frontend/package*.json ./' at line 6\n[sentinal-sast]: Matched pattern 'RUN npm install --legacy-peer-deps' at line 7\n[sentinal-sast]: Matched pattern '' at line 8\n[sentinal-sast]: Matched pattern 'COPY frontend/ ./' at line 9\n[sentinal-sast]: Matched pattern 'RUN npm run build' at line 10\n[sentinal-sast]: Matched pattern '' at line 11\n[sentinal-sast]: Matched pattern 'FROM python:3.11-slim AS backend' at line 12\n[sentinal-sast]: Matched pattern '' at line 13\n[sentinal-sast]: Matched pattern 'WORKDIR /app' at line 14\n[sentinal-sast]: Matched pattern '' at line 15\n[sentinal-sast]: Matched pattern 'COPY backend/requirements.txt ./' at line 16\n[sentinal-sast]: Matched pattern 'RUN pip install --no-cache-dir -r requirements.txt' at line 17\n[sentinal-sast]: Matched pattern '' at line 18\n[sentinal-sast]: Matched pattern 'COPY backend/ ./' at line 19\n[sentinal-sast]: Matched pattern '' at line 20\n[sentinal-sast]: Matched pattern '# Copy frontend build to backend for serving' at line 21\n[sentinal-sast]: Matched pattern 'COPY --from=frontend-builder /app/frontend/out ./frontend/out' at line 22\n[sentinal-sast]: Matched pattern '' at line 23\n[sentinal-sast]: Matched pattern 'ENV DATABASE_URL=postgresql://neondb_owner:npg_WzCOhSJ0dn6f@ep-nameless-bird-ay266zed.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require' at line 24\n[sentinal-sast]: Matched pattern 'ENV PORT=8000' at line 25\n[sentinal-sast]: Matched pattern '' at line 26\n[sentinal-sast]: Matched pattern 'EXPOSE 8000' at line 27\n[sentinal-sast]: Matched pattern '' at line 28\n[sentinal-sast]: Matched pattern 'CMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]' at line 29",
    "remediation": "Add `USER nonroot` or a dedicated unprivileged user before the ENTRYPOINT/CMD.",
    "references": [
      "https://cwe.mitre.org/data/definitions/250.html"
    ],
    "cwe": [
      "CWE-250"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 38.2,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824818"
  },
  {
    "id": "cbae9cb8-0189-4d0d-9db9-3a6266217b29",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/aiohttp/client.py",
    "line": 869,
    "code_snippet": "868:             r_key = resp.headers.get(hdrs.SEC_WEBSOCKET_ACCEPT, \"\")\n869:             match = base64.b64encode(hashlib.sha1(sec_key + WS_KEY).digest()).decode()\n870:             if r_key != match:\n871:                 raise WSServerHandshakeError(",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 869",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824827"
  },
  {
    "id": "1703bbbf-92ed-4811-8dd4-9bd4249e70ff",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/aiohttp/cookiejar.py",
    "line": 114,
    "code_snippet": "113:         with file_path.open(mode=\"rb\") as f:\n114:             self._cookies = pickle.load(f)\n115: \n116:     def clear(self, predicate: Optional[ClearCookiePredicate] = None) -> None:",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.load(' at line 114",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824831"
  },
  {
    "id": "9abff186-afd9-46c8-9504-4689aad65646",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/aiohttp/web_ws.py",
    "line": 212,
    "code_snippet": "211:         accept_val = base64.b64encode(\n212:             hashlib.sha1(key.encode() + WS_KEY).digest()\n213:         ).decode()\n214:         response_headers = CIMultiDict(",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 212",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824834"
  },
  {
    "id": "33b9a036-96e4-4284-b92d-c244297c892a",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/anyio/to_process.py",
    "line": 77,
    "code_snippet": "76: \n77:         retval = pickle.loads(pickled_response)\n78:         if status == b\"EXCEPTION\":\n79:             assert isinstance(retval, BaseException)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 77\n[sentinal-sast]: Matched pattern 'pickle.load(' at line 200",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824836"
  },
  {
    "id": "e67a50b4-4b2c-42a8-a086-def17b3a326e",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/apscheduler/jobstores/mongodb.py",
    "line": 115,
    "code_snippet": "114:     def _reconstitute_job(self, job_state):\n115:         job_state = pickle.loads(job_state)\n116:         job = Job.__new__(Job)\n117:         job.__setstate__(job_state)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 115",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824839"
  },
  {
    "id": "b49fb399-86ff-4f24-b55f-27c8d3c163fe",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/apscheduler/jobstores/redis.py",
    "line": 123,
    "code_snippet": "122:     def _reconstitute_job(self, job_state):\n123:         job_state = pickle.loads(job_state)\n124:         job = Job.__new__(Job)\n125:         job.__setstate__(job_state)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 123",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824841"
  },
  {
    "id": "c12f6950-22aa-4cb4-94e7-6b8a7d0de51c",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/apscheduler/jobstores/rethinkdb.py",
    "line": 125,
    "code_snippet": "124:     def _reconstitute_job(self, job_state):\n125:         job_state = pickle.loads(job_state)\n126:         job = Job.__new__(Job)\n127:         job.__setstate__(job_state)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 125",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824844"
  },
  {
    "id": "155e4369-b8db-4e30-b067-ab18f1f12e9a",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/apscheduler/jobstores/sqlalchemy.py",
    "line": 73,
    "code_snippet": "72:         with self.engine.begin() as connection:\n73:             job_state = connection.execute(selectable).scalar()\n74:             return self._reconstitute_job(job_state) if job_state else None\n75: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(selectable)' at line 73\n[sentinal-sast]: Matched pattern 'connection.execute(selectable)' at line 85\n[sentinal-sast]: Matched pattern 'connection.execute(insert)' at line 101\n[sentinal-sast]: Matched pattern 'connection.execute(update)' at line 111\n[sentinal-sast]: Matched pattern 'connection.execute(delete)' at line 118\n[sentinal-sast]: Matched pattern 'connection.execute(delete)' at line 125\n[sentinal-sast]: Matched pattern 'connection.execute(selectable)' at line 146\n[sentinal-sast]: Matched pattern 'connection.execute(delete)' at line 156",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824846"
  },
  {
    "id": "a2774118-4045-4198-8e82-7e3631208bd6",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/apscheduler/jobstores/sqlalchemy.py",
    "line": 131,
    "code_snippet": "130:     def _reconstitute_job(self, job_state):\n131:         job_state = pickle.loads(job_state)\n132:         job_state['jobstore'] = self\n133:         job = Job.__new__(Job)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 131",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824849"
  },
  {
    "id": "a0bba86f-a3b6-42a7-bd8b-e40282aa6be4",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/apscheduler/jobstores/zookeeper.py",
    "line": 70,
    "code_snippet": "69:             content, _ = self.client.get(node_path)\n70:             doc = pickle.loads(content)\n71:             job = self._reconstitute_job(doc['job_state'])\n72:             return job",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 70\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 155",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824851"
  },
  {
    "id": "e47d833f-fd11-4296-ac66-403206418933",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/cryptography/x509/extensions.py",
    "line": 72,
    "code_snippet": "71: \n72:     return hashlib.sha1(data).digest()\n73: \n74: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 72",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824854"
  },
  {
    "id": "869cf266-4bb8-471b-a70e-4ac26a9a1148",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/dns/dnssec.py",
    "line": 234,
    "code_snippet": "233:     if algorithm == DSDigest.SHA1:\n234:         dshash = hashlib.sha1()\n235:     elif algorithm == DSDigest.SHA256:\n236:         dshash = hashlib.sha256()",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 234\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 794\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 796",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824856"
  },
  {
    "id": "571c785e-a711-4268-8c45-989683e586ec",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/dns/entropy.py",
    "line": 37,
    "code_snippet": "36:         self.lock = threading.Lock()\n37:         self.hash = hashlib.sha1()\n38:         self.hash_len = 20\n39:         self.pool = bytearray(b\"\\0\" * self.hash_len)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 37",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824858"
  },
  {
    "id": "331e3878-bc67-4e97-a131-c437d2375c23",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_eddsa.py",
    "line": 374,
    "code_snippet": "373:     g = generator_ed25519\n374:     assert pickle.loads(pickle.dumps(g)) == g\n375: \n376: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 374",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824860"
  },
  {
    "id": "5a269659-d0f1-4ef3-904c-b9063ba976d4",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_jacobi.py",
    "line": 778,
    "code_snippet": "777:         pj = PointJacobi(curve=CurveFp(23, 1, 1, 1), x=2, y=3, z=1, order=1)\n778:         self.assertEqual(pickle.loads(pickle.dumps(pj)), pj)\n779: \n780:     @pytest.mark.slow",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 778",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824863"
  },
  {
    "id": "c827f239-dbfd-499a-aded-2e62ef7af893",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_keys.py",
    "line": 937,
    "code_snippet": "936: assert len(data) % 4 == 0\n937: sha1 = hashlib.sha1()\n938: sha1.update(data)\n939: data_hash = sha1.digest()",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 937",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824865"
  },
  {
    "id": "297d6b89-a261-4d1e-b6cb-d373853661ba",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_pyecdsa.py",
    "line": 2038,
    "code_snippet": "2037:             secexp=int(\"6FAB034934E4C0FC9AE67F5B5659A9D7D1FEFD187EE09FD4\", 16),\n2038:             hsh=hashlib.sha1(b\"sample\").digest(),\n2039:             hash_func=hashlib.sha1,\n2040:             expected=int(",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 2038\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 2071\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 2107",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824867"
  },
  {
    "id": "b118b3ef-4218-4ac5-8794-0b8a88ead900",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/google/protobuf/proto_builder.py",
    "line": 68,
    "code_snippet": "67:   # proto files.\n68:   fields_hash = hashlib.sha1()\n69:   for f_name, f_type in field_items:\n70:     fields_hash.update(f_name.encode('utf-8'))",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 68",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824870"
  },
  {
    "id": "be2ff397-3862-4ffc-930b-cc19572740bf",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/httpx/_auth.py",
    "line": 311,
    "code_snippet": "310: \n311:         return hashlib.sha1(s).hexdigest()[:16].encode()\n312: \n313:     def _get_header_value(self, header_fields: typing.Dict[str, bytes]) -> str:",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 311",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824872"
  },
  {
    "id": "73965f60-32af-4107-ba55-b1760fe48c98",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/packaging/_structures.py",
    "line": 10,
    "code_snippet": "9: ``packaging._structures.NegativeInfinityType``.  This module provides minimal\n10: stand-in classes so that ``pickle.loads()`` can resolve those references.\n11: The deserialized objects are not used for comparisons \u2014 ``Version.__setstate__``\n12: discards the stale ``_key`` cache and recomputes it from the core version fields.",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 10",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824874"
  },
  {
    "id": "a67d3ad5-691b-4dfa-a929-ad59db765b39",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/passlib/handlers/digests.py",
    "line": 126,
    "code_snippet": "125:         data = render_bytes(\"%s:%s:%s\", user, realm, secret)\n126:         return hashlib.md5(data).hexdigest()\n127: \n128:     @classmethod",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.md5(' at line 126",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824876"
  },
  {
    "id": "cedf1358-034d-4e68-951d-7034c2756942",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/passlib/tests/test_context.py",
    "line": 1737,
    "code_snippet": "1736:             secret = secret.encode(\"utf-8\")\n1737:         return str_to_uascii(hashlib.sha1(b\"prefix\" + secret).hexdigest())\n1738: \n1739: #=============================================================================",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 1737",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824878"
  },
  {
    "id": "3b1ae4bf-df1e-4c4d-bc69-d104706320ac",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/passlib/tests/test_utils_handlers.py",
    "line": 121,
    "code_snippet": "120:                     raise ValueError(\"invalid hash\")\n121:                 return hashlib.sha1(b\"xyz\" + secret).hexdigest()\n122: \n123:             @classmethod",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 121\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 802\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 832",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824881"
  },
  {
    "id": "a69c2407-6570-4c11-bd08-248eec3e78c8",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/passlib/tests/test_utils_pbkdf2.py",
    "line": 318,
    "code_snippet": "317:         def prf(key, msg):\n318:             return hashlib.md5(key+msg+b'fooey').digest()\n319:         self.assertRaises(NotImplementedError, pbkdf2, b'secret', b'salt', 1000, 20, prf)\n320: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.md5(' at line 318",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824883"
  },
  {
    "id": "a87f0cef-ebb7-46dd-a271-700c2250c0e7",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/psycopg2/extras.py",
    "line": 907,
    "code_snippet": "906:         # get the oid for the hstore\n907:         curs.execute(f\"\"\"SELECT t.oid, {typarray}\n908: FROM pg_type t JOIN pg_namespace ns\n909:     ON typnamespace = ns.oid",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'execute(f\"\"\"SELECT t.oid, {' at line 907",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824885"
  },
  {
    "id": "c535ea1d-36d7-4e39-9122-595995ef8112",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/pydantic/deprecated/parse.py",
    "line": 54,
    "code_snippet": "53:         bb = b if isinstance(b, bytes) else b.encode()  # type: ignore\n54:         return pickle.loads(bb)\n55:     else:\n56:         raise TypeError(f'Unknown protocol: {proto}')",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 54",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824888"
  },
  {
    "id": "298efc5d-9eab-4aa0-a6c3-9332cc5d8dd7",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/pydantic/v1/parse.py",
    "line": 42,
    "code_snippet": "41:         bb = b if isinstance(b, bytes) else b.encode()\n42:         return pickle.loads(bb)\n43:     else:\n44:         raise TypeError(f'Unknown protocol: {proto}')",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 42",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824890"
  },
  {
    "id": "12cd254d-f5b0-44bc-b687-2aa389da489f",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/pytz/__init__.py",
    "line": 293,
    "code_snippet": "292:     17\n293:     >>> new = pickle.loads(p)\n294:     >>> new == dt\n295:     True",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 293\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 496\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 498",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824892"
  },
  {
    "id": "97fc67fb-5bf7-4e36-9fa8-3d4d15001b4a",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/commands/core.py",
    "line": 5099,
    "code_snippet": "5098:             script = encoder.encode(script)\n5099:         self.sha = hashlib.sha1(script).hexdigest()\n5100: \n5101:     def __call__(",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 5099\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 5148\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 5917",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824894"
  },
  {
    "id": "34150520-b6de-422c-8185-43bd347cd725",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/reportlab/lib/fontfinder.py",
    "line": 231,
    "code_snippet": "230:         f = open(fileName, 'rb')\n231:         finder2 = pickle.load(f)\n232:         f.close()\n233:         self.__dict__.update(finder2.__dict__)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.load(' at line 231",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824896"
  },
  {
    "id": "738eb775-1431-4868-b812-05196298a9a4",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/reportlab/lib/utils.py",
    "line": 122,
    "code_snippet": "121: def decode_label(label):\n122:     return pickle.loads(base64_decodebytes(label.encode('latin1')))\n123: \n124: def rawUnicode(s):",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 122\n[sentinal-sast]: Matched pattern 'pickle.load(' at line 907",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824899"
  },
  {
    "id": "64af2d70-c15e-4b7c-b19a-f182b859c03a",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/reportlab/pdfgen/canvas.py",
    "line": 1119,
    "code_snippet": "1118:         if isUnicode(command):\n1119:             rawName = 'PS' + hashlib.md5(command.encode('utf-8')).hexdigest()\n1120:         else:\n1121:             rawName = 'PS' + hashlib.md5(command).hexdigest()",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.md5(' at line 1119\n[sentinal-sast]: Matched pattern 'hashlib.md5(' at line 1121",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824901"
  },
  {
    "id": "0772ce57-9fb3-453f-ae1b-24ace3cc1e7f",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/requests/auth.py",
    "line": 179,
    "code_snippet": "178:                     x = x.encode(\"utf-8\")\n179:                 return hashlib.md5(x, usedforsecurity=False).hexdigest()\n180: \n181:             hash_utf8 = md5_utf8",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.md5(' at line 179\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 187\n[sentinal-sast]: Matched pattern 'hashlib.sha1(' at line 237",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824904"
  },
  {
    "id": "98e55181-a5cb-4188-9afb-d0f3224b2994",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mssql/base.py",
    "line": 3185,
    "code_snippet": "3184:         cursor = dbapi_connection.cursor()\n3185:         cursor.execute(f\"SET TRANSACTION ISOLATION LEVEL {level}\")\n3186:         cursor.close()\n3187:         if level == \"SNAPSHOT\":",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(f\"' at line 3185\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3321\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3334\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3343\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3360\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3377\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3408\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 3998",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824906"
  },
  {
    "id": "3e2e77ef-67d0-4657-b0cf-00cdcf387078",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mysql/asyncmy.py",
    "line": 102,
    "code_snippet": "101:             if parameters is None:\n102:                 result = await self._cursor.execute(operation)\n103:             else:\n104:                 result = await self._cursor.execute(operation, parameters)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(operation)' at line 102",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824908"
  },
  {
    "id": "003cc7f9-5495-4b01-87cb-6e2c14f80944",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mysql/base.py",
    "line": 2527,
    "code_snippet": "2526:         cursor = dbapi_connection.cursor()\n2527:         cursor.execute(f\"SET SESSION TRANSACTION ISOLATION LEVEL {level}\")\n2528:         cursor.execute(\"COMMIT\")\n2529:         cursor.close()",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(f\"' at line 2527",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824911"
  },
  {
    "id": "23634af3-e550-4d4e-bf2d-d7abcffc927a",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mysql/mysqldb.py",
    "line": 165,
    "code_snippet": "164:                 cursor = conn.cursor()\n165:                 cursor.execute(\"SET NAMES %s\" % charset_name)\n166:                 cursor.close()\n167: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(\"SET NAMES %s' at line 165",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824913"
  },
  {
    "id": "c387c7b1-6de7-4fa6-9c23-00d8dce93b49",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/oracle/cx_oracle.py",
    "line": 1165,
    "code_snippet": "1164:             with dbapi_connection.cursor() as cursor:\n1165:                 cursor.execute(f\"ALTER SESSION SET ISOLATION_LEVEL={level}\")\n1166: \n1167:     def _detect_decimal_char(self, connection):",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(f\"' at line 1165",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824916"
  },
  {
    "id": "e098e868-98fc-4f83-9a2a-5a842606d9ab",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/oracle/provision.py",
    "line": 203,
    "code_snippet": "202:     cursor = dbapi_connection.cursor()\n203:     cursor.execute(\"ALTER SESSION SET CURRENT_SCHEMA=%s\" % schema_name)\n204:     cursor.close()\n205: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(\"ALTER SESSION SET CURRENT_SCHEMA=%s' at line 203",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824918"
  },
  {
    "id": "8ea1360f-5a65-4920-97d6-7fc13180feff",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/postgresql/base.py",
    "line": 325,
    "code_snippet": "324:         cursor = dbapi_connection.cursor()\n325:         cursor.execute(\"SET SESSION search_path='%s'\" % schema_name)\n326:         cursor.close()\n327:         dbapi_connection.autocommit = existing_autocommit",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(\"SET SESSION search_path='%s' at line 325",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824920"
  },
  {
    "id": "efa8eb69-4edd-405a-8383-d48257225986",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/postgresql/pg8000.py",
    "line": 362,
    "code_snippet": "361:     def fetchone(self):\n362:         self.cursor.execute(\"FETCH FORWARD 1 FROM \" + self.ident)\n363:         return self.cursor.fetchone()\n364: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(\"FETCH FORWARD 1 FROM \" +' at line 362\n[sentinal-sast]: Matched pattern 'cursor.execute(\"FETCH FORWARD ALL FROM \" +' at line 375\n[sentinal-sast]: Matched pattern 'cursor.execute(\"CLOSE \" +' at line 379",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824922"
  },
  {
    "id": "61f75565-48a8-44a2-95e0-a1390188bc7a",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/postgresql/provision.py",
    "line": 83,
    "code_snippet": "82:     cursor = dbapi_connection.cursor()\n83:     cursor.execute(\"SET SESSION search_path='%s'\" % schema_name)\n84:     cursor.close()\n85:     dbapi_connection.autocommit = existing_autocommit",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(\"SET SESSION search_path='%s' at line 83\n[sentinal-sast]: Matched pattern 'conn.execute(\"ROLLBACK PREPARED '%s' at line 94",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824925"
  },
  {
    "id": "f23330e3-1d79-4842-8fc5-cc040f3530d8",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/postgresql/psycopg.py",
    "line": 495,
    "code_snippet": "494:                 self._do_autocommit(dbapi_conn, True)\n495:             dbapi_conn.execute(command)\n496:         finally:\n497:             if not before_autocommit:",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'conn.execute(command)' at line 495",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824927"
  },
  {
    "id": "ded81d3f-6f92-48b9-8124-a67753e64476",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/sqlite/aiosqlite.py",
    "line": 126,
    "code_snippet": "125:             if parameters is None:\n126:                 self.await_(_cursor.execute(operation))\n127:             else:\n128:                 self.await_(_cursor.execute(operation, parameters))",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(operation)' at line 126",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824929"
  },
  {
    "id": "d3c895e4-42e1-402f-b741-123f3491be00",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/sqlite/base.py",
    "line": 2052,
    "code_snippet": "2051:         cursor = dbapi_connection.cursor()\n2052:         cursor.execute(f\"PRAGMA read_uncommitted = {isolation_level}\")\n2053:         cursor.close()\n2054: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(f\"' at line 2052",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824931"
  },
  {
    "id": "1acd5e7d-af33-43ef-b443-4711d1463205",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/sqlite/pysqlcipher.py",
    "line": 137,
    "code_snippet": "136:             cursor = conn.cursor()\n137:             cursor.execute('pragma key=\"%s\"' % passphrase)\n138:             for prag in self.pragmas:\n139:                 value = url_query.get(prag, None)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute('pragma key=\"%s' at line 137\n[sentinal-sast]: Matched pattern 'cursor.execute('pragma %s' at line 141",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824933"
  },
  {
    "id": "ff470a45-4319-434e-b361-59b525d79196",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/engine/base.py",
    "line": 372,
    "code_snippet": "371:           list or dictionary is totally empty, will invoke the\n372:           statement on the cursor as ``cursor.execute(statement)``,\n373:           not passing the parameter collection at all.\n374:           Some DBAPIs such as psycopg2 and mysql-python consider",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(statement)' at line 372\n[sentinal-sast]: Matched pattern 'cursor.execute(\"use %s' at line 3091",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824936"
  },
  {
    "id": "d4469a74-c696-4e35-b6e5-e7e9f404d641",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/engine/default.py",
    "line": 925,
    "code_snippet": "924:     def do_execute_no_params(self, cursor, statement, context=None):\n925:         cursor.execute(statement)\n926: \n927:     def is_disconnect(self, e, connection, cursor):",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(statement)' at line 925",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824938"
  },
  {
    "id": "bebe84a4-56d7-4221-bd9b-d97b9b2c62db",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/engine/interfaces.py",
    "line": 2207,
    "code_snippet": "2206:     ) -> None:\n2207:         \"\"\"Provide an implementation of ``cursor.execute(statement)``.\n2208: \n2209:         The parameter collection should not be sent.",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'cursor.execute(statement)' at line 2207",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824941"
  },
  {
    "id": "c06a8ecb-7941-4a09-8c37-1fcab0ca3ee9",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/engine/result.py",
    "line": 1108,
    "code_snippet": "1107:             statement = select(table.c.x, table.c.y, table.c.z)\n1108:             result = connection.execute(statement)\n1109: \n1110:             for z, y in result.columns('z', 'y'):",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(statement)' at line 1108\n[sentinal-sast]: Matched pattern 'connection.execute(query)' at line 2156",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824943"
  },
  {
    "id": "fb9162ba-4e2a-491d-acf9-7acb03310edf",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/ext/serializer.py",
    "line": 60,
    "code_snippet": "59:   (i.e. is not already declared in the application).   Regular\n60:   pickle.loads()/dumps() can be used to fully dump any ``MetaData`` object,\n61:   typically one which was reflected from an existing database at some previous\n62:   point in time.  The serializer module is specifically for the opposite case,",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 60\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 147\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 150\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 153\n[sentinal-sast]: Matched pattern 'pickle.loads(' at line 157",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824945"
  },
  {
    "id": "26c99364-689f-43a4-8ad8-5a37369f5fcf",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/ddl.py",
    "line": 353,
    "code_snippet": "352:       drop_spow = DDL('ALTER TABLE users SET secretpowers FALSE')\n353:       connection.execute(drop_spow)\n354: \n355:     When operating on Table events, the following ``statement``",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(drop_spow)' at line 353",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824947"
  },
  {
    "id": "21a8ce3d-f8fd-41fc-9d47-68058d2b57df",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/dml.py",
    "line": 528,
    "code_snippet": "527: \n528:             result = connection.execute(stmt)\n529: \n530:             server_created_at = result.returned_defaults['created_at']",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(stmt)' at line 528",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824949"
  },
  {
    "id": "5fc64e1e-8df5-4a68-b07c-5ddd5970ec43",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/elements.py",
    "line": 2330,
    "code_snippet": "2329:         t = text(\"SELECT * FROM users\")\n2330:         result = connection.execute(t)\n2331: \n2332: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(t)' at line 2330\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 2581\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 2594",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824952"
  },
  {
    "id": "b828a198-acc0-4e37-a4ff-12f59b0a82eb",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/lambdas.py",
    "line": 104,
    "code_snippet": "103: \n104:         result = connection.execute(stmt)\n105: \n106:     The object returned is an instance of :class:`_sql.StatementLambdaElement`.",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(stmt)' at line 104",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824954"
  },
  {
    "id": "45f0ca95-e29b-43d9-b72b-b2ea08f01944",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/selectable.py",
    "line": 2597,
    "code_snippet": "2596: \n2597:             result = conn.execute(statement).fetchall()\n2598: \n2599:         Example 2, WITH RECURSIVE::",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'conn.execute(statement)' at line 2597\n[sentinal-sast]: Matched pattern 'conn.execute(statement)' at line 2637\n[sentinal-sast]: Matched pattern 'connection.execute(upsert)' at line 2673",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824956"
  },
  {
    "id": "1702806f-bdfa-408d-9ae5-2eb9691db0c3",
    "title": "Insecure Deserialization via Pickle / Unsafe YAML",
    "description": "Deserializing untrusted data with `pickle` or `yaml.load(Loader=yaml.Loader)` allows arbitrary code execution via constructor instantiation.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Insecure Deserialization",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/sqltypes.py",
    "line": 1787,
    "code_snippet": "1786:     PickleType builds upon the Binary type to apply Python's\n1787:     ``pickle.dumps()`` to incoming objects, and ``pickle.loads()`` on\n1788:     the way out, allowing any pickleable Python object to be stored as\n1789:     a serialized binary field.",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'pickle.loads(' at line 1787",
    "remediation": "Use `yaml.safe_load()` or JSON for data serialization instead of pickle.",
    "references": [
      "https://cwe.mitre.org/data/definitions/502.html"
    ],
    "cwe": [
      "CWE-502"
    ],
    "cves": [],
    "owasp": [
      "A08:2021-Software and Data Integrity Failures"
    ],
    "risk_score": 90.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824958"
  },
  {
    "id": "8522883d-3f01-4ed1-9d43-e596e7c5fb23",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/sql/_elements_constructors.py",
    "line": 555,
    "code_snippet": "554:         stmt = select(users_table).where(users_table.c.name == 'Wendy')\n555:         result = connection.execute(stmt)\n556: \n557:     We would see SQL logging output as::",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(stmt)' at line 555\n[sentinal-sast]: Matched pattern 'connection.execute(t)' at line 1590\n[sentinal-sast]: Matched pattern 'connection.execute(t)' at line 1628",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824961"
  },
  {
    "id": "6b4b1498-f6b1-4c92-ad31-8f23c43c6218",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/testing/suite/test_dialect.py",
    "line": 534,
    "code_snippet": "533: \n534:         row = connection.execute(stmt).first()\n535: \n536:     @testing.fixture",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(stmt)' at line 534",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824963"
  },
  {
    "id": "b5ecff73-e44e-40d9-9b23-b0cfe30af26f",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/testing/suite/test_results.py",
    "line": 110,
    "code_snippet": "109:         s2 = select(datetable.c.id, s.label(\"somelabel\"))\n110:         row = connection.execute(s2).first()\n111: \n112:         eq_(row.somelabel, datetime.datetime(2006, 5, 12, 12, 0, 0))",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(s2)' at line 110\n[sentinal-sast]: Matched pattern 'conn.execute(statement)' at line 334\n[sentinal-sast]: Matched pattern 'conn.execute(s2)' at line 388",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824965"
  },
  {
    "id": "314d36d7-9742-4aa2-a4c4-e725cc08ca3b",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/testing/suite/test_rowcount.py",
    "line": 65,
    "code_snippet": "64:         ).order_by(employees_table.c.employee_id)\n65:         rows = connection.execute(s).fetchall()\n66: \n67:         eq_(rows, self.data)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(s)' at line 65\n[sentinal-sast]: Matched pattern 'connection.execute(s)' at line 102\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 188",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824967"
  },
  {
    "id": "120b877e-8448-4b59-95f3-225d7dd889b6",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/testing/suite/test_select.py",
    "line": 67,
    "code_snippet": "66:         with config.db.connect() as conn:\n67:             eq_(conn.execute(select).fetchall(), result)\n68: \n69:     @testing.requires.order_by_collation",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'conn.execute(select)' at line 67\n[sentinal-sast]: Matched pattern 'conn.execute(select)' at line 117\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 1474\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 1486",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824970"
  },
  {
    "id": "4bd250e8-5dc2-4c54-b447-c51a514aefd2",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/testing/suite/test_types.py",
    "line": 84,
    "code_snippet": "83:                 )\n84:                 connection.execute(ins)\n85: \n86:             ins = t.insert().values(",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(ins)' at line 84\n[sentinal-sast]: Matched pattern 'connection.execute(ins)' at line 89\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 119\n[sentinal-sast]: Matched pattern 'connection.execute(stmt)' at line 128",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824972"
  },
  {
    "id": "86830829-bcee-4c97-98cc-91d0772751e6",
    "title": "Potential SQL Injection via Unsanitized Query Execution",
    "description": "Constructing SQL queries using string formatting, interpolation, or dynamic query variables without parameterized bindings allows SQL injection attacks.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Injection",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/testing/suite/test_update_delete.py",
    "line": 111,
    "code_snippet": "110: \n111:         r = connection.execute(stmt)\n112:         assert not r.is_insert\n113:         assert r.returns_rows",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'connection.execute(stmt)' at line 111",
    "remediation": "Use parameterized queries (e.g. `cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))`) or an ORM with parameter binding.",
    "references": [
      "https://cwe.mitre.org/data/definitions/89.html"
    ],
    "cwe": [
      "CWE-89"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824974"
  },
  {
    "id": "f325fafa-c43f-42c5-9038-758ea9b8173f",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/util/compat.py",
    "line": 127,
    "code_snippet": "126:     def md5_not_for_security() -> Any:\n127:         return hashlib.md5(usedforsecurity=False)\n128: \n129: else:",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.md5(' at line 127\n[sentinal-sast]: Matched pattern 'hashlib.md5(' at line 132",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824976"
  },
  {
    "id": "d0cac28b-6449-4e15-9deb-ca4a817b1316",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/starlette/_compat.py",
    "line": 16,
    "code_snippet": "15:     # that reject usedforsecurity=True\n16:     hashlib.md5(b\"data\", usedforsecurity=False)  # type: ignore[call-arg]\n17: \n18:     def md5_hexdigest(",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.md5(' at line 16\n[sentinal-sast]: Matched pattern 'hashlib.md5(' at line 21\n[sentinal-sast]: Matched pattern 'hashlib.md5(' at line 28",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824978"
  },
  {
    "id": "d75244b9-23d9-4c27-94a7-e6f456c8a1b2",
    "title": "Use of Broken/Weak Cryptographic Hash (MD5 / SHA-1)",
    "description": "MD5 and SHA-1 have known collision vulnerabilities and are unsuitable for password hashing or cryptographic signatures.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Cryptographic Failures",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/websockets/utils.py",
    "line": 32,
    "code_snippet": "31:     \"\"\"\n32:     sha1 = hashlib.sha1((key + GUID).encode()).digest()\n33:     return base64.b64encode(sha1).decode()\n34: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'hashlib.sha1(' at line 32",
    "remediation": "Use SHA-256 / SHA-3 for hashing or Argon2 / bcrypt / PBKDF2 for password storage.",
    "references": [
      "https://cwe.mitre.org/data/definitions/327.html",
      "https://cwe.mitre.org/data/definitions/328.html"
    ],
    "cwe": [
      "CWE-327",
      "CWE-328"
    ],
    "cves": [],
    "owasp": [
      "A02:2021-Cryptographic Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824981"
  },
  {
    "id": "9c28e063-954c-4625-a1f8-6568d73383e0",
    "title": "Dockerfile Container Running as Root",
    "description": "Containers running as root increase the impact of container escape vulnerabilities.",
    "severity": "MEDIUM",
    "confidence": "MEDIUM",
    "category": "Container Security",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/frontend/Dockerfile",
    "line": 1,
    "code_snippet": "1: FROM node:20-alpine AS base\n2: \n3: # Install dependencies only when needed",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern 'FROM node:20-alpine AS base' at line 1\n[sentinal-sast]: Matched pattern '' at line 2\n[sentinal-sast]: Matched pattern '# Install dependencies only when needed' at line 3\n[sentinal-sast]: Matched pattern 'FROM base AS deps' at line 4\n[sentinal-sast]: Matched pattern 'RUN apk add --no-cache libc6-compat' at line 5\n[sentinal-sast]: Matched pattern 'WORKDIR /app' at line 6\n[sentinal-sast]: Matched pattern '' at line 7\n[sentinal-sast]: Matched pattern 'COPY package.json package-lock.json* ./' at line 8\n[sentinal-sast]: Matched pattern 'COPY npmrc* ./' at line 9\n[sentinal-sast]: Matched pattern 'RUN npm ci' at line 10\n[sentinal-sast]: Matched pattern '' at line 11\n[sentinal-sast]: Matched pattern '# Rebuild the source code only when needed' at line 12\n[sentinal-sast]: Matched pattern 'FROM base AS builder' at line 13\n[sentinal-sast]: Matched pattern 'WORKDIR /app' at line 14\n[sentinal-sast]: Matched pattern 'COPY --from=deps /app/node_modules ./node_modules' at line 15\n[sentinal-sast]: Matched pattern 'COPY . .' at line 16\n[sentinal-sast]: Matched pattern '' at line 17\n[sentinal-sast]: Matched pattern 'ENV NEXT_TELEMETRY_DISABLED 1' at line 18\n[sentinal-sast]: Matched pattern '' at line 19\n[sentinal-sast]: Matched pattern 'RUN npm run build' at line 20\n[sentinal-sast]: Matched pattern '' at line 21\n[sentinal-sast]: Matched pattern '# Production image, copy all the files and run next' at line 22\n[sentinal-sast]: Matched pattern 'FROM base AS runner' at line 23\n[sentinal-sast]: Matched pattern 'WORKDIR /app' at line 24\n[sentinal-sast]: Matched pattern '' at line 25\n[sentinal-sast]: Matched pattern 'ENV NODE_ENV production' at line 26\n[sentinal-sast]: Matched pattern 'ENV NEXT_TELEMETRY_DISABLED 1' at line 27\n[sentinal-sast]: Matched pattern '' at line 28\n[sentinal-sast]: Matched pattern 'RUN addgroup --system --gid 1001 nodejs' at line 29\n[sentinal-sast]: Matched pattern 'RUN adduser --system --uid 1001 nextjs' at line 30\n[sentinal-sast]: Matched pattern '' at line 31\n[sentinal-sast]: Matched pattern 'COPY --from=builder /app/public ./public' at line 32\n[sentinal-sast]: Matched pattern '' at line 33\n[sentinal-sast]: Matched pattern '# Set the correct permission for prerender cache' at line 34\n[sentinal-sast]: Matched pattern 'RUN mkdir .next' at line 35\n[sentinal-sast]: Matched pattern 'RUN chown nextjs:nodejs .next' at line 36\n[sentinal-sast]: Matched pattern '' at line 37\n[sentinal-sast]: Matched pattern 'COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./' at line 38\n[sentinal-sast]: Matched pattern 'COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static' at line 39\n[sentinal-sast]: Matched pattern '' at line 40\n[sentinal-sast]: Matched pattern '' at line 42\n[sentinal-sast]: Matched pattern 'EXPOSE 3000' at line 43\n[sentinal-sast]: Matched pattern '' at line 44\n[sentinal-sast]: Matched pattern 'ENV PORT 3000' at line 45\n[sentinal-sast]: Matched pattern 'ENV HOSTNAME \"0.0.0.0\"' at line 46\n[sentinal-sast]: Matched pattern '' at line 47\n[sentinal-sast]: Matched pattern 'CMD [\"node\", \"server.js\"]' at line 48",
    "remediation": "Add `USER nonroot` or a dedicated unprivileged user before the ENTRYPOINT/CMD.",
    "references": [
      "https://cwe.mitre.org/data/definitions/250.html"
    ],
    "cwe": [
      "CWE-250"
    ],
    "cves": [],
    "owasp": [
      "A05:2021-Security Misconfiguration"
    ],
    "risk_score": 38.2,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824983"
  },
  {
    "id": "df61b253-b3fd-459e-96e0-e1bb233b5529",
    "title": "Cross-Site Scripting (XSS) via innerHTML / dangerouslySetInnerHTML",
    "description": "Directly assigning unsanitized dynamic user input to innerHTML creates Document Object Model (DOM) Cross-Site Scripting vulnerabilities.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Cross-Site Scripting",
    "source": "SAST",
    "scanner": "sentinal-sast",
    "file": "rutu4669-hue-vajra-c6d6652/frontend/public/domain-analysis/app.js",
    "line": 245,
    "code_snippet": "244:         document.documentElement.setAttribute('data-theme', theme);\n245:         elements.themeToggle.innerHTML = theme === 'dark' \n246:             ? '<i class=\"fa-solid fa-sun\"></i>' \n247:             : '<i class=\"fa-solid fa-moon\"></i>';",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Matched pattern '.innerHTML = ' at line 245\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 479\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 480\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 484\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 526\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 527\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 598\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 602\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 641\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 648\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 659\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 716\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 731\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 735\n[sentinal-sast]: Matched pattern '.innerHTML = ' at line 755",
    "remediation": "Use `textContent` or sanitize user input using DOMPurify before inserting into the DOM.",
    "references": [
      "https://cwe.mitre.org/data/definitions/79.html"
    ],
    "cwe": [
      "CWE-79"
    ],
    "cves": [],
    "owasp": [
      "A03:2021-Injection"
    ],
    "risk_score": 70.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824985"
  },
  {
    "id": "ab70ce16-1f77-4a35-b18a-83217151e290",
    "title": "Vulnerable Dependency: fastapi (0.104.1) - PYSEC-2024-38",
    "description": "Vulnerability in python-multipart",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Vulnerable Dependency",
    "source": "SCA",
    "scanner": "osv-scanner",
    "file": "rutu4669-hue-vajra-c6d6652/backend/requirements.txt",
    "line": null,
    "code_snippet": null,
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Package 'fastapi' version '0.104.1' detected in rutu4669-hue-vajra-c6d6652/backend/requirements.txt. Upgrade to latest version.\n[osv-scanner]: Package 'uvicorn' version 'latest' detected in rutu4669-hue-vajra-c6d6652/backend/requirements.txt. Upgrade to latest version.\n[osv-scanner]: Package 'python-jose' version 'latest' detected in rutu4669-hue-vajra-c6d6652/backend/requirements.txt. Upgrade to latest version.\n[osv-scanner]: Package 'python-multipart' version '0.0.6' detected in rutu4669-hue-vajra-c6d6652/backend/requirements.txt. Upgrade to latest version.\n[osv-scanner]: Package 'aiohttp' version '3.9.1' detected in rutu4669-hue-vajra-c6d6652/backend/requirements.txt. Upgrade to latest version.\n[osv-scanner]: Package 'python-dotenv' version '1.0.0' detected in rutu4669-hue-vajra-c6d6652/backend/requirements.txt. Upgrade to latest version.",
    "remediation": "Upgrade python-multipart to a secure version. Upgrade to latest version.",
    "references": [],
    "cwe": [
      "CWE-1395"
    ],
    "cves": [],
    "owasp": [
      "A06:2021-Vulnerable and Outdated Components"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824987"
  },
  {
    "id": "ac28c319-db01-494a-84ad-435a643725e7",
    "title": "Vulnerable Dependency: brace-expansion (5.0.7) - GHSA-mh99-v99m-4gvg",
    "description": "Vulnerability in brace-expansion",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Vulnerable Dependency",
    "source": "SCA",
    "scanner": "osv-scanner",
    "file": "rutu4669-hue-vajra-c6d6652/frontend/package-lock.json",
    "line": null,
    "code_snippet": null,
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Package 'brace-expansion' version '5.0.7' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'brace-expansion' version '1.1.16' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'browserslist' version '4.28.6' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'd3-color' version '2.0.0' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'dompurify' version '2.5.9' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'js-yaml' version '4.3.0' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'jspdf' version '2.5.2' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'nanoid' version '3.3.16' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'next' version '15.5.20' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'postcss' version '8.4.31' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'postcss' version '8.5.18' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.\n[osv-scanner]: Package 'sharp' version '0.34.5' detected in rutu4669-hue-vajra-c6d6652/frontend/package-lock.json. Upgrade to latest version.",
    "remediation": "Upgrade brace-expansion to a secure version. Upgrade to latest version.",
    "references": [],
    "cwe": [
      "CWE-1395"
    ],
    "cves": [],
    "owasp": [
      "A06:2021-Vulnerable and Outdated Components"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824989"
  },
  {
    "id": "c84f1c74-d0ac-464b-9c19-8b36333ed0f4",
    "title": "Vulnerable Dependency: axios (1.6.0) - GHSA-35jp-ww65-95wh",
    "description": "Vulnerability in postcss",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Vulnerable Dependency",
    "source": "SCA",
    "scanner": "osv-scanner",
    "file": "rutu4669-hue-vajra-c6d6652/frontend/package.json",
    "line": null,
    "code_snippet": null,
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Package 'axios' version '1.6.0' detected in rutu4669-hue-vajra-c6d6652/frontend/package.json. Upgrade to latest version.\n[osv-scanner]: Package 'jspdf' version '2.5.1' detected in rutu4669-hue-vajra-c6d6652/frontend/package.json. Upgrade to latest version.\n[osv-scanner]: Package 'next' version '15.0.0' detected in rutu4669-hue-vajra-c6d6652/frontend/package.json. Upgrade to latest version.\n[osv-scanner]: Package 'postcss' version '8.4.0' detected in rutu4669-hue-vajra-c6d6652/frontend/package.json. Upgrade to latest version.\n[osv-scanner]: Package 'zod' version '3.22.0' detected in rutu4669-hue-vajra-c6d6652/frontend/package.json. Upgrade to latest version.",
    "remediation": "Upgrade postcss to a secure version. Upgrade to latest version.",
    "references": [],
    "cwe": [
      "CWE-1395"
    ],
    "cves": [],
    "owasp": [
      "A06:2021-Vulnerable and Outdated Components"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824992"
  },
  {
    "id": "5634cd97-466f-4854-a115-80a84ea82a5e",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/docker-compose.yml",
    "line": 48,
    "code_snippet": "47:     environment:\n48:       DATABASE_URL: postgresql://${POSTGRES_USER:-ai_*****************************************************ord}@postgres:5432/${POSTGRES_DB:-ai_security_platform}\n49:       REDIS_URL: redis://redis:6379/0\n50:       SECRET_KEY: ${SECRET_KEY:-your-super-secret-jwt-key-change-this-in-production}",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '-ai_*****************************************************ord}'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824994"
  },
  {
    "id": "3ec5cc93-d1f4-48cf-b1d8-260675f6c203",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/Dockerfile",
    "line": 24,
    "code_snippet": "23: \n24: ENV DATABASE_URL=postgresql://neondb_owner:npg_********dn6f@ep-nameless-bird-ay266zed.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require\n25: ENV PORT=8000\n26: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'npg_********dn6f'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824996"
  },
  {
    "id": "b73b11f3-700a-4a0c-9f53-b81136407483",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/README.md",
    "line": 212,
    "code_snippet": "211: ```\n212: DATABASE_URL=postgresql://user:********@localhost:5432/ai_security_platform\n213: REDIS_URL=redis://localhost:6379/0\n214: SECRET_KEY=your-super-secret-jwt-key",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '********'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.824998"
  },
  {
    "id": "8bc73ce3-5204-4817-ac2c-158609587020",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/render.yaml",
    "line": 12,
    "code_snippet": "11:       - key: DATABASE_URL\n12:         value: postgresql://neondb_owner:npg_********dn6f@ep-nameless-bird-ay266zed-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require\n13:       - key: SECRET_KEY\n14:         value: qHpvQjjfYQ0jrsiwvNQ0vzAw9OGKM36ucCzZadzMED4",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'npg_********dn6f'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825001"
  },
  {
    "id": "fed82af2-b08c-483b-a3b4-d60251e31140",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/vajra-cdc56-firebase-adminsdk-fbsvc-b200c1088e.json",
    "line": 5,
    "code_snippet": "4:   \"private_key_id\": \"b200c1088e307852c5fd74284e0035b5c040a208\",\n5:   \"private_key\": \"----*******************----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2KtvcIg/MWQYu\\nsM0X3yG8s4eJ8FJFmQg4l1BpOsduQsJBrwrv++2X9Ei6ZkZvezUt64QnOHy4ZtqA\\nAbDE4LxGWPz8uL/9GkRHiYGZPBviVLgmFciyRE/dUEbItaYhIUKSmhx3/cu2QQu/\\nGdTGNHiR0GlLdBZmYzSBB+UQA/nxVg38R8xoJK7+FfzNxkANHYK9S+cPky4eryPm\\nxdsBpfjdRfdqsfjU9B5O97rrhwrg7JN6Pkc5VftFzr93ozWB4Cyi7tdb0Ei9LmTH\\nRkUiXKUtEUNqYLuU3Chg9W3xnKTYiB28MKrEnv0PqErQ+RE08NnFvNI0PMhVDWwr\\nCmEygScjAgMBAAECggEAO51E/AItl1se2dLEG2bK/Jzn4y1BT0NoXFSwXO9+akfw\\nmFw3QRf5xfuMfWuQ61Svr4peYhNrRVFree6Tsao2EvN2PyIaujKJW7vVLJduLKA6\\n70O7vRL769okf/RqHHds+Nr0LBRjQQ6CUJScfAyZ1GYWvzmLRxB6EyvJO3eBqQdJ\\n+nx00ekxMTTkbqimgYO6yxXdX+MBCndhqtzIFC2Y1opTBCLv4W6lNRdMXUvOkZLr\\nb5ZeT46T6L8NKfMxa60xJvx94nTzqU5i0JLPLmmDZ6E+7YJG+hGRvM4tbVZZBXus\\n5ykXlEDhiqsiktzXPOzRpVoP+j2TTKycAUzZ30sN8QKBgQDfTZLUzOhhPH7rjNCE\\n6gpPaX0cYO0lgXk4ZhCjbAm83P5IqrrU/hUFE+kwUc943oAK/S73BlzjLXBlWnWV\\nldB5AnFii6u20dgLrtgJOexi7VlUb2XgAvB933veBXO+7k63OkFCfQ88WYWjyDNR\\naXrRNpAWxpYTeFuCM0D7I2yrawKBgQDQ11VOJBMGxAMeuS6td8XcYoR7bW98M1qD\\n7X2qcupAISOUjk9+N6VCUaV4xbZtEt3SSQT6QgayMLUVPa1Blx1Vx+Jqegwrq0Ma\\n6EKAgPo4zjUdp5b64xHUOx9qbJMCKJJYiz7iDPLEhklDi10aAD4/cNkKxyTL0yKP\\nw/8TGWTZKQKBgQC2GGlLVUmOual6ZltIeB4uQgS/Vp8sfZefkUOyMJEETWajVW6D\\n8Cqt+F2phJ1eoHrj+zEISk0HCO/mBs1qTUAy3fYeeW1u6VJ3vH35kB2fUpQNEcaO\\n1XbN/qfhFqsboPPZ4QyErrz05r/fHowSsKRx5T+9AvYxLG3bD/bGlU2xvwKBgErc\\n9ip1yhBB0bCAx5fNeLMg6cbpGu7V5dunFcY1PX3Ro1SMkzh2sBoO9JdPoK6G9dd8\\n73jalFXqGe/MVUBO8GggqCxtJdG9qeeKXNR957TXTrkbq4ayQWDn9MIMu8IpUxTE\\njb0w0RHb5YV9/tjkP2w0gslXS/x46knJA7YQA1PJAoGBAIe66MFkgCtvTXued2aW\\nplmgUND76ITS0e1GS7Vgn7eeR+ZMPIwpPsk+agfApH40HO4xfaRwG3A1tPqAE2NM\\niObrAtbdBoV6T0rexDQ78R+rruVBWgkOpDpPZIvaH8vm4/TIPrWypWe2upGok1M+\\nnOG1RKunlA2qJVAU26se8vsn\\n-----END PRIVATE KEY-----\\n\",\n6:   \"client_email\": \"firebase-adminsdk-fbsvc@vajra-cdc56.iam.gserviceaccount.com\",\n7:   \"client_id\": \"117365507564368341028\",",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----*******************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825003"
  },
  {
    "id": "1485c340-43d5-481c-99a5-c2a1a5116696",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/.env.example",
    "line": 2,
    "code_snippet": "1: # Database\n2: DATABASE_URL=postgresql://user:********@localhost:5432/ai_security_platform\n3: POSTGRES_USER=ai_security_user\n4: POSTGRES_PASSWORD=your_secure_********",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '********'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825005"
  },
  {
    "id": "367615d3-c64b-4300-9dc3-30294ed69fe0",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/create_admin.py",
    "line": 9,
    "code_snippet": "8: # Set the DATABASE_URL to Neon before importing database\n9: os.environ[\"DATABASE_URL\"] = \"postgresql://neondb_owner:npg_********dn6f@ep-nameless-bird-ay266zed-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require\"\n10: \n11: from database.database import SessionLocal, engine, Base",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'npg_********dn6f'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825007"
  },
  {
    "id": "418ce847-c180-4a0f-b9b9-eb0b9f49632a",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/render.yaml",
    "line": 9,
    "code_snippet": "8:       - key: DATABASE_URL\n9:         value: postgresql://neondb_owner:npg_********dn6f@ep-nameless-bird-ay266zed-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require\n10:       - key: SECRET_KEY\n11:         value: qHpvQjjfYQ0jrsiwvNQ0vzAw9OGKM36ucCzZadzMED4",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'npg_********dn6f'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825010"
  },
  {
    "id": "e200eeee-fe9b-4188-83da-e58c2b4e09c0",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/reset_admin_password.py",
    "line": 9,
    "code_snippet": "8: if not os.getenv(\"DATABASE_URL\"):\n9:     os.environ[\"DATABASE_URL\"] = \"postgresql://neondb_owner:npg_********dn6f@ep-nameless-bird-ay266zed-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require\"\n10: \n11: from database.database import SessionLocal, engine, Base",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'npg_********dn6f'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825012"
  },
  {
    "id": "0c6c15e2-d352-4734-b472-4ee68c2d97cd",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/database/database.py",
    "line": 10,
    "code_snippet": "9: BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))\n10: DEFAULT_NEON_DB = \"postgresql://neondb_owner:npg_********dn6f@ep-nameless-bird-ay266zed-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require\"\n11: raw_db_url = os.getenv(\"DATABASE_URL\") or DEFAULT_NEON_DB\n12: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'npg_********dn6f'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825014"
  },
  {
    "id": "49561e1c-bdc2-424d-be27-0239232d0b8e",
    "title": "Exposed Secret: JSON Web Token (JWT)",
    "description": "Hardcoded secret token or credential (JSON Web Token (JWT)) found in source code repository.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Authentication Token",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/services/cloudsec_service.py",
    "line": 10,
    "code_snippet": "9:     def __init__(self):\n10:         self.token = os.getenv(\"CLOUDSEC_TOKEN\", \"eyJh*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************ZPBs\")\n11:         # Updated base URL based on the token structure\n12:         self.base_url = \"https://integrations.pollinations.ai\"",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for JSON Web Token (JWT) matching 'eyJh*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************ZPBs'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825016"
  },
  {
    "id": "f1abfe37-2ad0-45d1-880f-3dd088cd1e15",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/cryptography/hazmat/primitives/serialization/ssh.py",
    "line": 78,
    "code_snippet": "77: _SK_MAGIC = b\"openssh-key-v1\\0\"\n78: _SK_START = b\"----***************************----\"\n79: _SK_END = b\"-----END OPENSSH PRIVATE KEY-----\"\n80: _BCRYPT = b\"bcrypt\"",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***************************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825019"
  },
  {
    "id": "b2077afe-9fd3-4255-8f7a-207eec54f5b5",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/keys.py",
    "line": 972,
    "code_snippet": "971:         # have the \"EC PARAMETERS\" section; it's just \"PRIVATE KEY\".\n972:         private_key_index = string.find(b\"----**********************----\")\n973:         if private_key_index == -1:\n974:             private_key_index = string.index(b\"-----BEGIN PRIVATE KEY-----\")",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----**********************----'\n[gitleaks]: Detected pattern for Private Cryptographic Key matching '----*******************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825023"
  },
  {
    "id": "faf13f8a-b6e2-4ed2-bde2-dd6c857921f9",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_ecdh.py",
    "line": 305,
    "code_snippet": "304: pem_local_private_key = (\n305:     \"----**********************----\\n\"\n306:     \"MF8CAQEEGF7IQgvW75JSqULpiQQ8op9WH6Uldw6xxaAKBggqhkjOPQMBAaE0AzIA\\n\"\n307:     \"BLiBd9CE7xf15FY5QIAoNg+fWbSk1yZOYtoGUdzkejWkxbRc9RWTQjqLVXucIJnz\\n\"",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----**********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825025"
  },
  {
    "id": "7b277cc7-0215-4d44-8b4c-8e9e473e6080",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_keys.py",
    "line": 144,
    "code_snippet": "143:         prv_key_str = (\n144:             \"----**********************----\\n\"\n145:             \"MF8CAQEEGF7IQgvW75JSqULpiQQ8op9WH6Uldw6xxaAKBggqhkjOPQMBAaE0AzIA\\n\"\n146:             \"BLiBd9CE7xf15FY5QIAoNg+fWbSk1yZOYtoGUdzkejWkxbRc9RWTQjqLVXucIJnz\\n\"",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----**********************----'\n[gitleaks]: Detected pattern for Private Cryptographic Key matching '----*******************----'\n[gitleaks]: Detected pattern for Private Cryptographic Key matching '----***************************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825028"
  },
  {
    "id": "33cbb799-1272-417f-8734-a40e1b6791ef",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa/test_pyecdsa.py",
    "line": 245,
    "code_snippet": "244:         self.assertEqual(type(s1), binary_type)\n245:         self.assertTrue(s1.startswith(b\"----**********************----\"))\n246:         self.assertTrue(s1.strip().endswith(b\"-----END EC PRIVATE KEY-----\"))\n247:         priv2 = SigningKey.from_pem(s1)",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----**********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825030"
  },
  {
    "id": "4654b770-979e-4d65-88f6-44c57d0d0efc",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/ecdsa-0.19.2.dist-info/METADATA",
    "line": 371,
    "code_snippet": "370: formats that OpenSSL uses. The PEM file looks like the familiar ASCII-armored\n371: `\"----**********************----\"` base64-encoded format, and the DER format\n372: is a shorter binary form of the same data.\n373: `SigningKey.from_pem()/.from_der()` will undo this serialization. These",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----**********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825037"
  },
  {
    "id": "43ab67b8-3061-4ffe-9e36-ba59756b396c",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/google/auth/crypt/_python_rsa.py",
    "line": 39,
    "code_snippet": "38: _CERTIFICATE_MARKER = b\"-----BEGIN CERTIFICATE-----\"\n39: _PKCS1_MARKER = (\"----***********************----\", \"-----END RSA PRIVATE KEY-----\")\n40: _PKCS8_MARKER = (\"-----BEGIN PRIVATE KEY-----\", \"-----END PRIVATE KEY-----\")\n41: _PKCS8_SPEC = PrivateKeyInfo()",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***********************----'\n[gitleaks]: Detected pattern for Private Cryptographic Key matching '----*******************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825039"
  },
  {
    "id": "346304a9-df18-40cc-b594-a794adc30d18",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/google/auth/transport/_mtls_helper.py",
    "line": 42,
    "code_snippet": "41: # support various format of key files, e.g.\n42: # \"----*******************----...\",\n43: # \"-----BEGIN EC PRIVATE KEY-----...\",\n44: # \"-----BEGIN RSA PRIVATE KEY-----...\"",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----*******************----'\n[gitleaks]: Detected pattern for Private Cryptographic Key matching '----**********************----'\n[gitleaks]: Detected pattern for Private Cryptographic Key matching '----***********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825041"
  },
  {
    "id": "7fa90853-8b10-4266-961f-c8db8f90edfd",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/google/oauth2/gdch_credentials.py",
    "line": 50,
    "code_snippet": "49:             \"private_key_id\": \"<key id>\",\n50:             \"private_key\": \"----**********************----\\n<key bytes>\\n-----END EC PRIVATE KEY-----\\n\",\n51:             \"name\": \"<service identity name>\",\n52:             \"ca_cert_path\": \"<CA cert path>\",",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----**********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825044"
  },
  {
    "id": "dae74370-1874-48c3-8a0f-ea46c11ce93b",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/googleapiclient/discovery_cache/documents/appengine.v1.json",
    "line": 3140,
    "code_snippet": "3139: \"privateKey\": {\n3140: \"description\": \"Unencrypted PEM encoded RSA private key. This field is set once on certificate creation and then encrypted. The key size must be 2048 bits or fewer. Must include the header and footer. Example: ----***********************---- -----END RSA PRIVATE KEY----- @InputOnly\",\n3141: \"type\": \"string\"\n3142: },",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825046"
  },
  {
    "id": "0aae6265-fc94-4813-89da-027d36b6794d",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/googleapiclient/discovery_cache/documents/appengine.v1alpha.json",
    "line": 1584,
    "code_snippet": "1583: \"privateKey\": {\n1584: \"description\": \"Unencrypted PEM encoded RSA private key. This field is set once on certificate creation and then encrypted. The key size must be 2048 bits or fewer. Must include the header and footer. Example: ----***********************---- -----END RSA PRIVATE KEY----- @InputOnly\",\n1585: \"type\": \"string\"\n1586: },",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825048"
  },
  {
    "id": "4a7ab685-0435-49ac-9870-f4737f0ebf0b",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/googleapiclient/discovery_cache/documents/appengine.v1beta.json",
    "line": 3369,
    "code_snippet": "3368: \"privateKey\": {\n3369: \"description\": \"Unencrypted PEM encoded RSA private key. This field is set once on certificate creation and then encrypted. The key size must be 2048 bits or fewer. Must include the header and footer. Example: ----***********************---- -----END RSA PRIVATE KEY----- @InputOnly\",\n3370: \"type\": \"string\"\n3371: },",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825050"
  },
  {
    "id": "0dfa7112-dc58-4ede-a852-404f6b1d217b",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/limits/aio/storage/mongodb.py",
    "line": 54,
    "code_snippet": "53:         \"\"\"\n54:         :param uri: uri of the form ``async+mongodb://[user:pass*ord]@host:port?...``,\n55:          This uri is passed directly to :class:`~motor.motor_asyncio.AsyncIOMotorClient`\n56:         :param database_name: The database to use for storing the rate limit",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'pass*ord]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825053"
  },
  {
    "id": "7c67db3b-3889-42a6-9a17-0b2211f30d81",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/limits/aio/storage/redis/__init__.py",
    "line": 73,
    "code_snippet": "72: \n73:          - ``async+redis://[:pass*ord]@host:port``\n74:          - ``async+redis://[:pass*ord]@host:port/db``\n75:          - ``async+rediss://[:pass*ord]@host:port``",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'pass*ord]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825055"
  },
  {
    "id": "29aa411f-b7dd-4177-a064-2dbd7ced30da",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/limits/storage/mongodb.py",
    "line": 41,
    "code_snippet": "40:         \"\"\"\n41:         :param uri: uri of the form ``mongodb://[user:pass*ord]@host:port?...``,\n42:          This uri is passed directly to :class:`~pymongo.mongo_client.MongoClient`\n43:         :param database_name: The database to use for storing the rate limit",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'pass*ord]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825057"
  },
  {
    "id": "22413fdf-4128-42d9-ac9b-531fcfd22616",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/limits/storage/redis.py",
    "line": 76,
    "code_snippet": "75:         \"\"\"\n76:         :param uri: uri of the form ``redis://[:pass*ord]@host:port``,\n77:          ``redis://[:pass*ord]@host:port/db``,\n78:          ``rediss://[:pass*ord]@host:port``, ``redis+unix:///path/to/sock`` etc.",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching 'pass*ord]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825059"
  },
  {
    "id": "7a0e164c-5ca5-48c5-adc6-63c912a34a7d",
    "title": "Exposed Secret: JSON Web Token (JWT)",
    "description": "Hardcoded secret token or credential (JSON Web Token (JWT)) found in source code repository.",
    "severity": "MEDIUM",
    "confidence": "HIGH",
    "category": "Authentication Token",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/python_jose-3.3.0.dist-info/METADATA",
    "line": 116,
    "code_snippet": "115:     >>> token = jwt.encode({'key': 'value'}, 'secret', algorithm='HS256')\n116:     u'eyJh*********************************************************************************************jmWg'\n117: \n118:     >>> jwt.decode(token, 'secret', algorithms=['HS256'])",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for JSON Web Token (JWT) matching 'eyJh*********************************************************************************************jmWg'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 45.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825061"
  },
  {
    "id": "e2374106-df2c-4cd9-a5c2-f4559132373a",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/client.py",
    "line": 103,
    "code_snippet": "102: \n103:             redis://[[username]:[pas***rd]]@localhost:6379/0\n104:             rediss://[[username]:[pas***rd]]@localhost:6379/0\n105:             unix://[username@]/path/to/socket.sock?db=0[&password=password]",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '[pas***rd]]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825063"
  },
  {
    "id": "47d6fd1d-30ba-491e-a891-55218e4bccb5",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/cluster.py",
    "line": 453,
    "code_snippet": "452: \n453:             redis://[[username]:[pas***rd]]@localhost:6379/0\n454:             rediss://[[username]:[pas***rd]]@localhost:6379/0\n455:             unix://[username@]/path/to/socket.sock?db=0[&password=password]",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '[pas***rd]]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825066"
  },
  {
    "id": "5a6bbfe8-d223-42b0-9da8-99b67c0e2513",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/connection.py",
    "line": 937,
    "code_snippet": "936: \n937:             redis://[[username]:[pas***rd]]@localhost:6379/0\n938:             rediss://[[username]:[pas***rd]]@localhost:6379/0\n939:             unix://[username@]/path/to/socket.sock?db=0[&password=password]",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '[pas***rd]]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825068"
  },
  {
    "id": "d500a649-e44c-4b32-829d-3251e3cbaa63",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/asyncio/client.py",
    "line": 125,
    "code_snippet": "124: \n125:             redis://[[username]:[pas***rd]]@localhost:6379/0\n126:             rediss://[[username]:[pas***rd]]@localhost:6379/0\n127:             unix://[username@]/path/to/socket.sock?db=0[&password=password]",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '[pas***rd]]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825070"
  },
  {
    "id": "3db3487f-3990-4fae-8b50-351c63bd3ec7",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/asyncio/cluster.py",
    "line": 183,
    "code_snippet": "182: \n183:             redis://[[username]:[pas***rd]]@localhost:6379/0\n184:             rediss://[[username]:[pas***rd]]@localhost:6379/0\n185: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '[pas***rd]]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825073"
  },
  {
    "id": "6c5316a1-ff27-4d81-bc5e-9a43cba709fe",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/redis/asyncio/connection.py",
    "line": 954,
    "code_snippet": "953: \n954:             redis://[[username]:[pas***rd]]@localhost:6379/0\n955:             rediss://[[username]:[pas***rd]]@localhost:6379/0\n956:             unix://[username@]/path/to/socket.sock?db=0[&password=password]",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '[pas***rd]]'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825075"
  },
  {
    "id": "d846ba25-0215-4ae7-87d4-7a7b495d27c5",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/rsa/key.py",
    "line": 603,
    "code_snippet": "602: \n603:         The contents of the file before the \"----***********************----\" and\n604:         after the \"-----END RSA PRIVATE KEY-----\" lines is ignored.\n605: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825077"
  },
  {
    "id": "407b1a78-fbe8-4978-bb39-1ee9f8acc60d",
    "title": "Exposed Secret: Private Cryptographic Key",
    "description": "Hardcoded secret token or credential (Private Cryptographic Key) found in source code repository.",
    "severity": "CRITICAL",
    "confidence": "HIGH",
    "category": "Private Key",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/rsa/pem.py",
    "line": 88,
    "code_snippet": "87:     :param pem_marker: the marker of the PEM content, such as 'RSA PRIVATE KEY'\n88:         when your file has '----***********************----' and\n89:         '-----END RSA PRIVATE KEY-----' markers.\n90: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Private Cryptographic Key matching '----***********************----'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 98.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825079"
  },
  {
    "id": "c98a2a53-c76c-46fd-8b22-f7726bd5320b",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mysql/aiomysql.py",
    "line": 13,
    "code_snippet": "12:     :dbapi: aiomysql\n13:     :connectstring: mysql+aiomysql://user:********@host:port/dbname[?key=value&key=value...]\n14:     :url: https://github.com/aio-libs/aiomysql\n15: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '********'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825081"
  },
  {
    "id": "f754bb28-04a1-469a-832e-a66019d7ccae",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mysql/cymysql.py",
    "line": 14,
    "code_snippet": "13:     :dbapi: cymysql\n14:     :connectstring: mysql+cymysql://<username>:<pas**ord>@<host>/<dbname>[?<options>]\n15:     :url: https://github.com/nakagami/CyMySQL\n16: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '<pas**ord>'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825083"
  },
  {
    "id": "3988fbad-6c1d-4ac4-ad6b-3a638e71a893",
    "title": "Exposed Secret: Database Connection String with Password",
    "description": "Hardcoded secret token or credential (Database Connection String with Password) found in source code repository.",
    "severity": "HIGH",
    "confidence": "HIGH",
    "category": "Database Credentials",
    "source": "SECRETS",
    "scanner": "gitleaks",
    "file": "rutu4669-hue-vajra-c6d6652/backend/venv/lib/python3.11/site-packages/sqlalchemy/dialects/mysql/pymysql.py",
    "line": 15,
    "code_snippet": "14:     :dbapi: pymysql\n15:     :connectstring: mysql+pymysql://<username>:<pas**ord>@<host>/<dbname>[?<options>]\n16:     :url: https://pymysql.readthedocs.io/\n17: ",
    "endpoint": null,
    "method": null,
    "parameter": null,
    "evidence": "Detected pattern for Database Connection String with Password matching '<pas**ord>'",
    "remediation": "Immediately revoke/rotate the leaked credential, remove it from git history using git-filter-repo or BFG, and store secrets in environment variables or a Secret Vault.",
    "references": [
      "https://cwe.mitre.org/data/definitions/798.html",
      "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/"
    ],
    "cwe": [
      "CWE-798",
      "CWE-312"
    ],
    "cves": [],
    "owasp": [
      "A07:2021-Identification and Authentication Failures"
    ],
    "risk_score": 78.0,
    "threat_scenario": null,
    "potential_impact": {},
    "blast_radius": null,
    "status": "open",
    "created_at": "2026-09-03T04:03:38.825086"
  }
];

export const mockAssets = [
  {
    id: "ast-01",
    name: "Production Web Application",
    url: "https://app.company.internal",
    type: "Web Application",
    category: "Web Applications",
    environment: "PRODUCTION",
    status: "Active",
    riskRating: "CRITICAL",
    riskScore: 86,
    criticalCount: 4,
    highCount: 8,
    mediumCount: 12,
    lowCount: 5,
    lastScan: "Today, 14:20",
    owner: "AppSec Team"
  },
  {
    id: "ast-02",
    name: "Core API Gateway & Microservices",
    url: "https://api.company.internal",
    type: "API Gateway",
    category: "APIs",
    environment: "PRODUCTION",
    status: "Active",
    riskRating: "HIGH",
    riskScore: 72,
    criticalCount: 2,
    highCount: 6,
    mediumCount: 9,
    lowCount: 8,
    lastScan: "Today, 12:45",
    owner: "Backend Core"
  },
  {
    id: "ast-03",
    name: "Authentication & Identity Service",
    url: "https://auth.company.internal",
    type: "Identity Provider",
    category: "Authentication",
    environment: "PRODUCTION",
    status: "Active",
    riskRating: "MEDIUM",
    riskScore: 48,
    criticalCount: 0,
    highCount: 3,
    mediumCount: 6,
    lowCount: 4,
    lastScan: "Yesterday",
    owner: "SecOps IAM"
  }
];

export const mockProjects = [
  { id: "prj-01", name: "Enterprise Core Platform", key: "ECP", description: "Primary web ingress and backend services", assetCount: 3, findingCount: 287, criticalCount: 66, highCount: 109, mediumCount: 68, lowCount: 44, lastScan: "Today" }
];

export const mockAssessments = [
  {
    id: "asm-latest",
    name: "Production Comprehensive Scan Run #42",
    type: "COMBINED",
    target: "https://app.company.internal + Source Code",
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    overallScore: 87,
    securityScore: 87,
    riskScore: 13,
    counts: { critical: 66, high: 109, medium: 68, low: 44, info: 0, total: 287 }
  }
];

export const mockCorrelatedRisks = [
  {
    id: "risk-corr-01",
    title: "Authentication Bypass to Remote Code Execution Chain",
    scenario: "Unauthenticated JWT secret leak combined with SQL Injection endpoint permits full database extraction and admin takeover.",
    finalRisk: "CRITICAL",
    confidence: 96,
    exploitability: "HIGH",
    blastRadius: "Entire User Database & Cloud Infrastructure",
    findings: [
      { id: "f-sec-01", title: "Exposed Secret: JWT Private Signing Key", source: "Secrets", severity: "CRITICAL" },
      { id: "f-sast-01", title: "SQL Injection in Query Handler", source: "SAST", severity: "CRITICAL" }
    ]
  },
  {
    id: "risk-corr-02",
    title: "Vulnerable Dependency Combined with Weak Cookie Isolation",
    scenario: "Outdated package CVE exploited via XSS to steal unflagged session identifiers.",
    finalRisk: "ELEVATED",
    confidence: 88,
    exploitability: "MEDIUM",
    blastRadius: "Session Hijacking of Authenticated Users",
    findings: [
      { id: "f-sca-01", title: "Vulnerable Dependency: lodash GHSA-29mw-wpgm-hmr9", source: "SCA", severity: "HIGH" },
      { id: "f-dast-01", title: "Insecure Cookie Attribute (HttpOnly, Secure) on Session Token", source: "DAST", severity: "HIGH" }
    ]
  }
];

export const mockReports = [];
export const mockNotifications = [];

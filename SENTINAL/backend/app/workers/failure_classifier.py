from datetime import datetime, timezone
from typing import Dict, Any, Optional, List

def classify_assessment_failure(
    error: Any,
    stage: str = "EXECUTION",
    diag_result: Optional[Dict[str, Any]] = None,
    dast_telemetry: Optional[Dict[str, Any]] = None,
    target_info: Optional[Dict[str, Any]] = None,
    repo_info: Optional[Dict[str, Any]] = None,
    logs: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Classifies scan failure exceptions into structured, actionable failure diagnostics
    with root-cause analysis, HTTP/WAF telemetry context, and remediation playbooks.
    """
    err_str = str(error or "Unknown error occurred during scan execution.")
    err_lower = err_str.lower()
    diag = diag_result or {}
    checks = diag.get("checks", {})
    waf_info = checks.get("9_waf_indicators", {})
    dns_info = checks.get("1_dns_resolution", {})
    tcp_info = checks.get("2_tcp_connectivity", {})
    http_info = checks.get("4_http_status", {})
    auth_info = checks.get("11_authentication_requirement", {})
    rate_info = checks.get("10_rate_limit_responses", {})
    captcha_info = checks.get("12_captcha_challenge_indicators", {})

    target_url = (target_info or {}).get("url") or "Target Scope"
    repo_url = (repo_info or {}).get("url") or ((repo_info or {}).get("zip_path") and "Source Code Archive") or "Repository"

    category = "INTERNAL_ENGINE_ERROR"
    error_code = "ERR_INTERNAL_PIPELINE"
    title = "Scan Execution Failed"
    summary = err_str
    technical_details = err_str
    remediation = "Inspect the scanner logs and re-launch the assessment."

    # 1. SSRF Filter Triggered
    if "ssrf" in err_lower or "private ip" in err_lower or "loopback" in err_lower or "metadata" in err_lower:
        category = "SSRF_PROTECTION_BLOCKED"
        error_code = "ERR_SSRF_SAFETY_VIOLATION"
        title = "Target Blocked by SSRF Protection Filter"
        summary = f"The requested target '{target_url}' resolved to a restricted internal, loopback, or cloud instance metadata address."
        technical_details = (
            f"Sentina security policies strictly forbid outbound security scanning to private RFC1918 subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), "
            f"loopback addresses (127.0.0.1, localhost), or cloud hypervisor metadata services (169.254.169.254). Details: {err_str}"
        )
        remediation = (
            "1. Ensure the target domain resolves to a publicly routable IP address.\n"
            "2. If testing in development, configure DEV_MODE in the Sentina backend configuration."
        )

    # 2. Target Not Verified / Authorization Missing
    elif "not verified" in err_lower or "target not verified" in err_lower or "unverified" in err_lower or "authorization" in err_lower:
        category = "TARGET_NOT_VERIFIED"
        error_code = "ERR_TARGET_UNVERIFIED"
        title = "Target Asset Authorization Required"
        summary = f"The target URL '{target_url}' is not marked as verified for active security testing."
        technical_details = (
            f"To prevent unauthorized testing of external third-party infrastructure, active blackbox fuzzing requires prior asset verification. "
            f"Details: {err_str}"
        )
        remediation = (
            "1. Navigate to the Assets Management tab.\n"
            "2. Select the asset corresponding to this target.\n"
            "3. Click 'Verify Asset' and select 'Analyst Authorization' or DNS verification token."
        )

    # 3. Missing Compulsory Prerequisites (Combined, DAST, or SAST)
    elif "compulsory" in err_lower or ("required" in err_lower and ("combined" in err_lower or "target" in err_lower or "source" in err_lower)):
        category = "PREREQUISITES_MISSING"
        error_code = "ERR_PREREQUISITES_INCOMPLETE"
        title = "Assessment Inputs Incomplete"
        summary = err_str
        technical_details = (
            f"The selected assessment mode requires specific inputs that were not supplied in the request. "
            f"Combined assessments require both a live web application URL and a source code repository or archive. Details: {err_str}"
        )
        remediation = (
            "1. Re-open the Launch Assessment modal.\n"
            "2. For Combined scans: provide BOTH a valid target URL AND a Git repository URL (or upload a .zip archive).\n"
            "3. For SAST scans: provide a Git repository URL or upload a source code archive."
        )

    # 4. GitHub Repo / Clone Failure
    elif "repository" in err_lower or "github" in err_lower or "clone" in err_lower or "zipball" in err_lower or "branch" in err_lower:
        category = "INVALID_REPOSITORY"
        error_code = "ERR_GIT_DOWNLOAD_FAILED"
        title = "Remote Repository Download Failed"
        summary = f"Could not retrieve or extract the Git repository from '{repo_url}'."
        technical_details = (
            f"The assessment worker attempted to fetch the repository archive from GitHub, but the server returned an error or inaccessible response. "
            f"Details: {err_str}"
        )
        remediation = (
            "1. Verify that the GitHub repository URL is correct and public.\n"
            "2. If the repository is private, provide a valid GitHub Personal Access Token (PAT) with 'repo' read permissions.\n"
            "3. Check that the specified branch (default: 'main') exists on the remote repository."
        )

    # 5. Target DNS / TCP Unreachable
    elif (
        "unreachable" in err_lower or 
        "dns resolution failed" in err_lower or 
        "connection refused" in err_lower or 
        "getaddrinfo failed" in err_lower or 
        "nameresolutionerror" in err_lower or
        dns_info.get("status") == "FAILED" or
        tcp_info.get("status") == "FAILED"
    ):
        category = "TARGET_UNREACHABLE"
        error_code = "ERR_DNS_TCP_UNREACHABLE"
        title = "Target Host Unreachable (DNS / TCP Failure)"
        summary = f"Target host '{target_url}' could not be resolved or did not respond on the target port."
        dns_err = dns_info.get("error") or "DNS lookup returned no valid IP records"
        tcp_err = tcp_info.get("error") or "TCP connection timed out / refused"
        technical_details = (
            f"Pre-scan diagnostics failed to establish network connectivity to the target.\n"
            f"• DNS Resolution: {dns_info.get('status', 'FAILED')} ({dns_err})\n"
            f"• TCP Connectivity: {tcp_info.get('status', 'FAILED')} ({tcp_err})\n"
            f"• Underlying Error: {err_str}"
        )
        remediation = (
            "1. Check if the target domain name is spelled correctly and active in DNS.\n"
            "2. Confirm that the target server is powered on, port 80/443 is open, and firewall rules permit inbound traffic.\n"
            "3. Try browsing to the target URL directly in a web browser to confirm it is online."
        )

    # 6. WAF / Bot Protection Block (403 Forbidden / CAPTCHA)
    elif (
        "403" in err_lower or 
        "waf" in err_lower or 
        "cloudflare" in err_lower or 
        "access denied" in err_lower or
        (waf_info.get("detected") and http_info.get("initial_status_code") == 403)
    ):
        waf_name = waf_info.get("provider") or "Web Application Firewall (WAF)"
        category = "WAF_ACCESS_DENIED"
        error_code = "ERR_WAF_BLOCK_403"
        title = f"Scanner Blocked by Upstream {waf_name}"
        summary = f"Scanner requests were blocked by {waf_name} with HTTP 403 Forbidden or anti-bot challenge responses."
        technical_details = (
            f"The target application is protected by {waf_name} ({waf_info.get('confidence', 'HIGH')} confidence).\n"
            f"• HTTP Status Received: {http_info.get('initial_status_code', 403)} Forbidden\n"
            f"• CAPTCHA / Challenge Detected: {captcha_info.get('detected', False)}\n"
            f"• Rate Limiting: {rate_info.get('detected', False)}\n"
            f"• Error Message: {err_str}"
        )
        remediation = (
            f"1. Add the Sentina scanner IP address to the allowlist / bypass list in your {waf_name} control panel.\n"
            "2. Alternatively, configure custom authorization headers or session cookies in the Launch Assessment tab."
        )

    # 7. Authentication Required (401 Unauthorized)
    elif "401" in err_lower or "unauthorized" in err_lower or auth_info.get("detected"):
        category = "AUTHENTICATION_REQUIRED"
        error_code = "ERR_AUTH_REQUIRED_401"
        title = "Authentication Credentials Required (HTTP 401)"
        summary = f"The target endpoint '{target_url}' requires valid session cookies or Bearer token authentication."
        technical_details = (
            f"The target responded with HTTP 401 Unauthorized or redirected to an authentication barrier without admitting unauthenticated crawlers.\n"
            f"• Auth Requirement Detected: {auth_info.get('detected', True)}\n"
            f"• Auth Mechanism: {auth_info.get('type', 'Session / Header')}\n"
            f"• Error Message: {err_str}"
        )
        remediation = (
            "1. Open the Launch Assessment modal.\n"
            "2. Under 'Authentication', set Auth Type to 'Cookie' and paste a valid session cookie (e.g. sessionid=...).\n"
            "3. Alternatively, provide a Bearer token or Basic authentication credentials."
        )

    # 8. Timeout
    elif "timeout" in err_lower or "timed out" in err_lower:
        category = "TIMEOUT_ERROR"
        error_code = "ERR_SCAN_TIMEOUT"
        title = "Scanner Execution Timed Out"
        summary = f"Scanning operations against '{target_url}' timed out before receiving a full response."
        technical_details = (
            f"The target took longer than the configured timeout threshold to respond to scanner probes. Details: {err_str}"
        )
        remediation = (
            "1. Verify target server load and latency.\n"
            "2. In the Launch Assessment modal, select 'Standard' or 'Safe' scan mode instead of 'Deep' mode."
        )

    # Extract recent relevant log lines for raw context
    recent_logs = []
    if logs and isinstance(logs, list):
        recent_logs = logs[-8:]

    return {
        "category": category,
        "error_code": error_code,
        "title": title,
        "summary": summary,
        "technical_details": technical_details,
        "remediation": remediation,
        "failed_stage": stage,
        "failed_at": datetime.now(timezone.utc).isoformat(),
        "target_url": target_url,
        "repo_url": repo_url,
        "raw_error": err_str,
        "http_status": http_info.get("initial_status_code"),
        "waf_provider": waf_info.get("provider") if waf_info.get("detected") else None,
        "dns_status": dns_info.get("status"),
        "tcp_status": tcp_info.get("status"),
        "tls_status": checks.get("3_tls_handshake", {}).get("status"),
        "recent_logs": recent_logs
    }

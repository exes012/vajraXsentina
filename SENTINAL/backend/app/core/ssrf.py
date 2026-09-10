import ipaddress
import os
import re
import socket
import urllib.parse
from typing import Tuple, List, Optional
from app.config import settings

# Cloud metadata and hazardous link-local endpoints
BLOCKED_METADATA_HOSTS = {
    "169.254.169.254",
    "metadata.google.internal",
    "metadata.internal",
    "instance-data",
    "100.100.100.200"
}

PRIVATE_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),      # Loopback
    ipaddress.ip_network("10.0.0.0/8"),       # Private Class A
    ipaddress.ip_network("172.16.0.0/12"),    # Private Class B
    ipaddress.ip_network("192.168.0.0/16"),   # Private Class C
    ipaddress.ip_network("169.254.0.0/16"),   # Link-Local / Cloud Metadata
    ipaddress.ip_network("0.0.0.0/8"),        # Current network
    ipaddress.ip_network("224.0.0.0/4"),      # Multicast
    ipaddress.ip_network("240.0.0.0/4"),      # Reserved
    ipaddress.ip_network("::1/128"),          # IPv6 Loopback
    ipaddress.ip_network("fc00::/7"),         # IPv6 Unique Local
    ipaddress.ip_network("fe80::/10"),        # IPv6 Link-Local
]

def is_dev_mode() -> bool:
    """Check if the system is running in local development mode."""
    env = os.getenv("SENTINA_ENV", settings.ENVIRONMENT).lower()
    return env in ["development", "dev", "test", "local"]

def normalize_target_url(raw_url: str) -> Tuple[str, str, int, str]:
    """
    Validate and normalize target URL.
    Returns (normalized_url, hostname, port, protocol).
    Raises ValueError on invalid/malformed URL.
    """
    if not raw_url or not isinstance(raw_url, str):
        raise ValueError("Target URL must be a non-empty string.")

    cleaned = raw_url.strip()
    if not cleaned:
        raise ValueError("Target URL cannot be blank.")

    # Prevent whitespace / control characters injection
    if re.search(r'[\r\n\t\x00-\x1f]', cleaned):
        raise ValueError("Target URL contains invalid control characters.")

    # Check for explicit scheme
    if "://" in cleaned:
        scheme = cleaned.split("://")[0].lower()
        if scheme not in ["http", "https"]:
            raise ValueError(f"Invalid URL scheme '{scheme}'. Only 'http://' and 'https://' are supported.")
    else:
        # Automatically prefix protocol if missing
        if is_dev_mode() and any(k in cleaned.lower() for k in ["localhost", "127.0.0.1", ":5173", ":3000", ":8000", ":8080"]):
            cleaned = f"http://{cleaned}"
        else:
            cleaned = f"https://{cleaned}"

    parsed = urllib.parse.urlparse(cleaned)

    # Disallow unsupported schemes (e.g. file, gopher, ftp, dict, ldap, javascript)
    if parsed.scheme.lower() not in ["http", "https"]:
        raise ValueError(f"Invalid URL scheme '{parsed.scheme}'. Only 'http://' and 'https://' are supported.")

    # Disallow embedded credentials (e.g., http://admin:pass@host)
    if parsed.username or parsed.password:
        raise ValueError("Embedded credentials in target URL are prohibited for security.")

    hostname = (parsed.hostname or "").strip().lower()
    if not hostname:
        raise ValueError("Target URL does not contain a valid hostname.")

    # Disallow dangerous characters in hostname
    if re.search(r'[;|<>&`$!\\"\']', hostname):
        raise ValueError("Target hostname contains disallowed characters.")

    protocol = parsed.scheme.lower()
    default_port = 443 if protocol == "https" else 80
    port = parsed.port or default_port

    # Rebuild normalized path and query
    path = parsed.path or "/"
    if not path.startswith("/"):
        path = f"/{path}"
    
    # Remove trailing slash if root path for clean standard representation
    query = f"?{parsed.query}" if parsed.query else ""
    
    # Build canonical normalized URL
    if (protocol == "http" and port == 80) or (protocol == "https" and port == 443):
        netloc = hostname
    else:
        netloc = f"{hostname}:{port}"

    canonical_url = f"{protocol}://{netloc}{path}{query}"
    if canonical_url.endswith("/") and path == "/":
        canonical_url = canonical_url[:-1]

    return canonical_url, hostname, port, protocol

def is_ip_private_or_restricted(ip_str: str) -> bool:
    """Check if an IP address belongs to private, loopback, or reserved address spaces."""
    try:
        ip = ipaddress.ip_address(ip_str)
        if ip.is_loopback or ip.is_private or ip.is_link_local or ip.is_multicast or ip.is_reserved or ip.is_unspecified:
            return True
        for net in PRIVATE_NETWORKS:
            if ip in net:
                return True
        return False
    except ValueError:
        return True

def validate_ssrf_safety(hostname: str, port: int) -> Tuple[bool, Optional[str], List[str]]:
    """
    Validate target host against SSRF protection policies.
    Returns (is_safe, error_message, resolved_ips).
    """
    # 1. Check blocked metadata hosts
    if hostname.lower() in BLOCKED_METADATA_HOSTS:
        return False, f"Access to cloud metadata endpoint '{hostname}' is strictly prohibited.", []

    # 2. DNS resolution check
    resolved_ips: List[str] = []
    try:
        addr_info = socket.getaddrinfo(hostname, port, socket.AF_UNSPEC, socket.SOCK_STREAM)
        for item in addr_info:
            sockaddr = item[4]
            ip_str = sockaddr[0]
            if ip_str not in resolved_ips:
                resolved_ips.append(ip_str)
    except socket.gaierror as e:
        return False, f"DNS resolution failed for host '{hostname}': {str(e)}", []
    except Exception as e:
        return False, f"Failed to resolve host '{hostname}': {str(e)}", []

    if not resolved_ips:
        return False, f"No IP addresses resolved for host '{hostname}'.", []

    # 3. Check resolved IP addresses against private networks
    for ip in resolved_ips:
        if ip in BLOCKED_METADATA_HOSTS:
            return False, f"Resolved IP '{ip}' is a restricted cloud metadata service.", resolved_ips

        if is_ip_private_or_restricted(ip):
            if is_dev_mode():
                # Allow in development mode for explicit local testing
                continue
            else:
                return False, f"Target host '{hostname}' resolved to private/internal IP '{ip}'. Direct scanning of internal infrastructure is prohibited in production mode.", resolved_ips

    return True, None, resolved_ips

def safe_command_args(*args: str) -> List[str]:
    """
    Ensure command line arguments are safely structured for subprocess execution.
    Prevents shell concatenation vulnerabilities by enforcing list-based arguments.
    """
    clean_args = []
    for arg in args:
        if isinstance(arg, str):
            clean_args.append(arg)
        elif isinstance(arg, (int, float)):
            clean_args.append(str(arg))
        else:
            clean_args.append(str(arg))
    return clean_args

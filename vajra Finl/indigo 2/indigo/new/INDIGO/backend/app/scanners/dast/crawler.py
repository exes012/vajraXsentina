import re
import urllib.parse
from typing import List, Set, Dict, Any
import httpx
import asyncio

class CrawledEndpoint:
    def __init__(self, url: str, method: str = "GET", params: List[str] = None, form_inputs: List[Dict[str, str]] = None):
        self.url = url
        self.method = method
        self.params = params or []
        self.form_inputs = form_inputs or []

async def crawl_target(base_url: str, max_pages: int = 8, custom_headers: Dict[str, str] = None, status_callback = None) -> List[CrawledEndpoint]:
    """Fast, lightweight asynchronous web crawler to discover endpoints, links, and forms."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Sentinal-ZAP-Scanner/2.14",
        **(custom_headers or {})
    }
    
    parsed_base = urllib.parse.urlparse(base_url)
    base_domain = parsed_base.netloc
    
    discovered_endpoints: Dict[str, CrawledEndpoint] = {}
    visited_urls: Set[str] = set()
    queue: List[str] = [base_url]

    # Always register base URL immediately
    query_params = list(urllib.parse.parse_qs(parsed_base.query).keys())
    discovered_endpoints[base_url] = CrawledEndpoint(url=base_url, method="GET", params=query_params)

    async with httpx.AsyncClient(headers=headers, timeout=httpx.Timeout(3.0, connect=2.0), follow_redirects=True, verify=False) as client:
        while queue and len(visited_urls) < max_pages:
            current_url = queue.pop(0)
            if current_url in visited_urls:
                continue

            visited_urls.add(current_url)
            parsed_current = urllib.parse.urlparse(current_url)

            # Record GET endpoint and query parameters
            q_params = list(urllib.parse.parse_qs(parsed_current.query).keys())
            discovered_endpoints[current_url] = CrawledEndpoint(
                url=current_url,
                method="GET",
                params=q_params
            )

            try:
                resp = await client.get(current_url)
                if status_callback:
                    try:
                        status_callback(resp.status_code, current_url)
                    except Exception:
                        pass

                if resp.status_code >= 400 or "text/html" not in resp.headers.get("content-type", "").lower():
                    continue

                html = resp.text
                
                # Extract <a> links
                href_matches = re.findall(r'<a\s+(?:[^>]*?\s+)?href=[\'"]([^\'"]+)[\'"]', html, re.IGNORECASE)
                for href in href_matches:
                    resolved = urllib.parse.urljoin(current_url, href)
                    resolved_parsed = urllib.parse.urlparse(resolved)
                    if resolved_parsed.netloc == base_domain and resolved not in visited_urls:
                        clean_url = urllib.parse.urlunparse(resolved_parsed._replace(fragment=""))
                        if clean_url not in visited_urls and clean_url not in queue and len(queue) < 15:
                            queue.append(clean_url)

                # Extract <form> actions and inputs
                forms = re.findall(r'<form\s+([^>]*?)>(.*?)</form>', html, re.IGNORECASE | re.DOTALL)
                for form_attr, form_body in forms:
                    action_m = re.search(r'action=[\'"]([^\'"]+)[\'"]', form_attr, re.IGNORECASE)
                    method_m = re.search(r'method=[\'"]([^\'"]+)[\'"]', form_attr, re.IGNORECASE)
                    
                    form_action = action_m.group(1) if action_m else current_url
                    form_method = method_m.group(1).upper() if method_m else "GET"
                    target_action_url = urllib.parse.urljoin(current_url, form_action)

                    input_names = re.findall(r'<input\s+[^>]*?name=[\'"]([^\'"]+)[\'"]', form_body, re.IGNORECASE)
                    form_inputs = [{"name": name} for name in input_names]

                    if target_action_url not in discovered_endpoints:
                        discovered_endpoints[target_action_url] = CrawledEndpoint(
                            url=target_action_url,
                            method=form_method,
                            params=input_names,
                            form_inputs=form_inputs
                        )

            except Exception:
                continue

    return list(discovered_endpoints.values())

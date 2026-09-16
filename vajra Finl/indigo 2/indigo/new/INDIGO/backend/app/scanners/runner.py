import asyncio
import time
from typing import Dict, Any, List, Optional
from pathlib import Path

from app.scanners.base import ScannerResult, ScannerAdapter, RawFinding
from app.scanners.sast import SemgrepAdapter
from app.scanners.sca import OSVAdapter
from app.scanners.secrets import GitleaksAdapter
from app.scanners.dast import ZAPAdapter, WapitiAdapter, NiktoAdapter
from app.scanners.web import NucleiAdapter, SecurityHeadersAdapter, HTTPDiscoveryAdapter
from app.scanners.ssl import TestSSLAdapter

class ScannerOrchestrator:
    def __init__(self):
        self.adapters: Dict[str, ScannerAdapter] = {
            "sast": SemgrepAdapter(),
            "sca": OSVAdapter(),
            "secrets": GitleaksAdapter(),
            "discovery": HTTPDiscoveryAdapter(),
            "dast": ZAPAdapter(),
            "nuclei": NucleiAdapter(),
            "wapiti": WapitiAdapter(),
            "nikto": NiktoAdapter(),
            "headers": SecurityHeadersAdapter(),
            "ssl": TestSSLAdapter()
        }

    async def execute_scanner(self, adapter_key: str, target: Any) -> ScannerResult:
        adapter = self.adapters.get(adapter_key)
        if not adapter:
            return ScannerResult(
                scanner_name=adapter_key.upper(),
                source="UNKNOWN",
                status="SKIPPED",
                error_message=f"Scanner adapter '{adapter_key}' not found."
            )
        try:
            # Fast watchdog timeout (12s) to prevent hanging scanners
            return await asyncio.wait_for(adapter.run(target), timeout=12.0)
        except asyncio.TimeoutError:
            return ScannerResult(
                scanner_name=adapter.name,
                source=adapter.source,
                status="FAILED",
                error_message=f"Scanner {adapter.name} timed out after 12s watchdog limit.",
                metadata={"telemetry": dict(getattr(adapter, "telemetry", {}))}
            )
        except Exception as e:
            return ScannerResult(
                scanner_name=adapter.name,
                source=adapter.source,
                status="FAILED",
                error_message=f"Unhandled exception in {adapter.name}: {str(e)}"
            )

    async def run_assessment_modules(
        self,
        modules_config: Dict[str, bool],
        repo_or_code_target: Any = None,
        live_target: Any = None,
        progress_callback = None,
        is_cancelled_func = None
    ) -> List[ScannerResult]:
        """Run all configured assessment modules with parallel concurrency and rapid fault tolerance."""
        results: List[ScannerResult] = []

        # Check early cancellation
        if is_cancelled_func and is_cancelled_func():
            return results

        async def _run_single_module(key: str, target: Any) -> ScannerResult:
            if is_cancelled_func and is_cancelled_func():
                return ScannerResult(scanner_name=key.upper(), source="SYSTEM", status="SKIPPED", error_message="Cancelled by user.")
            if progress_callback:
                try:
                    await progress_callback(key, "RUNNING")
                except Exception:
                    pass
            res = await self.execute_scanner(key, target)
            if progress_callback:
                try:
                    await progress_callback(key, res.status, res.error_message)
                except Exception:
                    pass
            return res

        # 1. Code / Repo Scanners (SAST, SCA, SECRETS) - Run in PARALLEL
        code_tasks = []
        if repo_or_code_target:
            if modules_config.get("sast", True):
                code_tasks.append(_run_single_module("sast", repo_or_code_target))
            if modules_config.get("sca", True):
                code_tasks.append(_run_single_module("sca", repo_or_code_target))
            if modules_config.get("secrets", True):
                code_tasks.append(_run_single_module("secrets", repo_or_code_target))

        # 2. Live Web / DAST Scanners
        web_tasks = []
        if live_target:
            # If discovery is requested, run discovery first quickly
            if modules_config.get("discovery", True):
                disc_res = await _run_single_module("discovery", live_target)
                results.append(disc_res)

            if is_cancelled_func and is_cancelled_func():
                return results

            # Run headers, ssl, nuclei, dast, wapiti, nikto concurrently
            for key in ["headers", "ssl", "nuclei", "dast", "wapiti", "nikto"]:
                if modules_config.get(key, True):
                    web_tasks.append(_run_single_module(key, live_target))

        # Gather remaining parallel tasks (Code scanners + Web scanners)
        all_parallel_tasks = code_tasks + web_tasks
        if all_parallel_tasks:
            parallel_results = await asyncio.gather(*all_parallel_tasks, return_exceptions=True)
            for item in parallel_results:
                if isinstance(item, ScannerResult):
                    results.append(item)
                elif isinstance(item, Exception):
                    results.append(ScannerResult(
                        scanner_name="PARALLEL_TASK",
                        source="SYSTEM",
                        status="FAILED",
                        error_message=str(item)
                    ))

        return results

    def aggregate_dast_telemetry(self, results: List[ScannerResult]) -> Dict[str, Any]:
        """Aggregate runtime HTTP request distribution, URL coverage, and engine findings."""
        total_attempted = 0
        total_successful = 0
        total_blocked = 0
        status_distribution: Dict[str, int] = {}
        scanner_errors: List[Dict[str, str]] = []
        urls_discovered = 0
        urls_scanned = 0
        engine_breakdown: Dict[str, Any] = {}

        zap_alerts = 0
        nuclei_matches = 0
        wapiti_findings = 0
        nikto_findings = 0

        for res in results:
            meta = res.metadata or {}
            telem = meta.get("telemetry", {})

            # Request counts
            att = telem.get("requests_attempted", 0)
            succ = telem.get("requests_successful", 0)
            blk = telem.get("requests_blocked", 0)
            
            total_attempted += att
            total_successful += succ
            total_blocked += blk

            # Status distribution
            for status_code_str, cnt in telem.get("status_distribution", {}).items():
                status_distribution[status_code_str] = status_distribution.get(status_code_str, 0) + cnt

            # URL counts
            disc = telem.get("urls_discovered", 0)
            scn = telem.get("urls_scanned", 0)
            if disc > urls_discovered:
                urls_discovered = disc
            urls_scanned += scn

            # Scanner errors
            for err in telem.get("scanner_errors", []):
                scanner_errors.append({"scanner": res.scanner_name, "error": str(err)})
            if res.status == "FAILED" and res.error_message:
                scanner_errors.append({"scanner": res.scanner_name, "error": res.error_message})

            # Engine stats
            f_count = len(res.findings)
            s_name = res.scanner_name.upper()
            engine_breakdown[s_name] = {
                "status": res.status,
                "duration_ms": res.duration_ms,
                "findings_count": f_count,
                "requests_attempted": att,
                "requests_blocked": blk
            }

            if "ZAP" in s_name:
                zap_alerts += f_count
            elif "NUCLEI" in s_name:
                nuclei_matches += f_count
            elif "WAPITI" in s_name:
                wapiti_findings += f_count
            elif "NIKTO" in s_name:
                nikto_findings += f_count

        # Compute granular status buckets
        count_2xx = sum(v for k, v in status_distribution.items() if k.isdigit() and 200 <= int(k) < 300)
        count_3xx = sum(v for k, v in status_distribution.items() if k.isdigit() and 300 <= int(k) < 400)
        count_4xx = sum(v for k, v in status_distribution.items() if k.isdigit() and 400 <= int(k) < 500)
        count_5xx = sum(v for k, v in status_distribution.items() if k.isdigit() and 500 <= int(k) < 600)
        count_401 = status_distribution.get("401", 0)
        count_403 = status_distribution.get("403", 0)
        count_429 = status_distribution.get("429", 0)

        if urls_discovered == 0 and urls_scanned > 0:
            urls_discovered = urls_scanned
        if urls_scanned == 0 and urls_discovered > 0:
            urls_scanned = urls_discovered

        return {
            "requests_attempted": total_attempted,
            "requests_successful": total_successful,
            "requests_blocked": total_blocked,
            "status_distribution": status_distribution,
            "count_2xx": count_2xx,
            "count_3xx": count_3xx,
            "count_4xx": count_4xx,
            "count_5xx": count_5xx,
            "count_401": count_401,
            "count_403": count_403,
            "count_429": count_429,
            "scanner_errors": scanner_errors,
            "crawlable_urls": urls_discovered,
            "urls_scanned": urls_scanned,
            "zap_alerts": zap_alerts,
            "nuclei_matches": nuclei_matches,
            "wapiti_findings": wapiti_findings,
            "nikto_findings": nikto_findings,
            "engine_breakdown": engine_breakdown
        }

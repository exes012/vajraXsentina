import html as py_html
import json
import os
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from jinja2 import Template
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from app.config import settings
from app.pipeline.normalizer import NormalizedFinding
from app.pipeline.correlator import CorrelatedRiskItem
from app.ai.base import AIAnalysisResult

HTML_REPORT_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sentinal Security Assessment Report - {{ project_name }}</title>
    <style>
        :root {
            --bg-primary: #0a0e17;
            --bg-card: #121826;
            --bg-elevated: #1a2234;
            --border-color: #243048;
            --text-primary: #f0f4f8;
            --text-secondary: #94a3b8;
            --accent-cyan: #00f2fe;
            --accent-blue: #4facfe;
            --crit-color: #ff3366;
            --high-color: #ff9900;
            --med-color: #ffcc00;
            --low-color: #00ccff;
            --info-color: #8899a6;
            --success-color: #10b981;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            padding: 40px 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        header {
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 24px;
            margin-bottom: 36px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo { font-size: 28px; font-weight: 800; letter-spacing: 2px; background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .badge-tag { background: #1e293b; color: var(--accent-cyan); padding: 4px 12px; border-radius: 9999px; font-size: 13px; border: 1px solid rgba(0, 242, 254, 0.3); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 36px; }
        .card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        .card-title { font-size: 12px; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 8px; letter-spacing: 1px; }
        .card-value { font-size: 28px; font-weight: 700; }
        .score-val { color: var(--accent-cyan); }
        .crit-val { color: var(--crit-color); }
        .high-val { color: var(--high-color); }
        .med-val { color: var(--med-color); }
        .section-title { font-size: 20px; font-weight: 700; margin-bottom: 16px; border-left: 4px solid var(--accent-cyan); padding-left: 12px; }
        .prose { color: #cbd5e1; margin-bottom: 36px; font-size: 14.5px; }
        .prose p { margin-bottom: 12px; }
        .corr-card { background: #191428; border: 1px solid #7c3aed; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .corr-title { font-size: 17px; font-weight: 700; color: #c084fc; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; }
        .finding-table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 36px; background: var(--bg-card); border-radius: 12px; overflow: hidden; border: 1px solid var(--border-color); }
        .finding-table th { background: var(--bg-elevated); padding: 12px 16px; text-align: left; font-size: 12px; text-transform: uppercase; color: var(--text-secondary); border-bottom: 1px solid var(--border-color); }
        .finding-table td { padding: 12px 16px; font-size: 13.5px; border-bottom: 1px solid var(--border-color); vertical-align: top; }
        .sev-badge { display: inline-block; padding: 3px 8px; border-radius: 5px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .sev-CRITICAL { background: rgba(255, 51, 102, 0.2); color: var(--crit-color); border: 1px solid var(--crit-color); }
        .sev-HIGH { background: rgba(255, 153, 0, 0.2); color: var(--high-color); border: 1px solid var(--high-color); }
        .sev-MEDIUM { background: rgba(255, 204, 0, 0.2); color: var(--med-color); border: 1px solid var(--med-color); }
        .sev-LOW { background: rgba(0, 204, 255, 0.2); color: var(--low-color); border: 1px solid var(--low-color); }
        .sev-INFO { background: rgba(136, 153, 166, 0.2); color: var(--info-color); border: 1px solid var(--info-color); }
        .engine-pill { display: inline-block; background: #0f172a; border: 1px solid #334155; color: #38bdf8; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-right: 4px; }
        code { background: #0f172a; color: #38bdf8; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 12px; }
        pre { background: #090d16; border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; overflow-x: auto; color: #a5f3fc; font-family: monospace; font-size: 12.5px; margin-top: 8px; }
        footer { border-top: 1px solid var(--border-color); padding-top: 24px; text-align: center; color: var(--text-secondary); font-size: 12px; margin-top: 60px; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div>
                <div class="logo">SENTINAL</div>
                <p style="color: var(--text-secondary); font-size: 13.5px; margin-top: 4px;">Unified SAST + SCA + DAST Security Assessment Report</p>
            </div>
            <div style="text-align: right;">
                <span class="badge-tag">{{ assessment.assessment_type | upper }} SCAN • {{ assessment.scan_mode or 'STANDARD' }}</span>
                <p style="color: var(--text-secondary); font-size: 12px; margin-top: 6px;">Generated: {{ generated_at }}</p>
            </div>
        </header>

        <!-- Target Scope & Authorization Details -->
        <div class="card" style="margin-bottom: 24px; background: #0b1120; border: 1px solid #1e293b;">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                <div>
                    <span style="font-size: 11px; color: #64748b; text-transform: uppercase;">Assessment Target</span>
                    <div style="font-size: 16px; font-weight: 700; color: #f8fafc; font-family: monospace;">{{ assessment.target or assessment.repository }}</div>
                </div>
                <div>
                    <span style="font-size: 11px; color: #64748b; text-transform: uppercase;">Authorization Status</span>
                    <div style="font-size: 14px; font-weight: 700; color: {% if assessment.authorization_status == 'VERIFIED' %}#10b981{% else %}#fbbf24{% endif %};">
                        ● {{ assessment.authorization_status }}
                    </div>
                </div>
                <div>
                    <span style="font-size: 11px; color: #64748b; text-transform: uppercase;">DAST Coverage Status</span>
                    <div style="font-size: 14px; font-weight: 700; color: {% if assessment.coverage_status == 'FULL COVERAGE' %}#10b981{% elif assessment.coverage_status == 'LIMITED COVERAGE' %}#f59e0b{% else %}#ef4444{% endif %};">
                        {{ assessment.coverage_status }} ({{ assessment.dast_coverage_score or 0 }}%)
                    </div>
                </div>
                <div>
                    <span style="font-size: 11px; color: #64748b; text-transform: uppercase;">Scan Mode</span>
                    <div style="font-size: 14px; font-weight: 700; color: #38bdf8;">{{ assessment.scan_mode or 'STANDARD' }}</div>
                </div>
            </div>
        </div>

        <!-- Executive Metrics -->
        <div class="grid">
            <div class="card">
                <div class="card-title">Security Risk Score</div>
                <div class="card-value score-val">{{ assessment.overall_risk_score }}/100</div>
            </div>
            <div class="card">
                <div class="card-title">DAST Coverage Score</div>
                <div class="card-value" style="color: #38bdf8;">{{ assessment.dast_coverage_score or 0 }}%</div>
            </div>
            <div class="card">
                <div class="card-title">Critical Flaws</div>
                <div class="card-value crit-val">{{ assessment.critical_count }}</div>
            </div>
            <div class="card">
                <div class="card-title">High Flaws</div>
                <div class="card-value high-val">{{ assessment.high_count }}</div>
            </div>
            <div class="card">
                <div class="card-title">Total Findings</div>
                <div class="card-value">{{ assessment.total_findings }}</div>
            </div>
        </div>

        <!-- Target Connectivity & Blocking Diagnostics -->
        {% if assessment.connectivity_diagnostics and assessment.connectivity_diagnostics.checks %}
        <h2 class="section-title">1. Target Connectivity & Blocking Diagnostics</h2>
        <div class="card" style="margin-bottom: 28px; background: #0b1120; border: 1px solid #1e293b;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 16px;">
                <div>
                    <span class="card-title">Reachability</span>
                    <div style="font-size: 16px; font-weight: 700; color: {% if assessment.connectivity_diagnostics.reachability == 'REACHABLE' %}#10b981{% else %}#ef4444{% endif %};">
                        ✓ {{ assessment.connectivity_diagnostics.reachability }}
                    </div>
                </div>
                <div>
                    <span class="card-title">TLS Handshake</span>
                    <div style="font-size: 16px; font-weight: 700; color: #38bdf8;">
                        ✓ {{ assessment.connectivity_diagnostics.checks['3_tls_handshake'].protocol or 'N/A' }}
                    </div>
                </div>
                <div>
                    <span class="card-title">Application Access</span>
                    <div style="font-size: 16px; font-weight: 700; color: {% if assessment.connectivity_diagnostics.access_level == 'UNRESTRICTED' %}#10b981{% else %}#f59e0b{% endif %};">
                        {% if assessment.connectivity_diagnostics.access_level == 'UNRESTRICTED' %}✓ FULL{% else %}⚠ {{ assessment.connectivity_diagnostics.access_level }}{% endif %}
                    </div>
                </div>
                <div>
                    <span class="card-title">Finding Confidence</span>
                    <div style="font-size: 16px; font-weight: 700; color: {% if assessment.finding_confidence == 'FULL' %}#10b981{% else %}#f59e0b{% endif %};">
                        {{ assessment.finding_confidence }}
                    </div>
                </div>
            </div>

            <!-- WAF / Protection Banner -->
            <div style="background: rgba(0,0,0,0.3); border: 1px solid #334155; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
                <div style="font-size: 13.5px; font-weight: 700; color: #f8fafc; margin-bottom: 6px;">
                    Possible WAF / Bot Protection: 
                    {% if assessment.connectivity_diagnostics.checks['9_waf_indicators'].detected %}
                    <span style="color: #f59e0b;">{{ assessment.connectivity_diagnostics.checks['9_waf_indicators'].provider }} ({{ assessment.connectivity_diagnostics.checks['9_waf_indicators'].confidence }} Confidence)</span>
                    {% else %}
                    <span style="color: #10b981;">None Detected</span>
                    {% endif %}
                </div>
                {% if assessment.connectivity_diagnostics.checks['9_waf_indicators'].evidence %}
                <ul style="padding-left: 20px; font-size: 12px; color: #94a3b8;">
                    {% for ev in assessment.connectivity_diagnostics.checks['9_waf_indicators'].evidence %}
                    <li>{{ ev }}</li>
                    {% endfor %}
                </ul>
                {% endif %}
            </div>

            <!-- HTTP Status Distribution -->
            {% if assessment.coverage_telemetry %}
            <div style="font-size: 12px; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; font-weight: 700;">HTTP Response Distribution & Scanner Telemetry</div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;">
                <span class="badge-tag">2xx OK: {{ assessment.coverage_telemetry.count_2xx }}</span>
                <span class="badge-tag">3xx Redirect: {{ assessment.coverage_telemetry.count_3xx }}</span>
                <span class="badge-tag">401 Auth: {{ assessment.coverage_telemetry.count_401 }}</span>
                <span class="badge-tag" style="border-color: #ef4444; color: #f87171;">403 Blocked: {{ assessment.coverage_telemetry.count_403 }}</span>
                <span class="badge-tag" style="border-color: #f59e0b; color: #fbbf24;">429 Rate Limit: {{ assessment.coverage_telemetry.count_429 }}</span>
                <span class="badge-tag">5xx Error: {{ assessment.coverage_telemetry.count_5xx }}</span>
            </div>
            <div style="font-size: 12.5px; color: #cbd5e1;">
                <strong>Requests:</strong> {{ assessment.coverage_telemetry.requests_attempted }} attempted | {{ assessment.coverage_telemetry.requests_successful }} successful | {{ assessment.coverage_telemetry.requests_blocked }} blocked | <strong>URLs:</strong> {{ assessment.coverage_telemetry.crawlable_urls }} discovered, {{ assessment.coverage_telemetry.urls_scanned }} scanned
            </div>
            {% endif %}

            <div style="background: rgba(56, 189, 248, 0.1); border-left: 3px solid #38bdf8; padding: 10px 14px; border-radius: 4px; margin-top: 14px; font-size: 12.5px; color: #e0f2fe;">
                <strong>Diagnostic Recommendation:</strong> {{ assessment.connectivity_diagnostics.diagnostic_recommendation }}
            </div>
        </div>
        {% endif %}

        <!-- Executive Summary -->
        <h2 class="section-title">2. Executive Summary</h2>
        <div class="card prose" style="margin-bottom: 36px;">
            <p>{{ ai_analysis.executive_summary | replace('\n', '<br>') }}</p>
        </div>

        <!-- Correlated Risks -->
        {% if correlated_risks %}
        <h2 class="section-title">2. Correlated Multi-Vector Attack Chains</h2>
        {% for cr in correlated_risks %}
        <div class="corr-card">
            <div class="corr-title">
                <span>{{ cr.title }}</span>
                <span class="sev-badge sev-{{ cr.risk_level }}">{{ cr.risk_level }} ({{ cr.confidence }} CONFIDENCE)</span>
            </div>
            <p style="color: #cbd5e1; margin-bottom: 12px; font-size: 13.5px;">{{ cr.description }}</p>
            <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px; font-size: 13px; margin-bottom: 10px;">
                <strong>Explanation:</strong><br>{{ cr.explanation | replace('\n', '<br>') }}
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px; font-size: 13px; margin-bottom: 10px;">
                <strong>Attack Scenario:</strong><br>{{ cr.attack_scenario }}
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px; font-size: 13px;">
                <strong>Recommended Fix:</strong><br>{{ cr.remediation | replace('\n', '<br>') }}
            </div>
        </div>
        {% endfor %}
        {% endif %}

        <!-- Findings Inventory -->
        <h2 class="section-title">3. Comprehensive Findings Inventory</h2>
        <table class="finding-table">
            <thead>
                <tr>
                    <th style="width: 105px;">Severity</th>
                    <th style="width: 130px;">Detected By</th>
                    <th>Vulnerability Details</th>
                    <th>Evidence & Remediation</th>
                </tr>
            </thead>
            <tbody>
                {% for f in findings %}
                <tr>
                    <td>
                        <span class="sev-badge sev-{{ f.severity }}">{{ f.severity }}</span>
                        <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">{{ f.confidence }} Conf.</div>
                        <div style="font-size: 11px; font-weight: 700; color: #ff3366; margin-top: 4px;">Risk: {{ f.risk_score }}/100</div>
                    </td>
                    <td>
                        <span class="badge-tag" style="font-size: 10px; padding: 2px 6px;">{{ f.source }}</span>
                        <div style="margin-top: 6px;">
                            {% for sc in f.all_scanners %}
                            <span class="engine-pill">{{ sc }}</span>
                            {% endfor %}
                        </div>
                        {% if f.blast_radius %}
                        <div style="margin-top: 6px;">
                            <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.35); font-weight: 700;">
                                🔥 {{ f.blast_radius }}
                            </span>
                        </div>
                        {% endif %}
                    </td>
                    <td>
                        <strong style="color: #f1f5f9; font-size: 14.5px;">{{ f.title }}</strong>
                        <p style="color: var(--text-secondary); font-size: 12.5px; margin-top: 4px;">{{ f.description }}</p>
                        
                        {% if f.threat_scenario %}
                        <div style="margin-top: 8px; padding: 8px 10px; border-radius: 6px; background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; font-size: 12px; color: #fca5a5;">
                            <strong>Threat Scenario:</strong> {{ f.threat_scenario }}
                        </div>
                        {% endif %}

                        {% if f.potential_impact %}
                        <div style="margin-top: 6px; font-size: 11.5px; color: #cbd5e1; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                            {% if f.potential_impact.confidentiality %}<div><span style="color: #38bdf8;">Confidentiality:</span> {{ f.potential_impact.confidentiality }}</div>{% endif %}
                            {% if f.potential_impact.integrity %}<div><span style="color: #f59e0b;">Integrity:</span> {{ f.potential_impact.integrity }}</div>{% endif %}
                            {% if f.potential_impact.business_impact %}<div style="grid-column: span 2;"><span style="color: #ef4444;">Business:</span> {{ f.potential_impact.business_impact }}</div>{% endif %}
                        </div>
                        {% endif %}

                        {% if f.file %}
                        <div style="margin-top: 6px;"><code>{{ f.file }}:{{ f.line }}</code></div>
                        {% elif f.endpoint %}
                        <div style="margin-top: 6px;"><code>Endpoint: {{ f.endpoint }} {% if f.parameter %}(Param: {{ f.parameter }}){% endif %}</code></div>
                        {% endif %}
                        {% if f.cwe %}
                        <div style="margin-top: 6px; font-size: 11.5px; color: #38bdf8;">CWE: {{ f.cwe | join(', ') }}</div>
                        {% endif %}
                    </td>
                    <td>
                        {% if f.evidence %}
                        <div style="font-size: 12.5px; margin-bottom: 6px;"><strong>Evidence:</strong> {{ f.evidence }}</div>
                        {% endif %}
                        {% if f.code_snippet %}
                        <pre><code>{{ f.code_snippet }}</code></pre>
                        {% endif %}
                        {% if f.remediation %}
                        <div style="font-size: 12.5px; margin-top: 6px; color: #a7f3d0;"><strong>Fix:</strong> {{ f.remediation }}</div>
                        {% endif %}
                    </td>
                </tr>
                {% endfor %}
            </tbody>
        </table>

        <!-- Technical Remediation Playbook -->
        <h2 class="section-title">4. Strategic Remediation Playbook</h2>
        <div class="card prose">
            <p>{{ ai_analysis.remediation_playbook | replace('\n', '<br>') }}</p>
        </div>

        <footer>
            <p>Sentinal Security Assessment Platform • Confidential Audit Report • Generated {{ generated_at }}</p>
        </footer>
    </div>
</body>
</html>
"""

class ReportGenerator:
    def __init__(self, reports_dir: Path = settings.REPORTS_DIR):
        self.reports_dir = reports_dir
        self.reports_dir.mkdir(parents=True, exist_ok=True)

    def generate_json_report(
        self,
        assessment_meta: Dict[str, Any],
        findings: List[NormalizedFinding],
        correlated_risks: List[CorrelatedRiskItem],
        ai_analysis: AIAnalysisResult
    ) -> Path:
        """Generate machine-readable JSON security report."""
        report_id = assessment_meta.get("id", "report")
        file_path = self.reports_dir / f"sentinal_report_{report_id}.json"

        data = {
            "sentinal_version": "1.0.0",
            "report_id": str(report_id),
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "assessment": assessment_meta,
            "overall_risk_score": assessment_meta.get("overall_risk_score", 0.0),
            "summary": {
                "critical": assessment_meta.get("critical_count", 0),
                "high": assessment_meta.get("high_count", 0),
                "medium": assessment_meta.get("medium_count", 0),
                "low": assessment_meta.get("low_count", 0),
                "info": assessment_meta.get("info_count", 0),
                "total_findings": len(findings),
                "correlated_risks_count": len(correlated_risks)
            },
            "ai_analysis": ai_analysis.model_dump(),
            "correlated_risks": [cr.model_dump() for cr in correlated_risks],
            "findings": [f.model_dump() for f in findings]
        }

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        return file_path

    def generate_html_report(
        self,
        assessment_meta: Dict[str, Any],
        findings: List[NormalizedFinding],
        correlated_risks: List[CorrelatedRiskItem],
        ai_analysis: AIAnalysisResult
    ) -> Path:
        """Generate interactive HTML security report."""
        report_id = assessment_meta.get("id", "report")
        file_path = self.reports_dir / f"sentinal_report_{report_id}.html"

        template = Template(HTML_REPORT_TEMPLATE)
        rendered = template.render(
            project_name=assessment_meta.get("project_name", "Target Project"),
            assessment=assessment_meta,
            findings=findings,
            correlated_risks=correlated_risks,
            ai_analysis=ai_analysis,
            generated_at=datetime.now(timezone.utc).strftime("%B %d, %Y at %H:%M UTC")
        )

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(rendered)

        return file_path

    def generate_pdf_report(
        self,
        assessment_meta: Dict[str, Any],
        findings: List[NormalizedFinding],
        correlated_risks: List[CorrelatedRiskItem],
        ai_analysis: AIAnalysisResult
    ) -> Path:
        """Generate publication-ready PDF security assessment report."""
        report_id = assessment_meta.get("id", "report")
        file_path = self.reports_dir / f"sentinal_report_{report_id}.pdf"

        doc = SimpleDocTemplate(
            str(file_path),
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        normal_style = styles["Normal"]
        normal_style.textColor = colors.HexColor("#334155")
        normal_style.fontSize = 8.5
        normal_style.leading = 11.5

        title_style = ParagraphStyle(
            "ReportTitle",
            parent=styles["Heading1"],
            fontSize=20,
            leading=24,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=4
        )

        section_style = ParagraphStyle(
            "ReportSection",
            parent=styles["Heading2"],
            fontSize=12,
            leading=15,
            textColor=colors.HexColor("#0f172a"),
            spaceBefore=12,
            spaceAfter=6
        )

        threat_style = ParagraphStyle(
            "ThreatStyle",
            parent=normal_style,
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#b91c1c")
        )

        fix_style = ParagraphStyle(
            "FixStyle",
            parent=normal_style,
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#047857")
        )

        cell_style = ParagraphStyle(
            "CellStyle",
            parent=normal_style,
            fontSize=8,
            leading=10.5
        )

        story = []

        def esc(t: Any) -> str:
            return py_html.escape(str(t or ""))

        # 1. Header
        story.append(Paragraph("SENTINAL SECURITY AUDIT REPORT", title_style))
        target_display = esc(assessment_meta.get('target') or assessment_meta.get('repository') or 'Target System')
        mode_display = esc(assessment_meta.get('scan_mode', 'STANDARD'))
        auth_display = esc(assessment_meta.get('authorization_status', 'VERIFIED'))
        gen_time = datetime.now(timezone.utc).strftime("%B %d, %Y at %H:%M UTC")
        
        story.append(Paragraph(
            f"<b>Target Scope:</b> {target_display} | <b>Scan Mode:</b> {mode_display} | <b>Auth:</b> {auth_display} | <b>Date:</b> {gen_time}",
            normal_style
        ))
        story.append(Spacer(1, 8))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=10))

        # 2. Key Metrics Table
        crit_count = assessment_meta.get("critical_count", 0)
        high_count = assessment_meta.get("high_count", 0)
        med_count = assessment_meta.get("medium_count", 0)
        risk_score = assessment_meta.get("overall_risk_score", 0.0)
        dast_cov = assessment_meta.get("dast_coverage_score", 0.0)
        cov_status = assessment_meta.get("coverage_status", "NOT_APPLICABLE")

        metrics_data = [
            ["Security Score", "DAST Coverage", "Critical Flaws", "High Flaws", "Total Findings"],
            [f"{risk_score}/100", f"{dast_cov}% ({cov_status})", str(crit_count), str(high_count), str(len(findings))]
        ]
        metrics_table = Table(metrics_data, colWidths=[105, 125, 85, 85, 140])
        metrics_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8.5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ]))
        story.append(metrics_table)
        story.append(Spacer(1, 10))

        # 3. Target Connectivity & Blocking Diagnostics
        diag_meta = assessment_meta.get("connectivity_diagnostics") or {}
        if diag_meta and diag_meta.get("checks"):
            story.append(Paragraph("1. Target Connectivity & Blocking Diagnostics", section_style))
            waf_meta = diag_meta.get("checks", {}).get("9_waf_indicators", {})
            waf_text = f"{esc(waf_meta.get('provider'))} ({esc(waf_meta.get('confidence'))})" if waf_meta.get("detected") else "None Detected"
            
            diag_rows = [
                ["Reachability", esc(diag_meta.get("reachability", "UNKNOWN")), "TLS Protocol", esc(diag_meta.get("checks", {}).get("3_tls_handshake", {}).get("protocol", "N/A"))],
                ["Application Access", esc(diag_meta.get("access_level", "UNKNOWN")), "WAF / Bot Protection", waf_text],
                ["Finding Confidence", esc(assessment_meta.get("finding_confidence", "FULL")), "Coverage Status", f"{cov_status} ({dast_cov}%)"]
            ]
            diag_table = Table(diag_rows, colWidths=[110, 155, 110, 165])
            diag_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f1f5f9")),
                ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#f1f5f9")),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 7.5),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]))
            story.append(diag_table)
            
            rec_text = diag_meta.get("diagnostic_recommendation", "")
            if rec_text:
                story.append(Spacer(1, 3))
                story.append(Paragraph(f"<b>Recommendation:</b> {esc(rec_text)}", normal_style))
            story.append(Spacer(1, 8))

        # 4. Executive Summary
        story.append(Paragraph("2. Executive Summary", section_style))
        summary_clean = esc(ai_analysis.executive_summary).replace("\n", "<br/>")
        story.append(Paragraph(summary_clean[:2500], normal_style))
        story.append(Spacer(1, 10))

        # 5. Correlated Multi-Vector Attack Chains
        if correlated_risks:
            story.append(Paragraph("3. Correlated Multi-Vector Attack Chains", section_style))
            for cr in correlated_risks[:3]:
                cr_box = []
                cr_box.append(Paragraph(f"<b>[CHAIN] {esc(cr.title)}</b> ({esc(cr.risk_level)} • {esc(cr.confidence)} CONFIDENCE)", ParagraphStyle("CRTitle", parent=normal_style, fontSize=9, leading=12, textColor=colors.HexColor("#7c3aed"))))
                cr_box.append(Spacer(1, 2))
                cr_box.append(Paragraph(f"<b>Attack Scenario:</b> {esc(cr.attack_scenario or cr.description)}", threat_style))
                cr_box.append(Spacer(1, 2))
                if cr.remediation:
                    cr_box.append(Paragraph(f"<b>Remediation:</b> {esc(cr.remediation)}", fix_style))
                cr_box.append(Spacer(1, 6))
                story.append(KeepTogether(cr_box))

        # 6. Detailed Vulnerabilities & Threat Inventory
        story.append(Paragraph("4. Prioritized Vulnerability & Threat Inventory", section_style))
        findings_data = [["Severity & Risk", "Engine", "Vulnerability & Threat Scenario", "Location & Remediation"]]
        
        for f in findings[:25]:
            # Col 1: Severity, Risk Score, Blast Radius
            sev_p = f"<b>{esc(f.severity)}</b><br/><font color='#b91c1c'>Risk: {f.risk_score}/100</font>"
            if f.blast_radius:
                sev_p += f"<br/><font color='#dc2626'><b>Blast:</b> {esc(f.blast_radius[:24])}</font>"
            
            # Col 2: Engine
            scanners_str = ", ".join(f.all_scanners) if f.all_scanners else esc(f.scanner)
            engine_p = f"<b>{esc(f.source)}</b><br/><font color='#0284c7'>{esc(scanners_str)}</font>"
            
            # Col 3: Title & Threat Scenario
            title_p = f"<b>{esc(f.title)}</b>"
            if f.threat_scenario:
                title_p += f"<br/><font color='#991b1b'><b>Threat:</b> {esc(f.threat_scenario[:180])}..</font>"
            
            # Col 4: Location & Remediation
            loc = esc(f.endpoint or f.file or "/")
            loc_p = f"<code>{loc}</code>"
            if f.remediation:
                loc_p += f"<br/><font color='#047857'><b>Fix:</b> {esc(f.remediation[:140])}..</font>"
            
            findings_data.append([
                Paragraph(sev_p, cell_style),
                Paragraph(engine_p, cell_style),
                Paragraph(title_p, cell_style),
                Paragraph(loc_p, cell_style)
            ])

        findings_table = Table(findings_data, colWidths=[90, 75, 205, 170])
        findings_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 7.5),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("TOPPADDING", (0, 0), (-1, -1), 3.5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]))
        story.append(findings_table)
        story.append(Spacer(1, 10))

        # 7. Remediation Playbook
        if ai_analysis.remediation_playbook:
            story.append(Paragraph("5. Strategic Remediation Playbook", section_style))
            playbook_clean = esc(ai_analysis.remediation_playbook).replace("\n", "<br/>")
            story.append(Paragraph(playbook_clean[:2000], normal_style))

        doc.build(story)
        return file_path

report_generator = ReportGenerator()

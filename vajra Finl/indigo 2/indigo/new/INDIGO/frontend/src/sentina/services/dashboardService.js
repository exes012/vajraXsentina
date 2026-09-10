'use client'
// Service layer for Sentina SOC Dashboard
// Directly connects UI components to the live FastAPI backend with fallback resilience.

import { apiClient } from '../api/client';
import {
  calculateFindingsScore,
  calculateCorrelationScore,
  calculateModuleScores,
  calculateIntegratedOverallScore,
  getScorePosture
} from '../utils/securityScore';
import {
  mockDashboardSummary,
  mockFindings,
  mockCorrelatedRisks,
  mockAssets,
  mockProjects,
  mockAssessments,
  mockReports,
  mockNotifications
} from '../api/mockData';

function formatFinding(f) {
  if (!f) return null;
  const rawRisk = typeof f.risk_score === 'number' ? f.risk_score : (typeof f.riskScore === 'number' ? f.riskScore : 0);
  const cvssScore = rawRisk > 10 ? (rawRisk / 10).toFixed(1) : (rawRisk ? Number(rawRisk).toFixed(1) : '0.0');
  const computedSeverity = f.severity 
    ? String(f.severity).toUpperCase() 
    : (f.severity_level ? String(f.severity_level).toUpperCase() : (rawRisk >= 85 ? 'CRITICAL' : rawRisk >= 65 ? 'HIGH' : rawRisk >= 35 ? 'MEDIUM' : 'LOW'));

  return {
    ...f,
    severity: computedSeverity,
    affectedComponent: f.file ? (f.line ? `${f.file}:${f.line}` : f.file) : (f.endpoint || 'Global Target Scope'),
    asset: f.file ? f.file.split('/')[0] : (f.endpoint || 'Main Ingress'),
    riskScore: cvssScore,
    rawRiskScore: rawRisk,
    threatScenario: f.threat_scenario || f.threatScenario || null,
    potentialImpact: f.potential_impact || f.potentialImpact || {},
    blastRadius: f.blast_radius || f.blastRadius || 'Information Disclosure',
    riskFactors: f.risk_factors || f.riskFactors || {},
    cve: (f.cves && f.cves.length > 0) ? f.cves[0] : (f.cve || null),
    cwe: (f.cwe && Array.isArray(f.cwe) && f.cwe.length > 0) ? f.cwe[0] : (f.cwe || null),
    detected: f.created_at ? new Date(f.created_at).toLocaleDateString() : 'Just now',
    status: f.status ? (f.status.charAt(0).toUpperCase() + f.status.slice(1)) : 'Open',
    patchDiff: f.code_snippet,
    rawEvidenceSnippet: f.evidence
  };
}

class DashboardService {
  constructor() {
    this.findings = [...mockFindings];
    this.assessments = [...mockAssessments];
    this.projects = [...mockProjects];
    this.assets = [...mockAssets];
    this.correlatedRisks = [...mockCorrelatedRisks];
    this.reports = [...mockReports];
    this.notifications = [...mockNotifications];
    this.activeAssessmentId = null;
    this.listeners = new Set();
  }

  getActiveAssessmentId() {
    return this.activeAssessmentId;
  }

  setActiveAssessmentId(id) {
    this.activeAssessmentId = id;
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (e) {}
    });
  }

  async getDashboardSummary() {
    try {
      const [data, allFindings, correlatedRisks] = await Promise.all([
        apiClient.getDashboard().catch(() => null),
        this.getFindings().catch(() => []),
        this.getCorrelatedRisks().catch(() => [])
      ]);

      const findingsList = Array.isArray(allFindings) ? allFindings : [];
      const corrList = Array.isArray(correlatedRisks) ? correlatedRisks : [];
      const modScores = calculateModuleScores(findingsList, corrList);
      const integratedScore = calculateIntegratedOverallScore(findingsList, corrList, modScores);
      const posture = getScorePosture(integratedScore);

      const sevDist = data?.severity_distribution || {
        CRITICAL: findingsList.filter(f => f.severity === 'CRITICAL').length || 0,
        HIGH: findingsList.filter(f => f.severity === 'HIGH').length || 0,
        MEDIUM: findingsList.filter(f => f.severity === 'MEDIUM').length || 0,
        LOW: findingsList.filter(f => f.severity === 'LOW').length || 0,
        INFO: findingsList.filter(f => f.severity === 'INFO').length || 0
      };

      const totalVulns = findingsList.length > 0 ? findingsList.length : Object.values(sevDist).reduce((a, b) => a + b, 0);
      const totalScans = data?.total_assessments ?? this.assessments.length ?? 0;
      const monitoredCount = data?.assets_monitored_count || data?.total_projects || (totalScans > 0 ? 1 : 0);
      const projectCount = data?.total_projects || 1;

      return {
        totalScans: {
          value: totalScans,
          label: "TOTAL SCANS",
          trend: totalScans > 0 ? "↑ Active" : "0%",
          trendDirection: "neutral",
          period: "live scans",
          sparkline: [0, 0, 0, totalScans]
        },
        vulnerabilities: {
          value: totalVulns,
          rawValue: totalVulns,
          label: "VULNERABILITIES",
          trend: "0%",
          trendDirection: "neutral",
          isGoodTrend: true,
          period: "active findings",
          sparkline: [0, 0, 0, totalVulns]
        },
        assetsMonitored: {
          value: monitoredCount,
          label: "ASSETS MONITORED",
          trend: "0%",
          trendDirection: "neutral",
          period: "active targets",
          sparkline: [0, 0, 0, monitoredCount]
        },
        projects: {
          value: projectCount,
          label: "PROJECTS",
          trend: "0%",
          trendDirection: "neutral",
          period: "portfolios",
          sparkline: [0, 0, 0, projectCount]
        },
        securityScore: {
          score: integratedScore,
          maxScore: 100,
          posture: posture.label,
          postureColor: posture.color,
          delta: "+0.0%",
          deltaPeriod: findingsList.length > 0 ? "live multi-engine synthesis" : "ready for assessment",
          isPositive: integratedScore >= 75,
          rings: [
            { name: "SAST", score: modScores.sast.score, weight: 20, color: "#00f2fe", description: "Static Application Security Testing" },
            { name: "DAST", score: modScores.dast.score, weight: 20, color: "#f97316", description: "Dynamic Application Security Testing" },
            { name: "SCA", score: modScores.sca.score, weight: 20, color: "#00ff88", description: "Software Composition Analysis" },
            { name: "Secrets", score: modScores.secrets.score, weight: 20, color: "#ff1744", description: "Credential and Secret Scanning" },
            { name: "Threat Intel", score: modScores.threat_intel.score, weight: 20, color: "#fbbf24", description: "Threat Intelligence and Surface" }
          ]
        },
        severityBreakdown: {
          critical: sevDist.CRITICAL || 0,
          high: sevDist.HIGH || 0,
          medium: sevDist.MEDIUM || 0,
          low: sevDist.LOW || 0,
          info: sevDist.INFO || 0
        },
        dastCoverage: data?.dast_coverage_summary || {
          coverage_percentage: 0,
          requests_attempted: 0,
          requests_successful: 0,
          requests_blocked: 0,
          rate_limited: 0,
          urls_discovered: 0,
          urls_scanned: 0,
          waf_status: "NONE DETECTED"
        },
        analysisModules: [
          {
            id: "sast",
            number: "01",
            name: "01 SAST",
            fullName: "Static Application Security Testing",
            sub: "Semgrep + Native AST Sinks",
            description: "Deep AST rule evaluation & syntax-level flaw detection",
            status: modScores.sast.status,
            progress: modScores.sast.findings > 0 ? 100 : 0,
            score: modScores.sast.score,
            engineScore: modScores.sast.score,
            badgeColor: modScores.sast.posture.color,
            icon: "Code2",
            color: "#00f2fe",
            findingsCount: modScores.sast.findings,
            targetTab: "sast"
          },
          {
            id: "dast",
            number: "02",
            name: "02 DAST",
            fullName: "Dynamic Application Security Testing",
            sub: "ZAP + Runtime Fuzzing",
            description: "Runtime blackbox fuzzing & live endpoint validation",
            status: modScores.dast.status,
            progress: modScores.dast.findings > 0 ? 100 : 0,
            score: modScores.dast.score,
            engineScore: modScores.dast.score,
            badgeColor: modScores.dast.posture.color,
            icon: "Radio",
            color: "#f97316",
            findingsCount: modScores.dast.findings,
            targetTab: "dast"
          },
          {
            id: "sca",
            number: "03",
            name: "03 SCA",
            fullName: "Software Composition Analysis",
            sub: "OSV + Dependency CVEs",
            description: "Third-party open-source dependency CVE audit",
            status: modScores.sca.status,
            progress: modScores.sca.findings > 0 ? 100 : 0,
            score: modScores.sca.score,
            engineScore: modScores.sca.score,
            badgeColor: modScores.sca.posture.color,
            icon: "Boxes",
            color: "#00ff88",
            findingsCount: modScores.sca.findings,
            targetTab: "sca"
          },
          {
            id: "secrets",
            number: "04",
            name: "04 SECRETS",
            fullName: "Secret Token Entropy Scanner",
            sub: "Gitleaks + Token Entropy",
            description: "High-entropy API key & hardcoded credentials detection",
            status: modScores.secrets.status,
            progress: modScores.secrets.findings > 0 ? 100 : 0,
            score: modScores.secrets.score,
            engineScore: modScores.secrets.score,
            badgeColor: modScores.secrets.posture.color,
            icon: "Lock",
            color: "#ff1744",
            findingsCount: modScores.secrets.findings,
            targetTab: "secrets"
          },
          {
            id: "threat_intel",
            number: "05",
            name: "05 NUCLEI / SSL",
            fullName: "Certificate & Infrastructure Audit",
            sub: "TLS Handshake + Web Probes",
            description: "Public key infrastructure & cipher suite compliance",
            status: modScores.threat_intel.status,
            progress: modScores.threat_intel.findings > 0 ? 100 : 0,
            score: modScores.threat_intel.score,
            engineScore: modScores.threat_intel.score,
            badgeColor: modScores.threat_intel.posture.color,
            icon: "Crosshair",
            color: "#fbbf24",
            findingsCount: modScores.threat_intel.findings,
            targetTab: "threat_intel"
          },
          {
            id: "ai_correlation",
            number: "06",
            name: "06 AI CORRELATION",
            fullName: "Automated Attack-Chain Synthesis",
            sub: "Cross-Engine Attack Chains",
            description: "Multi-vector blended vulnerability path confirmation",
            status: modScores.ai_correlation.status,
            progress: modScores.ai_correlation.findings > 0 ? 100 : 0,
            score: modScores.ai_correlation.score,
            engineScore: modScores.ai_correlation.score,
            badgeColor: modScores.ai_correlation.posture.color,
            icon: "Cpu",
            color: "#c084fc",
            findingsCount: modScores.ai_correlation.findings,
            targetTab: "ai_correlation"
          }
        ]
      };
    } catch (e) {
      console.warn("Could not fetch dashboard summary from backend, using default summary:", e);
      return mockDashboardSummary;
    }
  }

  // --- Assets API Integration ---
  async getAssets(projectId = null) {
    try {
      const serverAssets = await apiClient.getAssets(projectId);
      if (serverAssets && serverAssets.length > 0) {
        return serverAssets.map(a => ({
          ...a,
          type: a.asset_type === 'WEB_APPLICATION' ? 'Web Application' : (a.asset_type === 'API_GATEWAY' ? 'API Gateway' : a.asset_type),
          category: a.asset_type === 'WEB_APPLICATION' ? 'Web Applications' : (a.asset_type === 'API_GATEWAY' ? 'APIs' : 'All'),
          techStack: a.technology || [],
          riskRating: a.risk_score > 60 ? 'CRITICAL' : (a.risk_score > 40 ? 'HIGH' : (a.risk_score > 20 ? 'MEDIUM' : 'LOW')),
          riskScore: a.risk_score || 0,
          verified: a.is_verified,
          lastScan: a.last_assessment_at ? new Date(a.last_assessment_at).toLocaleDateString() : 'Pending Scan',
          owner: 'Security Operations'
        }));
      }
    } catch (e) {
      console.warn("Could not fetch assets from backend:", e);
    }
    return this.assets;
  }

  async createAsset(assetData) {
    try {
      const res = await apiClient.createAsset(assetData);
      this.notify();
      return res;
    } catch (e) {
      console.error("Failed to create asset:", e);
      throw e;
    }
  }

  async verifyAsset(assetId, method = 'ANALYST_AUTHORIZATION', notes = '') {
    try {
      const res = await apiClient.verifyAsset(assetId, method, notes);
      this.notify();
      return res;
    } catch (e) {
      console.error("Failed to verify asset:", e);
      throw e;
    }
  }

  async getAssetAssessments(assetId) {
    try {
      const list = await apiClient.getAssetAssessments(assetId);
      return (list || []).map(a => this._formatAssessment(a));
    } catch (e) {
      console.error("Failed to get asset assessments:", e);
      return [];
    }
  }

  async compareAssetAssessments(assetId, asm1, asm2) {
    try {
      return await apiClient.compareAssetAssessments(assetId, asm1, asm2);
    } catch (e) {
      console.error("Failed to compare assessments:", e);
      throw e;
    }
  }

  getInitialFindings(params = {}) {
    const currentList = this.findings || [];
    if (params && params.assessment_id) {
      return currentList
        .filter(f => String(f.assessment_id) === String(params.assessment_id) || String(f.assessmentId) === String(params.assessment_id))
        .map(formatFinding);
    }
    if (params && params.source) {
      const src = params.source.toUpperCase();
      return currentList
        .filter(f => (f.source || '').toUpperCase() === src || (f.scanner || '').toUpperCase() === src)
        .map(formatFinding);
    }
    return currentList.map(formatFinding);
  }

  async getFindings(params = {}) {
    try {
      const serverFindings = await apiClient.getFindings(params);
      if (serverFindings && Array.isArray(serverFindings)) {
        if (!params || Object.keys(params).length === 0) {
          this.findings = serverFindings;
        }
        return serverFindings.map(formatFinding);
      }
    } catch (e) {
      console.warn("Could not fetch findings from backend, using cache:", e);
    }
    const currentList = this.findings || [];
    if (params && params.assessment_id) {
      return currentList
        .filter(f => String(f.assessment_id) === String(params.assessment_id) || String(f.assessmentId) === String(params.assessment_id))
        .map(formatFinding);
    }
    if (params && params.source) {
      const src = params.source.toUpperCase();
      return currentList
        .filter(f => (f.source || '').toUpperCase() === src || (f.scanner || '').toUpperCase() === src)
        .map(formatFinding);
    }
    return currentList.map(formatFinding);
  }

  async getFindingById(id) {
    try {
      const f = await apiClient.getFinding(id);
      if (f) return formatFinding(f);
    } catch (e) {
      console.warn("Could not fetch finding by ID:", e);
    }
    const local = this.findings.find(item => item.id === id);
    return formatFinding(local);
  }

  async updateFindingStatus(id, newStatus) {
    try {
      await apiClient.updateFindingStatus(id, newStatus.toLowerCase());
    } catch (e) {
      console.warn("Could not update finding status on backend:", e);
    }
    const idx = this.findings.findIndex(item => item.id === id);
    if (idx !== -1) {
      this.findings[idx].status = newStatus;
    }
    this.notify();
    return this.findings;
  }

  async getAssessments(projectId = null) {
    try {
      const serverAssessments = await apiClient.getAssessments(projectId);
      if (serverAssessments && Array.isArray(serverAssessments)) {
        const formattedServer = serverAssessments.map(a => this._formatAssessment(a));
        const pendingOptimistic = (this.assessments || []).filter(a => String(a.id).startsWith('temp-') || String(a.id).startsWith('scan-temp-'));
        this.assessments = [...pendingOptimistic, ...formattedServer.filter(s => !pendingOptimistic.some(p => p.id === s.id))];
        return this.assessments;
      }
    } catch (e) {
      console.warn("Could not fetch assessments from backend:", e);
    }
    return (this.assessments || []).map(a => (a.counts && a.targetType) ? a : this._formatAssessment(a));
  }

  _formatAssessment(a) {
    const liveUrl = a.target_info?.url || a.target_url || a.targetInfo?.url || (a.assessment_type === 'dast' ? a.target : null);
    const repoUrl = a.repository_info?.url || a.repository_url || a.repoInfo?.url || (a.repository_info?.zip_path && (a.repository_info?.filename || 'Uploaded Source Archive')) || (a.assessment_type === 'repo' || a.assessment_type === 'source' ? a.target : null);

    let displayTarget = 'Active Target Scope';
    if (liveUrl && repoUrl) {
      displayTarget = `${liveUrl} + ${repoUrl}`;
    } else if (liveUrl) {
      displayTarget = liveUrl;
    } else if (repoUrl) {
      displayTarget = repoUrl;
    } else if (a.target) {
      displayTarget = a.target;
    } else if (a.name) {
      displayTarget = a.name;
    }

    const targetType = a.assessment_type === 'repo' ? 'Git Repository (SAST/SCA)' : (a.assessment_type === 'source' ? 'Source Code Archive (SAST/SCA)' : (a.assessment_type === 'dast' ? 'Web Application (DAST)' : 'Combined (Unified SAST+DAST)'));
    
    // Accurate dynamic Security Score (0-100, 100=Safest)
    const crit = a.critical_count || 0;
    const high = a.high_count || 0;
    const med = a.medium_count || 0;
    const low = a.low_count || 0;
    const penalty = (crit * 20) + (high * 12) + (med * 5) + (low * 2);
    const calculatedSecScore = (crit + high + med + low > 0)
      ? Math.max(10, Math.min(100, 100 - penalty))
      : (typeof a.overall_risk_score === 'number' && a.overall_risk_score > 0 ? Math.max(0, Math.min(100, Math.round(100 - a.overall_risk_score))) : 100);

    // Accurate progress computation
    let progress = 100;
    const isDone = a.status === 'COMPLETED' || a.status === 'SUCCESS';
    const isFailed = a.status === 'FAILED' || a.status === 'CANCELLED';
    if (!isDone && !isFailed) {
      if (typeof a.progress === 'number' && a.progress > 0) {
        progress = Math.min(99, a.progress);
      } else {
        const rawLogs = a.logs || [];
        const logTexts = rawLogs.map(l => (typeof l === 'string' ? l : `${l.stage || ''} ${l.message || l.text || ''}`).toUpperCase());
        if (logTexts.some(t => t.includes('AI') || t.includes('CORRELAT') || t.includes('NORMALIZ') || t.includes('REPORT'))) {
          progress = 88;
        } else if (logTexts.some(t => t.includes('SCAN') || t.includes('ZAP') || t.includes('SAST') || t.includes('NUCLEI') || t.includes('WAPITI') || t.includes('NIKTO'))) {
          progress = 65;
        } else if (logTexts.some(t => t.includes('DISCOVER') || t.includes('SPIDER') || t.includes('CLON') || t.includes('SOURCE') || t.includes('VALIDAT'))) {
          progress = 35;
        } else if (logTexts.some(t => t.includes('INITIAL') || t.includes('QUEUED'))) {
          progress = 15;
        } else {
          progress = (a.status === 'RUNNING' || a.status === 'IN_PROGRESS') ? 45 : 10;
        }
      }
    }

    return {
      id: a.id,
      target: displayTarget,
      liveUrl: liveUrl,
      repoUrl: repoUrl,
      targetType: targetType,
      assessmentType: a.assessment_type || (liveUrl && repoUrl ? 'combined' : (liveUrl ? 'dast' : 'repo')),
      startedAt: a.started_at ? new Date(a.started_at).toLocaleString() : (a.created_at ? new Date(a.created_at).toLocaleString() : 'Just now'),
      completedAt: a.completed_at ? new Date(a.completed_at).toLocaleString() : null,
      status: a.status || 'PENDING',
      progress: progress,
      overallScore: calculatedSecScore,
      securityScore: calculatedSecScore,
      riskScore: typeof a.overall_risk_score === 'number' ? a.overall_risk_score : (100 - calculatedSecScore),
      counts: {
        critical: crit,
        high: high,
        medium: med,
        low: low,
        info: a.info_count || 0,
        total: a.total_findings || (crit + high + med + low)
      },
      dastCoverageScore: typeof a.dast_coverage_score === 'number' ? a.dast_coverage_score : 0,
      coverageStatus: a.coverage_status || 'NOT_APPLICABLE',
      connectivityDiagnostics: a.connectivity_diagnostics || {},
      coverageTelemetry: a.coverage_telemetry || {},
      regressions: a.regressions || {},
      errorMessage: a.error_message || a.failure_reason?.summary || (a.status === 'FAILED' ? 'Scan execution encountered an error.' : null),
      failureReason: a.failure_reason || (a.error_message ? { summary: a.error_message, raw_error: a.error_message } : null),
      logs: (a.logs || []).map(l => ({
        time: l.timestamp ? new Date(l.timestamp).toLocaleTimeString() : (l.time || new Date().toLocaleTimeString()),
        stage: l.stage || 'EXECUTION',
        text: l.message || l.text || (typeof l === 'string' ? l : JSON.stringify(l))
      })),
      scanJobs: a.scan_jobs || [],
      modules: a.modules || {},
      targetInfo: a.target_info || (liveUrl ? { url: liveUrl } : {}),
      repoInfo: a.repository_info || (repoUrl ? { url: repoUrl } : {})
    };
  }

  async getCorrelatedRisks(assessmentId = null) {
    try {
      if (assessmentId) {
        const risks = await apiClient.getCorrelatedRisks(assessmentId);
        if (risks && Array.isArray(risks)) return risks;
      } else {
        const asms = await apiClient.getAssessments();
        if (asms && asms.length > 0) {
          const latest = asms[0];
          const risks = await apiClient.getCorrelatedRisks(latest.id);
          if (risks && Array.isArray(risks)) return risks;
        }
      }
    } catch (e) {
      console.warn("Could not fetch correlated risks from backend:", e);
    }
    return this.correlatedRisks;
  }

  async getProjects() {
    try {
      const serverProjects = await apiClient.getProjects();
      if (serverProjects && Array.isArray(serverProjects) && serverProjects.length > 0) {
        return serverProjects.map(p => ({
          ...p,
          assessmentCount: p.assessments ? p.assessments.length : 0,
          createdDate: new Date(p.created_at).toLocaleDateString(),
          lastScan: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : 'Never'
        }));
      }
    } catch (e) {
      console.warn("Could not fetch projects from backend:", e);
    }
    return this.projects;
  }

  async getReports(projectId = null) {
    try {
      // 1. Try to fetch official reports from backend
      const serverReports = await apiClient.getReports(projectId);
      const allFindings = await this.getFindings();

      if (serverReports && serverReports.length > 0) {
        return serverReports.map(rep => {
          const matchingFindings = allFindings.filter(f => f.assessment_id === rep.assessment_id || f.assessmentId === rep.assessment_id);
          const topFindings = (matchingFindings.length > 0 ? matchingFindings : allFindings).slice(0, 8);
          const score = calculateFindingsScore(matchingFindings.length > 0 ? matchingFindings : topFindings);

          return {
            id: rep.id,
            assessmentId: rep.assessment_id,
            assessmentName: rep.executive_summary?.split('completed for ')?.[1]?.split('.')?.[0] || 'Target Security Audit',
            project: 'SECURITY AUDIT',
            leadAuditor: 'Sentina Autonomous SOC Engine',
            date: rep.created_at ? new Date(rep.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
            riskScore: score,
            securityScore: score,
            status: 'Completed & Certified',
            counts: rep.distribution || { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
            executiveSummary: rep.executive_summary || 'Autonomous multi-engine cybersecurity assessment completed.',
            technicalSummary: rep.technical_summary || '',
            aiAnalysis: rep.ai_analysis || {},
            keyFindings: topFindings,
            methodology: rep.methodology || 'Unified SAST + SCA + DAST + Secrets Security Assessment'
          };
        });
      }

      // 2. Fallback to completed assessments
      const asms = await apiClient.getAssessments(projectId);
      if (asms && asms.length > 0) {
        return asms.filter(a => a.status === 'COMPLETED').map(a => {
          const targetStr = a.target_info?.url || a.repository_info?.url || a.repository_info?.zip_path || 'Fleet Security Scope';
          const matchingFindings = allFindings.filter(f => f.assessment_id === a.id || f.assessmentId === a.id);
          const topFindings = (matchingFindings.length > 0 ? matchingFindings : allFindings).slice(0, 8);
          const crit = a.critical_count || 0;
          const high = a.high_count || 0;
          const med = a.medium_count || 0;
          const low = a.low_count || 0;
          const penalty = (crit * 20) + (high * 12) + (med * 5) + (low * 2);
          const computedScore = (crit + high + med + low > 0)
            ? Math.max(10, Math.min(100, 100 - penalty))
            : (typeof a.overall_risk_score === 'number' && a.overall_risk_score > 0 ? Math.max(0, Math.min(100, Math.round(100 - a.overall_risk_score))) : 100);

          return {
            id: `rep-${a.id.slice(-6)}`,
            assessmentId: a.id,
            assessmentName: targetStr,
            project: a.assessment_type?.toUpperCase() || 'COMBINED',
            leadAuditor: 'Sentina Autonomous SOC Engine',
            date: a.completed_at ? new Date(a.completed_at).toLocaleDateString() : new Date().toLocaleDateString(),
            riskScore: computedScore,
            securityScore: computedScore,
            status: 'Completed & Certified',
            counts: {
              critical: crit,
              high: high,
              medium: med,
              low: low,
              info: a.info_count || 0,
              total: a.total_findings || 0
            },
            executiveSummary: `Autonomous security audit completed for ${targetStr}. Security score: ${computedScore}/100 with ${a.total_findings} verified issues.`,
            keyFindings: topFindings,
            methodology: 'Unified DAST (ZAP, Nuclei, Wapiti, TLS, Headers) & Multi-Engine Attack Surface Analysis.'
          };
        });
      }
    } catch (e) {
      console.warn("Could not fetch reports from backend:", e);
    }
    return this.reports;
  }

  async generateReport(assessmentId = null) {
    try {
      const rep = await apiClient.generateReport(assessmentId);
      this.notify();
      return rep;
    } catch (e) {
      console.error("Failed to generate report on backend:", e);
      throw e;
    }
  }

  async getNotifications() {
    return this.notifications;
  }

  async markNotificationRead(id) {
    const n = this.notifications.find(item => item.id === id);
    if (n) n.unread = false;
    return [...this.notifications];
  }

  async triggerNewScan(config) {
    let assessmentType = config.targetType || 'combined';
    let repoInfo = null;
    let targetInfo = null;

    if (assessmentType === 'combined' || (config.repoUrl && config.liveUrl) || (config.zipPath && config.liveUrl)) {
      assessmentType = 'combined';
      repoInfo = config.zipPath
        ? { provider: 'upload', zip_path: config.zipPath, filename: config.uploadedFileName || 'source_archive.zip' }
        : (config.repoUrl ? { provider: 'github', url: config.repoUrl, branch: config.branch || 'main', token: config.repoToken || config.token || null } : null);
      targetInfo = config.liveUrl ? {
        url: config.liveUrl,
        scan_mode: config.scanMode || 'standard',
        auth_type: config.authType || 'none',
        auth_token: config.authToken || null,
        auth_cookie: config.authCookie || null,
        auth_username: config.authUsername || null,
        auth_password: config.authPassword || null,
        custom_headers: config.customHeaders || null
      } : null;
    } else if (assessmentType === 'repo' || assessmentType === 'source') {
      repoInfo = config.zipPath
        ? { provider: 'upload', zip_path: config.zipPath, filename: config.uploadedFileName || 'source_archive.zip' }
        : { provider: 'github', url: config.repoUrl || config.target, branch: config.branch || 'main', token: config.repoToken || config.token || null };
    } else if (assessmentType === 'dast' || assessmentType === 'url') {
      assessmentType = 'dast';
      repoInfo = config.zipPath
        ? { provider: 'upload', zip_path: config.zipPath, filename: config.uploadedFileName || 'source_archive.zip' }
        : (config.repoUrl ? { provider: 'github', url: config.repoUrl, branch: config.branch || 'main', token: config.repoToken || config.token || null } : null);
      targetInfo = {
        url: config.liveUrl || config.target,
        scan_mode: config.scanMode || 'standard',
        auth_type: config.authType || 'none',
        auth_token: config.authToken || null,
        auth_cookie: config.authCookie || null,
        auth_username: config.authUsername || null,
        auth_password: config.authPassword || null,
        custom_headers: config.customHeaders || null
      };
    }

    const payload = {
      project_id: config.projectId && config.projectId !== 'default-scope' ? config.projectId : 'default-scope',
      name: config.assessmentName || null,
      assessment_type: assessmentType,
      asset_id: config.assetId || null,
      repository: repoInfo,
      target: targetInfo,
      modules: {
        discovery: config.scanners?.discovery ?? true,
        dast: config.scanners?.dast ?? true,
        nuclei: config.scanners?.nuclei ?? true,
        wapiti: config.scanners?.wapiti ?? true,
        headers: config.scanners?.headers ?? true,
        ssl: config.scanners?.ssl ?? true,
        sast: config.scanners?.sast ?? true,
        sca: config.scanners?.sca ?? true,
        secrets: config.scanners?.secrets ?? true
      }
    };

    const targetStr = config.liveUrl || config.repoUrl || (config.uploadedFileName ? `Archive: ${config.uploadedFileName}` : (config.target || 'Active Target Scope'));
    const tempId = `scan-temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      target: targetStr,
      targetType: assessmentType === 'repo' ? 'Git Repository (SAST/SCA)' : (assessmentType === 'source' ? 'Source Code Archive (SAST/SCA)' : (assessmentType === 'dast' ? 'Web Application (DAST)' : 'Combined (Unified SAST+DAST)')),
      assessmentType: assessmentType,
      startedAt: new Date().toLocaleString(),
      completedAt: null,
      status: 'RUNNING',
      overallScore: 100,
      securityScore: 100,
      riskScore: 0,
      progress: 12,
      counts: { critical: 0, high: 0, medium: 0, low: 0, info: 0, total: 0 },
      dastCoverageScore: 0,
      coverageStatus: 'IN_PROGRESS',
      connectivityDiagnostics: {},
      coverageTelemetry: {},
      regressions: {},
      errorMessage: null,
      failureReason: null,
      logs: [
        { time: new Date().toLocaleTimeString(), stage: 'INITIALIZATION', text: `Scanner execution pipeline initiated for target: ${targetStr}` },
        { time: new Date().toLocaleTimeString(), stage: 'TARGET VALIDATION', text: `Validating target scope and scheduling multi-engine modules for ${targetStr}...` }
      ],
      scanJobs: [],
      modules: {
        discovery: config.scanners?.discovery ?? true,
        dast: config.scanners?.dast ?? true,
        nuclei: config.scanners?.nuclei ?? true,
        wapiti: config.scanners?.wapiti ?? true,
        headers: config.scanners?.headers ?? true,
        ssl: config.scanners?.ssl ?? true,
        sast: config.scanners?.sast ?? true,
        sca: config.scanners?.sca ?? true,
        secrets: config.scanners?.secrets ?? true
      },
      targetInfo: targetInfo || { url: config.liveUrl },
      repoInfo: repoInfo || { url: config.repoUrl }
    };

    // Reflect instantly in the UI state
    this.assessments = [optimistic, ...this.assessments.filter(a => a.id !== tempId)];
    this.activeAssessmentId = tempId;
    this.notify();

    try {
      const serverAssessment = await apiClient.startAssessment(payload);
      const formatted = this._formatAssessment(serverAssessment);

      // Replace temporary placeholder with real server assessment
      const tempIdx = this.assessments.findIndex(a => a.id === tempId);
      if (tempIdx !== -1) {
        this.assessments[tempIdx] = formatted;
      } else {
        this.assessments = [formatted, ...this.assessments.filter(a => a.id !== formatted.id)];
      }
      this.activeAssessmentId = formatted.id;
      this.pollAssessmentProgress(serverAssessment.id);
      this.notify();
      return formatted;
    } catch (err) {
      console.error('Failed to trigger backend assessment:', err);
      const tempIdx = this.assessments.findIndex(a => a.id === tempId);
      if (tempIdx !== -1) {
        this.assessments[tempIdx].status = 'FAILED';
        this.assessments[tempIdx].errorMessage = err.message || 'Failed to start scan';
        this.assessments[tempIdx].failureReason = { summary: err.message || 'Failed to start scan', raw_error: String(err) };
      }
      this.notify();
      throw err;
    }
  }

  async deleteAssessment(id) {
    if (!id) return;
    try {
      await apiClient.deleteAssessment(id);
    } catch (e) {
      console.warn("Could not delete assessment on backend:", e);
    }
    this.assessments = this.assessments.filter(a => a.id !== id);
    if (this.activeAssessmentId === id) {
      this.activeAssessmentId = this.assessments.length > 0 ? this.assessments[0].id : null;
    }
    this.notify();
    return this.assessments;
  }

  pollAssessmentProgress(assessmentId) {
    if (!assessmentId) return;
    let pollCount = 0;
    const interval = setInterval(async () => {
      pollCount++;
      try {
        const asm = await apiClient.getAssessment(assessmentId);
        if (asm) {
          const formatted = this._formatAssessment(asm);
          const idx = this.assessments.findIndex(a => String(a.id) === String(assessmentId));
          if (idx !== -1) {
            this.assessments[idx] = formatted;
          } else {
            this.assessments.unshift(formatted);
          }
          this.notify();
          if (asm.status === 'COMPLETED' || asm.status === 'FAILED' || asm.status === 'CANCELLED' || pollCount > 180) {
            clearInterval(interval);
            this.notify();
          }
        }
      } catch (e) {
        if (pollCount > 180) clearInterval(interval);
      }
    }, 2000);
  }
}

export const dashboardService = new DashboardService();

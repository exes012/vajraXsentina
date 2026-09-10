'use client'
// Dynamic Integrated Security Score Calculation based strictly on real assessment findings & module telemetry

/**
 * Standard finding penalty score calculation (0-100)
 */
export function calculateFindingsScore(findings = []) {
  if (!findings || findings.length === 0) {
    return 100; // Zero vulnerabilities = 100% Secure Score
  }

  const crit = findings.filter(f => (f.severity || f.severity_level || '').toUpperCase() === 'CRITICAL').length;
  const high = findings.filter(f => (f.severity || f.severity_level || '').toUpperCase() === 'HIGH').length;
  const med = findings.filter(f => (f.severity || f.severity_level || '').toUpperCase() === 'MEDIUM').length;
  const low = findings.filter(f => (f.severity || f.severity_level || '').toUpperCase() === 'LOW').length;

  const penalty = (crit * 20) + (high * 12) + (med * 5) + (low * 2);
  return Math.max(10, Math.min(100, Math.round(100 - penalty)));
}

/**
 * Attack chain / Correlated Risk scoring calculation (0-100)
 */
export function calculateCorrelationScore(correlatedRisks = []) {
  if (!correlatedRisks || correlatedRisks.length === 0) {
    return 100; // Zero attack chains = 100% Secure Score
  }

  const crit = correlatedRisks.filter(r => (r.finalRisk || r.severity || '').toUpperCase() === 'CRITICAL').length;
  const high = correlatedRisks.filter(r => (r.finalRisk || r.severity || '').toUpperCase() === 'HIGH').length;
  const med = correlatedRisks.filter(r => (r.finalRisk || r.severity || '').toUpperCase() === 'MEDIUM').length;
  const low = correlatedRisks.filter(r => (r.finalRisk || r.severity || '').toUpperCase() === 'LOW').length;

  const penalty = (crit * 22) + (high * 14) + (med * 6) + (low * 2);
  return Math.max(10, Math.min(100, Math.round(100 - penalty)));
}

/**
 * Extract findings specifically belonging to a module category
 */
export function filterModuleFindings(moduleType, allFindings = []) {
  if (!Array.isArray(allFindings)) return [];
  const type = (moduleType || '').toLowerCase();

  switch (type) {
    case 'sast':
      return allFindings.filter(f => {
        const src = (f.source || f.scanner || f.category || '').toUpperCase();
        return src === 'SAST' || src === 'SEMGREP' || (Boolean(f.file) && !f.endpoint && !f.package);
      });

    case 'dast':
      return allFindings.filter(f => {
        const src = (f.source || f.scanner || f.category || '').toUpperCase();
        return src === 'DAST' || src === 'ZAP' || src === 'WAPITI' || src === 'WEB' || Boolean(f.endpoint);
      });

    case 'sca':
      return allFindings.filter(f => {
        const src = (f.source || f.scanner || f.category || '').toUpperCase();
        return src === 'SCA' || src === 'DEPENDENCY' || src === 'OSV' || Boolean(f.package) || (f.cve && !f.file && !f.endpoint);
      });

    case 'secrets':
      return allFindings.filter(f => {
        const src = (f.source || f.scanner || f.category || '').toUpperCase();
        return src.includes('SECRET') || src === 'GITLEAKS' || Boolean(f.secret_type) || (f.title || '').toLowerCase().includes('secret') || (f.title || '').toLowerCase().includes('token');
      });

    case 'threat_intel':
    case 'threatintel':
    case 'ssl':
      return allFindings.filter(f => {
        const src = (f.source || f.scanner || f.category || '').toUpperCase();
        return src.includes('THREAT') || src === 'SSL' || src === 'TLS' || src === 'NUCLEI' || src === 'TESTSSL' || (f.title || '').toLowerCase().includes('ssl') || (f.title || '').toLowerCase().includes('cipher');
      });

    default:
      return allFindings;
  }
}

/**
 * Calculate security score, severity counts, and posture for all 6 analysis modules
 */
export function calculateModuleScores(allFindings = [], correlatedRisks = []) {
  const sastFindings = filterModuleFindings('sast', allFindings);
  const dastFindings = filterModuleFindings('dast', allFindings);
  const scaFindings = filterModuleFindings('sca', allFindings);
  const secretsFindings = filterModuleFindings('secrets', allFindings);
  const threatIntelFindings = filterModuleFindings('threat_intel', allFindings);

  const sastScore = calculateFindingsScore(sastFindings);
  const dastScore = calculateFindingsScore(dastFindings);
  const scaScore = calculateFindingsScore(scaFindings);
  const secretsScore = calculateFindingsScore(secretsFindings);
  const threatIntelScore = calculateFindingsScore(threatIntelFindings);
  const aiScore = calculateCorrelationScore(correlatedRisks);

  return {
    sast: {
      id: 'sast',
      number: '01',
      name: '01 SAST',
      fullName: 'Static Application Security Testing',
      sub: 'Semgrep + Native AST Sinks',
      score: sastScore,
      findings: sastFindings.length,
      findingsList: sastFindings,
      posture: getScorePosture(sastScore),
      status: allFindings.length > 0 ? (sastFindings.length > 0 ? 'COMPLETED' : 'CLEAN') : 'IDLE',
      color: '#00f2fe',
      targetTab: 'sast'
    },
    dast: {
      id: 'dast',
      number: '02',
      name: '02 DAST',
      fullName: 'Dynamic Application Security Testing',
      sub: 'ZAP + Runtime Fuzzing',
      score: dastScore,
      findings: dastFindings.length,
      findingsList: dastFindings,
      posture: getScorePosture(dastScore),
      status: allFindings.length > 0 ? (dastFindings.length > 0 ? 'COMPLETED' : 'CLEAN') : 'IDLE',
      color: '#f97316',
      targetTab: 'dast'
    },
    sca: {
      id: 'sca',
      number: '03',
      name: '03 SCA',
      fullName: 'Software Composition Analysis',
      sub: 'OSV + Dependency CVEs',
      score: scaScore,
      findings: scaFindings.length,
      findingsList: scaFindings,
      posture: getScorePosture(scaScore),
      status: allFindings.length > 0 ? (scaFindings.length > 0 ? 'COMPLETED' : 'CLEAN') : 'IDLE',
      color: '#00ff88',
      targetTab: 'sca'
    },
    secrets: {
      id: 'secrets',
      number: '04',
      name: '04 SECRETS',
      fullName: 'Secret Token Entropy Scanner',
      sub: 'Gitleaks + Token Entropy',
      score: secretsScore,
      findings: secretsFindings.length,
      findingsList: secretsFindings,
      posture: getScorePosture(secretsScore),
      status: allFindings.length > 0 ? (secretsFindings.length > 0 ? 'COMPLETED' : 'CLEAN') : 'IDLE',
      color: '#ff1744',
      targetTab: 'secrets'
    },
    threat_intel: {
      id: 'threat_intel',
      number: '05',
      name: '05 NUCLEI / SSL',
      fullName: 'Certificate & Infrastructure Audit',
      sub: 'TLS Handshake + Web Probes',
      score: threatIntelScore,
      findings: threatIntelFindings.length,
      findingsList: threatIntelFindings,
      posture: getScorePosture(threatIntelScore),
      status: allFindings.length > 0 ? (threatIntelFindings.length > 0 ? 'COMPLETED' : 'CLEAN') : 'IDLE',
      color: '#fbbf24',
      targetTab: 'threat_intel'
    },
    ai_correlation: {
      id: 'ai_correlation',
      number: '06',
      name: '06 AI CORRELATION',
      fullName: 'Automated Attack-Chain Synthesis',
      sub: 'Cross-Engine Attack Chains',
      score: aiScore,
      findings: (correlatedRisks || []).length,
      findingsList: correlatedRisks || [],
      posture: getScorePosture(aiScore),
      status: (correlatedRisks || []).length > 0 ? 'COMPLETED' : (allFindings.length > 0 ? 'CLEAN' : 'IDLE'),
      color: '#c084fc',
      targetTab: 'ai_correlation'
    }
  };
}

/**
 * Multi-module weighted integrated security score calculation
 * Weights: SAST 25%, DAST 25%, SCA 15%, Secrets 15%, Threat Intel 10%, AI Correlation 10%
 */
export function calculateIntegratedOverallScore(allFindings = [], correlatedRisks = [], customModuleScores = null) {
  if ((!allFindings || allFindings.length === 0) && (!correlatedRisks || correlatedRisks.length === 0)) {
    return 100;
  }

  const modScores = customModuleScores || calculateModuleScores(allFindings, correlatedRisks);

  const weightedScore = (
    (modScores.sast.score * 0.25) +
    (modScores.dast.score * 0.25) +
    (modScores.sca.score * 0.15) +
    (modScores.secrets.score * 0.15) +
    (modScores.threat_intel.score * 0.10) +
    (modScores.ai_correlation.score * 0.10)
  );

  return Math.max(10, Math.min(100, Math.round(weightedScore)));
}

/**
 * Standardized score posture and visual metadata
 */
export function getScorePosture(score) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  if (safeScore >= 90) {
    return {
      label: 'OPTIMAL DEFENSE',
      sublabel: 'EXCELLENT',
      color: '#00ff88',
      glow: 'rgba(0, 255, 136, 0.4)',
      badgeBg: 'rgba(0, 255, 136, 0.12)',
      badgeBorder: '#00ff88',
      grade: 'A+'
    };
  }
  if (safeScore >= 75) {
    return {
      label: 'GOOD POSTURE',
      sublabel: 'GOOD',
      color: '#00f2fe',
      glow: 'rgba(0, 242, 254, 0.4)',
      badgeBg: 'rgba(0, 242, 254, 0.12)',
      badgeBorder: '#00f2fe',
      grade: 'A'
    };
  }
  if (safeScore >= 55) {
    return {
      label: 'MODERATE RISK',
      sublabel: 'MODERATE',
      color: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.4)',
      badgeBg: 'rgba(251, 191, 36, 0.12)',
      badgeBorder: '#fbbf24',
      grade: 'B'
    };
  }
  if (safeScore >= 35) {
    return {
      label: 'ELEVATED RISK',
      sublabel: 'ACTION REQUIRED',
      color: '#f97316',
      glow: 'rgba(249, 115, 22, 0.45)',
      badgeBg: 'rgba(249, 115, 22, 0.15)',
      badgeBorder: '#f97316',
      grade: 'C'
    };
  }
  return {
    label: 'CRITICAL RISK',
    sublabel: 'IMMEDIATE MITIGATION',
    color: '#ff1744',
    glow: 'rgba(255, 23, 68, 0.6)',
    badgeBg: 'rgba(255, 23, 68, 0.2)',
    badgeBorder: '#ff1744',
    grade: 'F'
  };
}

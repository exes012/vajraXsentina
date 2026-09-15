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
 * Identify specific module category for any finding
 */
export function getFindingModule(f) {
  if (!f) return 'sast';
  const source = (f.source || '').toUpperCase();
  const scanner = (f.scanner || '').toLowerCase();
  const category = (f.category || '').toLowerCase();
  const title = (f.title || '').toLowerCase();
  const detectedBy = Array.isArray(f.detected_by)
    ? f.detected_by.join(' ').toLowerCase()
    : (f.detected_by || '').toLowerCase();

  // 1. Secrets & Credentials
  if (
    source === 'SECRETS' ||
    source === 'SECRET' ||
    scanner.includes('gitleaks') ||
    scanner.includes('secret') ||
    detectedBy.includes('gitleaks') ||
    detectedBy.includes('secret') ||
    category.includes('secret') ||
    category.includes('credential') ||
    category.includes('private key') ||
    category.includes('token') ||
    Boolean(f.secret_type) ||
    title.includes('secret') ||
    title.includes('token') ||
    title.includes('credential') ||
    title.includes('private key') ||
    title.includes('api key') ||
    title.includes('aws access key') ||
    title.includes('exposed secret')
  ) {
    return 'secrets';
  }

  // 2. SCA (Software Composition Analysis / Dependencies)
  if (
    source === 'SCA' ||
    source === 'DEPS' ||
    source === 'DEPENDENCY' ||
    source === 'DEPENDENCIES' ||
    scanner.includes('osv') ||
    scanner.includes('dependency') ||
    scanner.includes('safety') ||
    detectedBy.includes('osv') ||
    detectedBy.includes('dependency') ||
    category.includes('dependency') ||
    category.includes('vulnerable dependency') ||
    category.includes('supply chain') ||
    Boolean(f.package) ||
    Boolean(f.package_name) ||
    Boolean(f.packageName) ||
    title.toLowerCase().startsWith('vulnerable dependency') ||
    (f.file && (
      f.file.endsWith('package.json') ||
      f.file.endsWith('package-lock.json') ||
      f.file.endsWith('requirements.txt') ||
      f.file.endsWith('yarn.lock') ||
      f.file.endsWith('pnpm-lock.yaml') ||
      f.file.endsWith('pom.xml') ||
      f.file.endsWith('go.mod') ||
      f.file.endsWith('go.sum') ||
      f.file.endsWith('Gemfile')
    ))
  ) {
    return 'sca';
  }

  // 3. Threat Intel / SSL / Nuclei / Security Headers
  if (
    source === 'INTEL' ||
    source === 'THREAT_INTEL' ||
    source === 'THREAT_INTELLIGENCE' ||
    source === 'SSL' ||
    source === 'TLS' ||
    source === 'NUCLEI' ||
    scanner.includes('nuclei') ||
    scanner.includes('ssl') ||
    scanner.includes('tls') ||
    scanner.includes('header') ||
    scanner.includes('testssl') ||
    detectedBy.includes('nuclei') ||
    detectedBy.includes('ssl') ||
    detectedBy.includes('header') ||
    category.includes('ssl') ||
    category.includes('tls') ||
    category.includes('certificate') ||
    category.includes('infrastructure') ||
    title.includes('ssl') ||
    title.includes('tls') ||
    title.includes('cipher') ||
    title.includes('hsts') ||
    title.includes('strict-transport-security') ||
    title.includes('content security policy') ||
    title.includes('x-content-type-options') ||
    title.includes('referrer-policy') ||
    title.includes('permissions-policy')
  ) {
    return 'threat_intel';
  }

  // 4. DAST (Dynamic Application Security Testing / Runtime Web)
  if (
    source === 'DAST' ||
    source === 'DYNAMIC' ||
    source === 'WEB' ||
    scanner.includes('zap') ||
    scanner.includes('wapiti') ||
    scanner.includes('nikto') ||
    scanner.includes('fuzzer') ||
    detectedBy.includes('zap') ||
    detectedBy.includes('wapiti') ||
    detectedBy.includes('nikto') ||
    Boolean(f.endpoint) ||
    category.includes('session management') ||
    category.includes('cookie') ||
    category.includes('runtime') ||
    category.includes('clickjacking') ||
    title.includes('cookie') ||
    title.includes('clickjacking') ||
    title.includes('fuzzing') ||
    title.includes('x-frame-options')
  ) {
    return 'dast';
  }

  // 5. SAST (Static Application Security Testing / Code Analysis)
  return 'sast';
}

/**
 * Extract findings specifically belonging to a module category
 */
export function filterModuleFindings(moduleType, allFindings = []) {
  if (!Array.isArray(allFindings)) return [];
  const type = (moduleType || '').toLowerCase();
  if (type === 'all') return allFindings;

  return allFindings.filter(f => {
    const mod = getFindingModule(f);
    if (type === 'threatintel' || type === 'ssl' || type === 'nuclei') {
      return mod === 'threat_intel';
    }
    return mod === type;
  });
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

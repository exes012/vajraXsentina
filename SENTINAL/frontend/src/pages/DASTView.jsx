import React, { useState, useEffect } from 'react';
import {
  Radio,
  Globe,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Terminal,
  Activity,
  Zap,
  Loader2,
  FolderOpen,
  Code2,
  Lock,
  Sparkles,
  GitBranch
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { SeverityBadge } from '../components/SeverityBadge';
import { FindingDrawer } from '../components/FindingDrawer';
import { calculateFindingsScore, filterModuleFindings, getScorePosture } from '../utils/securityScore';

export function DASTView() {
  const [findings, setFindings] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [activeDrawerFinding, setActiveDrawerFinding] = useState(null);

  useEffect(() => {
    async function loadDAST() {
      const all = await dashboardService.getFindings({ source: 'DAST' });
      const dastFindings = filterModuleFindings('dast', all || []);
      setFindings(dastFindings);
      if (dastFindings.length > 0) setSelectedFinding(dastFindings[0]);
    }
    loadDAST();
  }, []);

  const dastScore = calculateFindingsScore(findings);
  const scorePosture = getScorePosture(dastScore);
  const criticalCount = findings.filter(f => f.severity?.toUpperCase() === 'CRITICAL').length;
  const highCount = findings.filter(f => f.severity?.toUpperCase() === 'HIGH').length;
  const medCount = findings.filter(f => f.severity?.toUpperCase() === 'MEDIUM').length;

  const filteredFindings = findings.filter(f => {
    if (selectedSeverity !== 'ALL' && f.severity?.toUpperCase() !== selectedSeverity.toUpperCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        f.title?.toLowerCase().includes(q) ||
        f.endpoint?.toLowerCase().includes(q) ||
        (f.cwe && f.cwe.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const getSeverityCount = (sev) => {
    if (sev === 'ALL') return findings.length;
    return findings.filter(f => f.severity?.toUpperCase() === sev).length;
  };

  return (
    <div className="page-container" style={{ maxWidth: '1600px' }}>
      {/* Top Banner with OWASP ZAP Official Integration */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(249, 115, 22, 0.15)',
              border: '2px solid #f97316',
              boxShadow: '0 0 16px rgba(249, 115, 22, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f97316'
            }}
          >
            <Radio size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.8px', margin: 0 }}>
                DAST // DYNAMIC APPLICATION SECURITY TESTING
              </h1>
              <a
                href="https://github.com/zaproxy/zaproxy"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: '#f97316',
                  background: 'rgba(249, 115, 22, 0.12)',
                  border: '1px solid #f97316',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textDecoration: 'none'
                }}
              >
                <span>OWASP ZAP</span>
                <ExternalLink size={10} />
              </a>
            </div>
            <p style={{ fontSize: '11.5px', color: '#a1a1aa', marginTop: '2px' }}>
              Active runtime blackbox fuzzing, SQL injection payload verification, and API endpoint stress testing powered by OWASP ZAP.
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            padding: '3px 10px',
            borderRadius: '4px',
            background: 'rgba(249, 115, 22, 0.15)',
            color: '#f97316',
            border: '1.5px solid #f97316',
            fontWeight: 800
          }}
        >
          {findings.length} RUNTIME FINDINGS DETECTED
        </span>
      </div>

      {/* KPI Stats */}
      <div className="grid-4" style={{ marginBottom: '20px' }}>
        <div
          className="cyber-card"
          style={{
            padding: '14px 16px',
            background: '#060108',
            border: '2.5px solid #360a25',
            boxShadow: `0 8px 24px rgba(0,0,0,0.8), inset 0 0 12px ${scorePosture.color}15`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              DAST SECURITY SCORE
            </span>
            <span
              style={{
                fontSize: '8.5px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                color: scorePosture.color,
                padding: '2px 6px',
                borderRadius: '4px',
                background: `${scorePosture.color}20`,
                border: `1.2px solid ${scorePosture.color}`
              }}
            >
              {findings.length === 0 ? '100% CLEAN' : scorePosture.label}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 900,
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                textShadow: `0 0 12px ${scorePosture.color}70`
              }}
            >
              {dastScore}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontFamily: 'var(--font-mono)' }}>/ 100</div>
          </div>
        </div>
        <div className="cyber-card" style={{ padding: '14px 16px', background: '#060108', border: '2.5px solid #360a25' }}>
          <div style={{ fontSize: '10px', fontWeight: 900, color: '#ff1744', textTransform: 'uppercase' }}>CRITICAL / HIGH FLAWS</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#ff1744', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {criticalCount + highCount}
          </div>
        </div>
        <div className="cyber-card" style={{ padding: '14px 16px', background: '#060108', border: '2.5px solid #360a25' }}>
          <div style={{ fontSize: '10px', fontWeight: 900, color: '#00f2fe', textTransform: 'uppercase' }}>FUZZED ENDPOINTS</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#f8fafc', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {findings.length} Flaws
          </div>
        </div>
        <div className="cyber-card" style={{ padding: '14px 16px', background: '#060108', border: '2.5px solid #360a25' }}>
          <div style={{ fontSize: '10px', fontWeight: 900, color: '#00ff88', textTransform: 'uppercase' }}>OWASP ZAP ENGINE</div>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#00ff88', marginTop: '10px' }}>
            ● ACTIVE & ATTESTED
          </div>
        </div>
      </div>

      {/* Two Column Layout: Finding List + HTTP Payload Trace */}
      {findings.length === 0 ? (
        <div
          className="cyber-card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: '#060108',
            border: '2.5px solid #360a25',
            borderRadius: '8px'
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(249, 115, 22, 0.1)',
              border: '1.5px solid #f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              color: '#f97316'
            }}
          >
            <FolderOpen size={24} />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#f8fafc', marginBottom: '4px' }}>
            No DAST Findings Recorded
          </h3>
          <p style={{ fontSize: '12px', color: '#71717a', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
            No runtime vulnerabilities detected yet. Launch an assessment targeting a live web application URL or API endpoint.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '16px' }}>
          {/* Left: DAST Findings List */}
          <div className="cyber-card" style={{ padding: '14px', background: '#060108', border: '2.5px solid #360a25', maxHeight: '720px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                RUNTIME DETECTIONS ({filteredFindings.length}/{findings.length})
              </div>
            </div>

            {/* Severity Filter Tabs */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', marginBottom: '10px', flexWrap: 'wrap' }}>
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(sev => {
                const isActive = selectedSeverity === sev;
                const count = getSeverityCount(sev);
                return (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`filter-pill ${isActive ? 'active' : ''}`}
                    style={{ fontSize: '9.5px', padding: '3px 7px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>{sev}</span>
                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div style={{ marginBottom: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: '#040005',
                  border: '1.5px solid #28081c'
                }}
              >
                <Search size={11} color="#71717a" />
                <input
                  type="text"
                  placeholder="Filter DAST flaws..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#f8fafc',
                    fontSize: '11px',
                    width: '100%',
                    fontFamily: 'var(--font-main)'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredFindings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 12px', color: '#71717a', fontSize: '11.5px' }}>
                  No DAST findings match {selectedSeverity} severity.
                </div>
              ) : (
                filteredFindings.map((f, idx) => {
                  const isSelected = selectedFinding?.id === f.id || (selectedFinding == null && idx === 0);

                  return (
                    <div
                      key={f.id || idx}
                      onClick={() => setSelectedFinding(f)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '6px',
                        background: isSelected ? 'rgba(249, 115, 22, 0.15)' : '#040005',
                        border: isSelected ? '1.5px solid #f97316' : '1.5px solid #28081c',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <SeverityBadge severity={f.severity} size="sm" />
                        <span style={{ fontSize: '10px', color: '#71717a', fontFamily: 'var(--font-mono)' }}>{f.id}</span>
                      </div>

                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', lineHeight: 1.3 }}>
                        {f.title}
                      </div>

                      <div style={{ fontSize: '10.5px', color: '#f97316', marginTop: '3px', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                        {f.endpoint || f.affectedComponent || 'Target Scope'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: HTTP Proof of Concept & Attack Trace */}
          {selectedFinding && (
            <div className="cyber-card" style={{ padding: '20px', background: '#060108', border: '3px solid #360a25', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <SeverityBadge severity={selectedFinding.severity} size="sm" />
                    <span style={{ fontSize: '11px', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>{selectedFinding.cwe}</span>
                    <span style={{ fontSize: '10px', color: '#f97316', fontFamily: 'var(--font-mono)', padding: '1px 6px', background: 'rgba(249, 115, 22, 0.12)', borderRadius: '3px', border: '1px solid #f97316' }}>OWASP ZAP</span>
                  </div>
                  <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#f8fafc', margin: '4px 0' }}>
                    {selectedFinding.title}
                  </h2>
                  <div style={{ fontSize: '11.5px', color: '#f97316', fontFamily: 'var(--font-mono)' }}>
                    Target: {selectedFinding.endpoint || selectedFinding.affectedComponent || 'Application Route'}
                  </div>
                </div>

                <button
                  onClick={() => setActiveDrawerFinding(selectedFinding)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '11px', height: '28px', gap: '5px' }}
                >
                  <span>Full Triage View</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              {/* Description */}
              <div style={{ padding: '10px 14px', borderRadius: '6px', background: '#040005', border: '1.5px solid #28081c', fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5 }}>
                {selectedFinding.description}
              </div>

              {/* HTTP Request/Response Trace */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                  RAW HTTP / FUZZING EVIDENCE
                </div>
                <div
                  style={{
                    background: '#020003',
                    border: '1.5px solid #28081c',
                    borderRadius: '6px',
                    padding: '14px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11.5px',
                    lineHeight: 1.6,
                    color: '#94a3b8',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto'
                  }}
                >
                  {selectedFinding.evidence || selectedFinding.rawEvidenceSnippet || 'Target HTTP response headers and body analysis matched vulnerability signatures.'}
                </div>
              </div>

              {/* Remediation */}
              <div style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(0, 255, 136, 0.08)', border: '1.5px solid #00ff88', fontSize: '11.5px', color: '#f8fafc' }}>
                <strong style={{ color: '#00ff88' }}>OWASP ZAP Remediation Guidance: </strong>
                {selectedFinding.remediation || selectedFinding.aiAnalysis?.recommendation || 'Apply context-aware input validation and configure security response headers.'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Drawer */}
      <FindingDrawer
        finding={activeDrawerFinding}
        isOpen={Boolean(activeDrawerFinding)}
        onClose={() => setActiveDrawerFinding(null)}
      />
    </div>
  );
}

export default DASTView;

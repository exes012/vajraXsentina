import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Lock,
  GitCommit,
  FolderOpen
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { SeverityBadge } from '../components/SeverityBadge';
import { FindingDrawer } from '../components/FindingDrawer';
import { calculateFindingsScore, filterModuleFindings, getScorePosture } from '../utils/securityScore';

export function SecretsView() {
  const [findings, setFindings] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [activeDrawerFinding, setActiveDrawerFinding] = useState(null);

  useEffect(() => {
    async function loadSecrets() {
      const all = await dashboardService.getFindings({ source: 'Secrets' });
      const secretsFindings = filterModuleFindings('secrets', all || []);
      setFindings(secretsFindings);
      if (secretsFindings.length > 0) setSelectedFinding(secretsFindings[0]);
    }
    loadSecrets();
  }, []);

  const secretsScore = calculateFindingsScore(findings);
  const scorePosture = getScorePosture(secretsScore);
  const criticalCount = findings.filter(f => f.severity?.toUpperCase() === 'CRITICAL').length;
  const highCount = findings.filter(f => f.severity?.toUpperCase() === 'HIGH').length;

  const filteredFindings = findings.filter(f => {
    if (selectedSeverity !== 'ALL' && f.severity?.toUpperCase() !== selectedSeverity.toUpperCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        f.title?.toLowerCase().includes(q) ||
        f.affectedComponent?.toLowerCase().includes(q);
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
      {/* Top Banner */}
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
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(255, 23, 68, 0.15)',
              border: '2px solid #ff1744',
              boxShadow: '0 0 14px rgba(255, 23, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <KeyRound size={20} color="#ff1744" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.8px' }}>
              SECRET SCANNING & CREDENTIAL AUDIT
            </h1>
            <p style={{ fontSize: '11.5px', color: '#a1a1aa', marginTop: '2px' }}>
              Entropy-based pattern matching, API token leak detection, and historical git commit log auditing.
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(255, 23, 68, 0.12)',
            color: '#ff1744',
            border: '1.5px solid #ff1744',
            fontWeight: 800,
            boxShadow: '0 0 10px rgba(255, 23, 68, 0.25)'
          }}
        >
          {findings.length} Secrets Detected
        </span>
      </div>

      {/* KPI Stats - Explicit Secrets Security Score */}
      <div className="grid-4" style={{ marginBottom: '20px' }}>
        {/* Secrets Security Score */}
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
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#ff1744', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              SECRETS SECURITY SCORE
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
              {secretsScore}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontFamily: 'var(--font-mono)' }}>/ 100</div>
          </div>
        </div>

        {/* Critical Leaks */}
        <div
          className="cyber-card"
          style={{
            padding: '14px 16px',
            background: '#060108',
            border: '2.5px solid #360a25',
            boxShadow: '0 8px 24px rgba(0,0,0,0.8), inset 0 0 12px rgba(255, 23, 68, 0.05)'
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 900, color: '#ff1744', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            CRITICAL CREDENTIAL LEAKS
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#ff1744', fontFamily: 'var(--font-mono)', marginTop: '6px', textShadow: '0 0 12px rgba(255, 23, 68, 0.6)' }}>
            {criticalCount}
          </div>
        </div>

        {/* Exposed Credentials Count */}
        <div
          className="cyber-card"
          style={{
            padding: '14px 16px',
            background: '#060108',
            border: '2.5px solid #360a25'
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            TOTAL EXPOSED SECRETS
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#fbbf24', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
            {findings.length}
          </div>
        </div>

        {/* Revocation Status */}
        <div
          className="cyber-card"
          style={{
            padding: '14px 16px',
            background: '#060108',
            border: '2.5px solid #360a25'
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 900, color: '#00ff88', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            REVOCATION POSTURE
          </div>
          <div style={{ fontSize: '14px', fontWeight: 900, color: findings.length > 0 ? '#ff1744' : '#00ff88', marginTop: '10px' }}>
            {findings.length > 0 ? '● ROTATION REQUIRED' : '● NO LEAKS DETECTED'}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Finding List + Secret Inspector */}
      {findings.length === 0 ? (
        <div
          className="cyber-card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: '#040713',
            border: '1px dashed #14203a',
            borderRadius: '12px'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#f59e0b'
            }}
          >
            <FolderOpen size={28} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
            No Exposed Secrets Found
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
            No unmasked API keys, cloud tokens, database passwords, or private keys detected in repositories.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px' }}>
          {/* Left: Secrets Findings List */}
          <div className="cyber-card" style={{ padding: '16px', maxHeight: '720px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                DETECTED CREDENTIALS ({filteredFindings.length}/{findings.length})
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
                  background: '#040711',
                  border: '1px solid #141f38'
                }}
              >
                <Search size={11} color="#64748b" />
                <input
                  type="text"
                  placeholder="Filter secret leaks..."
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredFindings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 12px', color: '#64748b', fontSize: '11.5px' }}>
                  No secret leaks match {selectedSeverity} severity.
                </div>
              ) : (
                filteredFindings.map(f => {
                  const isSelected = selectedFinding?.id === f.id;

                  return (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFinding(f)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        background: isSelected ? '#1c1508' : '#080d1c',
                        border: isSelected ? '1.5px solid #f59e0b' : '1px solid #141f38',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <SeverityBadge severity={f.severity} size="sm" />
                        <span style={{ fontSize: '10.5px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{f.id}</span>
                      </div>

                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>
                        {f.title}
                      </div>

                      <div style={{ fontSize: '10.5px', color: '#f59e0b', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                        {f.affectedComponent}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Secret Redaction & Token Audit */}
          {selectedFinding && (
            <div className="cyber-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <SeverityBadge severity={selectedFinding.severity} size="sm" />
                    <span style={{ fontSize: '11.5px', color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>HIGH CONFIDENCE ENTROPY</span>
                  </div>
                  <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc' }}>
                    {selectedFinding.title}
                  </h2>
                  <div style={{ fontSize: '12px', color: '#f59e0b', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    File Location: {selectedFinding.affectedComponent}
                  </div>
                </div>

                <button
                  onClick={() => setActiveDrawerFinding(selectedFinding)}
                  className="btn btn-primary btn-sm"
                >
                  <span>Full Triage View</span>
                  <ExternalLink size={13} />
                </button>
              </div>

              {/* Description */}
              <div style={{ padding: '12px', borderRadius: '8px', background: '#090e1f', border: '1px solid #141f38', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                {selectedFinding.description}
              </div>

              {/* Masked Secret Snippet */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#ff3366', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Masked Secret Evidence (Zero-Leakage Policy)
                </div>
                <div
                  style={{
                    background: '#040711',
                    border: '1px solid #162242',
                    borderRadius: '8px',
                    padding: '16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12.5px',
                    lineHeight: 1.6,
                    color: '#ff3366'
                  }}
                >
                  {selectedFinding.codeSnippet || selectedFinding.rawEvidenceSnippet || 'AWS_SECRET_ACCESS_KEY=********'}
                </div>
              </div>

              {/* AI Recommendation */}
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '12px', color: '#e2e8f0' }}>
                <strong style={{ color: '#f59e0b' }}>Key Revocation Playbook: </strong>
                {selectedFinding.aiAnalysis?.recommendation || selectedFinding.remediation}
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

export default SecretsView;

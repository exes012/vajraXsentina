import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Package,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  GitPullRequest,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { SeverityBadge } from '../components/SeverityBadge';
import { calculateFindingsScore, filterModuleFindings, getScorePosture } from '../utils/securityScore';

export function SCAView() {
  const [findings, setFindings] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [activeDrawerFinding, setActiveDrawerFinding] = useState(null);

  useEffect(() => {
    async function loadSCA() {
      const all = await dashboardService.getFindings({ source: 'SCA' });
      const scaFindings = filterModuleFindings('sca', all || []);
      setFindings(scaFindings);
      if (scaFindings.length > 0) setSelectedFinding(scaFindings[0]);
    }
    loadSCA();
  }, []);

  const scaScore = calculateFindingsScore(findings);
  const scorePosture = getScorePosture(scaScore);
  const criticalCount = findings.filter(f => f.severity?.toUpperCase() === 'CRITICAL').length;

  const filteredFindings = findings.filter(f => {
    if (selectedSeverity !== 'ALL' && f.severity?.toUpperCase() !== selectedSeverity.toUpperCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        f.title?.toLowerCase().includes(q) ||
        f.affectedComponent?.toLowerCase().includes(q) ||
        (f.cve && f.cve.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const getSeverityCount = (sev) => {
    if (sev === 'ALL') return findings.length;
    return findings.filter(f => f.severity?.toUpperCase() === sev).length;
  };

  return (
    <div className="page-container">
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(0, 242, 254, 0.15)',
              border: '1px solid rgba(0, 242, 254, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Boxes size={22} color="#00f2fe" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f8fafc' }}>
              SCA: Software Composition Analysis
            </h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
              Third-party dependency scanning, CVE database correlation, and automated fix version suggestions.
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '11.5px',
            fontFamily: 'var(--font-mono)',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(0, 242, 254, 0.12)',
            color: '#00f2fe',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            fontWeight: 700
          }}
        >
          {findings.length} Vulnerable Dependencies Detected
        </span>
      </div>

      {/* KPI Stats */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="cyber-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>SCA Security Score</span>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: scorePosture.color }}>
              {findings.length === 0 ? '100% CLEAN' : scorePosture.label}
            </span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: scorePosture.color, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {scaScore}/100
          </div>
        </div>
        <div className="cyber-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#ff3366' }}>Critical CVEs</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#ff3366', fontFamily: 'var(--font-mono)' }}>
            {criticalCount}
          </div>
        </div>
        <div className="cyber-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Vulnerable Packages</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
            {findings.length} Packages
          </div>
        </div>
        <div className="cyber-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#10b981' }}>License Risk</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#10b981', marginTop: '6px' }}>
            0 Infringements
          </div>
        </div>
      </div>

      {/* Two Column Layout: Finding List + Dependency Inspector */}
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
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#00f2fe'
            }}
          >
            <FolderOpen size={28} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
            No Vulnerable Dependencies Found
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
            All dependency manifests (package.json, requirements.txt, pom.xml, etc.) have zero known open CVEs.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px' }}>
          {/* Left: SCA Findings List */}
          <div className="cyber-card" style={{ padding: '16px', maxHeight: '720px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                VULNERABLE PACKAGES ({filteredFindings.length}/{findings.length})
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
                  placeholder="Filter SCA packages..."
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
                  No SCA packages match {selectedSeverity} severity.
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
                        background: isSelected ? '#0a1d2e' : '#080d1c',
                        border: isSelected ? '1.5px solid #00f2fe' : '1px solid #141f38',
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

                      <div style={{ fontSize: '10.5px', color: '#00f2fe', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                        {f.cve || f.affectedComponent}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Package Context & Upgrade Path */}
          {selectedFinding && (
            <div className="cyber-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <SeverityBadge severity={selectedFinding.severity} size="sm" />
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>{selectedFinding.cve}</span>
                  </div>
                  <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc' }}>
                    {selectedFinding.title}
                  </h2>
                  <div style={{ fontSize: '12px', color: '#00f2fe', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    Package: {selectedFinding.affectedComponent}
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

              {/* Version Upgrade Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <GitPullRequest size={18} color="#10b981" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                      Remediation Upgrade Available
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                      Update to safe release to resolve CVE exposure.
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    color: '#10b981',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.15)'
                  }}
                >
                  {selectedFinding.remediation || 'Upgrade package'}
                </span>
              </div>

              {/* AI Recommendation */}
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.2)', fontSize: '12px', color: '#e2e8f0' }}>
                <strong style={{ color: '#00f2fe' }}>AI Supply Chain Note: </strong>
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

export default SCAView;

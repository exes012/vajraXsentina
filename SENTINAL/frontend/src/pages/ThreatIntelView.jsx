import React, { useState, useEffect } from 'react';
import {
  Globe2,
  Radio,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Terminal,
  Activity,
  Zap,
  FolderOpen
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { SeverityBadge } from '../components/SeverityBadge';
import { FindingDrawer } from '../components/FindingDrawer';
import { calculateFindingsScore, filterModuleFindings, getScorePosture } from '../utils/securityScore';

export function ThreatIntelView() {
  const [findings, setFindings] = useState([]);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [activeDrawerFinding, setActiveDrawerFinding] = useState(null);

  useEffect(() => {
    async function loadIntel() {
      const all = await dashboardService.getFindings({ source: 'Threat Intelligence' });
      const intelFindings = filterModuleFindings('threat_intel', all || []);
      setFindings(intelFindings);
      if (intelFindings.length > 0) setSelectedFinding(intelFindings[0]);
    }
    loadIntel();
  }, []);

  const intelScore = calculateFindingsScore(findings);
  const scorePosture = getScorePosture(intelScore);
  const criticalCount = findings.filter(f => f.severity?.toUpperCase() === 'CRITICAL').length;

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
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Globe2 size={22} color="#10b981" />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f8fafc' }}>
              Threat Intelligence & Attack Surface
            </h1>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>
              Zero-day vulnerability tracking, dark web credential leak feeds, and external IP reputation IOCs.
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '11.5px',
            fontFamily: 'var(--font-mono)',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10b981',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontWeight: 700
          }}
        >
          {findings.length} Threat Intelligence Alerts
        </span>
      </div>

      {/* KPI Stats */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="cyber-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Threat Intel Score</span>
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: scorePosture.color }}>
              {findings.length === 0 ? '100% CLEAN' : scorePosture.label}
            </span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: scorePosture.color, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {intelScore}/100
          </div>
        </div>
        <div className="cyber-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#ff3366' }}>Critical Exposure</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#ff3366', fontFamily: 'var(--font-mono)' }}>
            {criticalCount}
          </div>
        </div>
        <div className="cyber-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Active Alerts</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
            {findings.length} Alerts
          </div>
        </div>
        <div className="cyber-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: '#00f2fe' }}>Surface Watch</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: findings.length > 0 ? '#ff3366' : '#10b981', marginTop: '6px' }}>
            {findings.length > 0 ? 'Active Surface Alerts' : 'Monitoring / Ready'}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Finding List + Intel Inspector */}
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
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#10b981'
            }}
          >
            <FolderOpen size={28} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
            No External Threat Alerts Detected
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
            No dark web breaches, active malware IOCs, or zero-day exploits targeting your assets have been indexed.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px' }}>
          {/* Left: Threat Intel Findings List */}
          <div className="cyber-card" style={{ padding: '16px', maxHeight: '680px', overflowY: 'auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>
              External Surface Alerts ({findings.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {findings.map(f => {
                const isSelected = selectedFinding?.id === f.id;

                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFinding(f)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: isSelected ? '#081c15' : '#080d1c',
                      border: isSelected ? '1px solid #10b981' : '1px solid #141f38',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <SeverityBadge severity={f.severity} size="sm" />
                      <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{f.id}</span>
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', lineHeight: 1.3 }}>
                      {f.title}
                    </div>

                    <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                      {f.affectedComponent}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Threat Intelligence Analysis */}
          {selectedFinding && (
            <div className="cyber-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <SeverityBadge severity={selectedFinding.severity} size="sm" />
                    <span style={{ fontSize: '11.5px', color: '#10b981' }}>THREAT FEED MATCH</span>
                  </div>
                  <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc' }}>
                    {selectedFinding.title}
                  </h2>
                  <div style={{ fontSize: '12px', color: '#10b981', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    Target Indicator: {selectedFinding.affectedComponent}
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

              {/* Threat Feed Context */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Threat Intelligence Context & IOC
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
                    color: '#94a3b8'
                  }}
                >
                  {selectedFinding.rawEvidenceSnippet || 'Target domain identified in active threat feeds.'}
                </div>
              </div>

              {/* AI Recommendation */}
              <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '12px', color: '#e2e8f0' }}>
                <strong style={{ color: '#10b981' }}>AI Defensive Strategy: </strong>
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

export default ThreatIntelView;

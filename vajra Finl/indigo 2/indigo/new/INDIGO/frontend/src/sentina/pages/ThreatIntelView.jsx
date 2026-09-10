'use client'
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
import { SeverityBadge, getRatingMeta } from '../components/SeverityBadge';
import { FindingDrawer } from '../components/FindingDrawer';
import { calculateFindingsScore, filterModuleFindings, getScorePosture } from '../utils/securityScore';

export function ThreatIntelView() {
  const [findings, setFindings] = useState(() => filterModuleFindings('threat_intel', dashboardService.getInitialFindings()));
  const [selectedRating, setSelectedRating] = useState('ALL');
  const [selectedFinding, setSelectedFinding] = useState(() => {
    const init = filterModuleFindings('threat_intel', dashboardService.getInitialFindings());
    return init.length > 0 ? init[0] : null;
  });
  const [activeDrawerFinding, setActiveDrawerFinding] = useState(null);

  useEffect(() => {
    async function loadIntel() {
      const all = await dashboardService.getFindings();
      const intelFindings = filterModuleFindings('threat_intel', all || []);
      setFindings(intelFindings);
      if (intelFindings.length > 0) setSelectedFinding(intelFindings[0]);
    }
    loadIntel();
    const unsubscribe = dashboardService.subscribe(loadIntel);
    return () => unsubscribe();
  }, []);

  const intelScore = calculateFindingsScore(findings);
  const scorePosture = getScorePosture(intelScore);
  const criticalCount = findings.filter(f => getRatingMeta(f.severity || f.rating).key === 'CRITICAL').length;
  const highCount = findings.filter(f => getRatingMeta(f.severity || f.rating).key === 'HIGH').length;

  const ratingOptions = [
    { key: 'ALL', label: 'ALL' },
    { key: 'CRITICAL', label: 'CRITICAL RISK' },
    { key: 'HIGH', label: 'ELEVATED RISK' },
    { key: 'MEDIUM', label: 'MODERATE RISK' },
    { key: 'LOW', label: 'LOW RISK' },
    { key: 'INFO', label: 'INFORMATIONAL' }
  ];

  const getRatingCount = (key) => {
    if (key === 'ALL') return findings.length;
    return findings.filter(f => getRatingMeta(f.severity || f.rating).key === key).length;
  };

  const filteredFindings = findings.filter(f => {
    if (selectedRating !== 'ALL') {
      const meta = getRatingMeta(f.severity || f.rating);
      if (meta.key !== selectedRating && meta.label !== selectedRating) {
        return false;
      }
    }
    return true;
  });

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
              background: 'rgba(251, 191, 36, 0.15)',
              border: '2px solid #fbbf24',
              boxShadow: '0 0 14px rgba(251, 191, 36, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Globe2 size={20} color="#fbbf24" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.8px', margin: 0 }}>
              THREAT INTELLIGENCE & EXTERNAL SURFACE
            </h1>
            <p style={{ fontSize: '11.5px', color: '#a1a1aa', marginTop: '2px' }}>
              Zero-day vulnerability tracking, dark web credential leak feeds, and external IP reputation IOCs.
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            padding: '3px 10px',
            borderRadius: '4px',
            background: 'rgba(251, 191, 36, 0.15)',
            color: '#fbbf24',
            border: '1.5px solid #fbbf24',
            fontWeight: 800
          }}
        >
          {findings.length} EXTERNAL ALERTS DETECTED
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
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              THREAT INTEL SCORE
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
              {findings.length === 0 ? 'OPTIMAL DEFENSE' : scorePosture.label}
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
              {intelScore}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontFamily: 'var(--font-mono)' }}>/ 100</div>
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '14px 16px', background: '#060108', border: '2.5px solid #360a25' }}>
          <div style={{ fontSize: '10px', fontWeight: 900, color: '#ff1744', textTransform: 'uppercase' }}>CRITICAL & ELEVATED RISKS</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#ff1744', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {criticalCount + highCount}
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '14px 16px', background: '#060108', border: '2.5px solid #360a25' }}>
          <div style={{ fontSize: '10px', fontWeight: 900, color: '#00f2fe', textTransform: 'uppercase' }}>ACTIVE ALERTS</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#f8fafc', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {findings.length} Alerts
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '14px 16px', background: '#060108', border: '2.5px solid #360a25' }}>
          <div style={{ fontSize: '10px', fontWeight: 900, color: '#00ff88', textTransform: 'uppercase' }}>SURFACE RADAR</div>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#00ff88', marginTop: '10px' }}>
            ● MONITORING ACTIVE
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
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1.5px solid #fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              color: '#fbbf24'
            }}
          >
            <FolderOpen size={24} />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#f8fafc', marginBottom: '4px' }}>
            No External Threat Alerts Detected
          </h3>
          <p style={{ fontSize: '12px', color: '#71717a', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
            No dark web breaches, active malware IOCs, or zero-day exploits targeting your assets have been indexed.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '16px' }}>
          {/* Left: Threat Intel Findings List */}
          <div className="cyber-card" style={{ padding: '14px', background: '#060108', border: '2.5px solid #360a25', maxHeight: '720px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                SURFACE ALERTS ({filteredFindings.length}/{findings.length})
              </div>
            </div>

            {/* Threat Rating Filter Tabs */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', marginBottom: '10px', flexWrap: 'wrap' }}>
              {ratingOptions.map(opt => {
                const isActive = selectedRating === opt.key;
                const count = getRatingCount(opt.key);
                return (
                  <button
                    key={opt.key}
                    onClick={() => setSelectedRating(opt.key)}
                    className={`filter-pill ${isActive ? 'active' : ''}`}
                    style={{ fontSize: '9px', padding: '3px 7px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>{opt.label}</span>
                    <span style={{ fontSize: '8.5px', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>({count})</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredFindings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 12px', color: '#71717a', fontSize: '11.5px' }}>
                  No surface alerts match selected rating filter.
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
                        background: isSelected ? 'rgba(251, 191, 36, 0.15)' : '#040005',
                        border: isSelected ? '1.5px solid #fbbf24' : '1.5px solid #28081c',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <SeverityBadge severity={f.severity || f.rating} size="sm" />
                        <span style={{ fontSize: '10px', color: '#71717a', fontFamily: 'var(--font-mono)' }}>{f.id}</span>
                      </div>

                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', lineHeight: 1.3 }}>
                        {f.title}
                      </div>

                      <div style={{ fontSize: '10.5px', color: '#fbbf24', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>
                        {f.affectedComponent}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Threat Intelligence Analysis */}
          {selectedFinding && (
            <div className="cyber-card" style={{ padding: '20px', background: '#060108', border: '3px solid #360a25', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <SeverityBadge severity={selectedFinding.severity || selectedFinding.rating} size="sm" />
                    <span style={{ fontSize: '11px', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>THREAT FEED MATCH</span>
                  </div>
                  <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#f8fafc', margin: '4px 0' }}>
                    {selectedFinding.title}
                  </h2>
                  <div style={{ fontSize: '11.5px', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                    Target Indicator: {selectedFinding.affectedComponent}
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

              {/* Threat Feed Context */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                  THREAT INTELLIGENCE CONTEXT & IOC
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
                  {selectedFinding.rawEvidenceSnippet || 'Target domain identified in active threat intelligence feeds.'}
                </div>
              </div>

              {/* AI Recommendation */}
              <div style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(0, 255, 136, 0.08)', border: '1.5px solid #00ff88', fontSize: '11.5px', color: '#f8fafc' }}>
                <strong style={{ color: '#00ff88' }}>AI Defensive Strategy: </strong>
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

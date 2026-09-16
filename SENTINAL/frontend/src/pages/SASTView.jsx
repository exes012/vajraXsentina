import React, { useState, useEffect } from 'react';
import {
  Code2,
  FileCode,
  AlertTriangle,
  CheckCircle2,
  Search,
  ExternalLink,
  ShieldAlert,
  GitBranch,
  Terminal,
  Zap,
  FolderOpen
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { SeverityBadge } from '../components/SeverityBadge';
import { FindingDrawer } from '../components/FindingDrawer';
import { calculateFindingsScore, filterModuleFindings, getScorePosture, getFindingCodeSnippet, getFindingRemediation } from '../utils/securityScore';

export function SASTView() {
  const [sastRepoInput, setSastRepoInput] = useState('https://github.com/company/core-api');
  const [isStarting, setIsStarting] = useState(false);
  const [findings, setFindings] = useState(() => filterModuleFindings('sast', dashboardService.getInitialFindings({ module: 'sast' })));
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFinding, setSelectedFinding] = useState(() => {
    const init = filterModuleFindings('sast', dashboardService.getInitialFindings({ module: 'sast' }));
    return init.length > 0 ? init[0] : null;
  });
  const [activeDrawerFinding, setActiveDrawerFinding] = useState(null);

  const handleStartSAST = async () => {
    if (!sastRepoInput.trim()) return;
    setIsStarting(true);
    try {
      await dashboardService.triggerNewScan({
        targetType: 'source',
        repoUrl: sastRepoInput.trim(),
        scanners: {
          sast: true,
          sca: false,
          secrets: false,
          discovery: false,
          dast: false,
          nuclei: false,
          wapiti: false,
          headers: false,
          ssl: false
        }
      });
    } catch (e) {
      console.warn('Start SAST error:', e);
    } finally {
      setIsStarting(false);
    }
  };

  useEffect(() => {
    async function loadSAST() {
      const all = await dashboardService.getFindings({ all: true });
      const sastFindings = filterModuleFindings('sast', all || []);
      setFindings(sastFindings);
      if (sastFindings.length > 0) {
        setSelectedFinding(prev => (prev && sastFindings.some(f => f.id === prev.id) ? prev : sastFindings[0]));
      }
    }
    loadSAST();
    const unsubscribe = dashboardService.subscribe(loadSAST);
    return () => unsubscribe();
  }, []);

  const sastScore = calculateFindingsScore(findings);
  const scorePosture = getScorePosture(sastScore);
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
        f.affectedComponent?.toLowerCase().includes(q) ||
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
              background: 'rgba(0, 242, 254, 0.15)',
              border: '2px solid #00f2fe',
              boxShadow: '0 0 14px rgba(0, 242, 254, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Code2 size={20} color="#00f2fe" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.8px' }}>
              SAST: STATIC APPLICATION SECURITY TESTING
            </h1>
            <p style={{ fontSize: '11.5px', color: '#a1a1aa', marginTop: '2px' }}>
              Deep AST rule evaluation, tainted variable flow tracking, and syntax-level vulnerability detection.
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(0, 242, 254, 0.12)',
            color: '#00f2fe',
            border: '1.5px solid #00f2fe',
            fontWeight: 800,
            boxShadow: '0 0 10px rgba(0, 242, 254, 0.25)'
          }}
        >
          {findings.length} SAST Flaws Detected
        </span>
      </div>

      {/* Quick SAST Assessment Launcher Card */}
      <div
        className="cyber-card"
        style={{
          padding: '16px 20px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <Code2 size={22} color="#00f2fe" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
              TARGET REPOSITORY FOR SAST ANALYSIS
            </div>
            <input
              type="text"
              placeholder="https://github.com/company/project"
              value={sastRepoInput}
              onChange={e => setSastRepoInput(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <button
          onClick={handleStartSAST}
          disabled={isStarting}
          style={{
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 800,
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
            color: '#020617',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isStarting ? 'Initiating SAST...' : 'Start SAST Assessment'}
        </button>
      </div>

      {/* KPI Stats - Explicit SAST Security Score */}
      <div className="grid-4" style={{ marginBottom: '20px' }}>
        {/* SAST Security Score */}
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
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              SAST SECURITY SCORE
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
              {scorePosture.label}
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
              {sastScore}
            </div>
            <div style={{ fontSize: '12px', color: '#71717a', fontFamily: 'var(--font-mono)' }}>/ 100</div>
          </div>
        </div>

        {/* Critical Flaws */}
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
            CRITICAL CODE FLAWS
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#ff1744', fontFamily: 'var(--font-mono)', marginTop: '6px', textShadow: '0 0 12px rgba(255, 23, 68, 0.6)' }}>
            {criticalCount}
          </div>
        </div>

        {/* High Severity Flaws */}
        <div
          className="cyber-card"
          style={{
            padding: '14px 16px',
            background: '#060108',
            border: '2.5px solid #360a25'
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 900, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            HIGH SEVERITY ISSUES
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#f97316', fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
            {highCount}
          </div>
        </div>

        {/* Engine Status */}
        <div
          className="cyber-card"
          style={{
            padding: '14px 16px',
            background: '#060108',
            border: '2.5px solid #360a25'
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 900, color: '#00ff88', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            AST ENGINE STATUS
          </div>
          <div style={{ fontSize: '14px', fontWeight: 900, color: findings.length > 0 ? '#00ff88' : '#71717a', marginTop: '10px' }}>
            {findings.length > 0 ? '● ONLINE // MONITORED' : '○ IDLE / READY'}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Finding List + Code Viewer */}
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
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#38bdf8'
            }}
          >
            <FolderOpen size={28} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
            No SAST Findings Detected
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
            No static code analysis findings have been recorded. Launch a new assessment with a GitHub repository or source directory.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px' }}>
          {/* Left: SAST Findings List */}
          <div className="cyber-card" style={{ padding: '16px', maxHeight: '720px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                STATIC CODE FINDINGS ({filteredFindings.length}/{findings.length})
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
            <div style={{ marginBottom: '12px' }}>
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
                  placeholder="Filter SAST flaws..."
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
                  No SAST findings match {selectedSeverity} severity.
                </div>
              ) : (
                filteredFindings.map((f, idx) => {
                  const isSelected = String(selectedFinding?.id) === String(f.id);

                  return (
                    <div
                      key={f.id || idx}
                      onClick={() => setSelectedFinding(f)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '6px',
                        background: isSelected ? 'rgba(0, 242, 254, 0.15)' : '#040005',
                        border: isSelected ? '1.5px solid #00f2fe' : '1.5px solid #28081c',
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

                      <div style={{ fontSize: '10.5px', color: '#00f2fe', marginTop: '3px', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                        {f.affectedComponent || (f.file ? (f.line ? `${f.file}:${f.line}` : f.file) : 'Source Code')}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Code Inspector */}
          {selectedFinding && (
            <div className="cyber-card" style={{ padding: '20px', background: '#060108', border: '3px solid #360a25', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <SeverityBadge severity={selectedFinding.severity || selectedFinding.rating} size="sm" />
                    <span style={{ fontSize: '11px', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                      {selectedFinding.cwe || 'CWE Flaw'}
                    </span>
                    {selectedFinding.cve && (
                      <span style={{ fontSize: '11px', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                        {selectedFinding.cve}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#f8fafc', margin: '4px 0' }}>
                    {selectedFinding.title}
                  </h2>
                  <div style={{ fontSize: '11.5px', color: '#00f2fe', fontFamily: 'var(--font-mono)' }}>
                    File: {selectedFinding.affectedComponent || (selectedFinding.file ? (selectedFinding.line ? `${selectedFinding.file}:${selectedFinding.line}` : selectedFinding.file) : 'src/app.js')}
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
                {selectedFinding.description || 'Static code analysis engine identified a high-risk tainted variable flow reaching a critical execution sink.'}
              </div>

              {/* Code Snippet */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                  VULNERABLE AST SINK / CODE SNIPPET
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
                    color: '#38bdf8',
                    whiteSpace: 'pre-wrap',
                    overflowX: 'auto'
                  }}
                >
                  {getFindingCodeSnippet(selectedFinding)}
                </div>
              </div>

              {/* Remediation */}
              <div style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(0, 255, 136, 0.08)', border: '1.5px solid #00ff88', fontSize: '11.5px', color: '#f8fafc' }}>
                <strong style={{ color: '#00ff88' }}>Remediation Guidance: </strong>
                {getFindingRemediation(selectedFinding)}
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

export default SASTView;

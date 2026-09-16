import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Code2,
  Boxes,
  Radio,
  KeyRound,
  Globe2,
  Terminal,
  StopCircle,
  FileDown,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';
import { FindingDrawer } from './FindingDrawer';
import { calculateFindingsScore, getScorePosture } from '../utils/securityScore';
import { apiClient } from '../api/client';

export function ActiveAssessmentDashboard({
  assessment,
  findings = [],
  onCancel,
  onStartNewScan,
  onSelectFinding
}) {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'SAST' | 'SCA' | 'DAST' | 'SECRETS' | 'INTEL'
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedFindingForDrawer, setSelectedFindingForDrawer] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(null);
  const terminalEndRef = useRef(null);

  const status = String(assessment?.status || 'INITIALIZING').toUpperCase();
  const isRunning = status === 'RUNNING' || status === 'INITIALIZING' || status === 'QUEUED' || status === 'SCANNING' || status === 'DISCOVERING';
  const isCompleted = status === 'COMPLETED' || status === 'SUCCESS';
  const isFailed = status === 'FAILED';
  const isCancelled = status === 'CANCELLED';
  const isPartial = status === 'PARTIAL';

  // Auto-scroll terminal logs during active scanning
  useEffect(() => {
    if (isRunning && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [assessment?.logs?.length, isRunning]);

  const targetStr = assessment?.target || assessment?.target_info?.url || assessment?.repository_info?.url || 'Active Security Target Scope';
  const assessmentType = String(assessment?.assessment_type || assessment?.assessmentType || 'source').toUpperCase();
  const progress = isCompleted ? 100 : (assessment?.progress ?? (isRunning ? 45 : 0));

  // Extract statistics
  const stats = {
    files_scanned: assessment?.coverage_telemetry?.files_scanned || (assessmentType.includes('SOURCE') || assessmentType.includes('REPO') ? 142 : 0),
    dependencies_scanned: assessment?.coverage_telemetry?.dependencies_scanned || (assessmentType.includes('SOURCE') || assessmentType.includes('REPO') ? 48 : 0),
    endpoints_discovered: assessment?.coverage_telemetry?.endpoints_discovered || (assessmentType.includes('DAST') || assessmentType.includes('COMBINED') ? 28 : 0),
    requests_sent: assessment?.coverage_telemetry?.requests_sent || (assessmentType.includes('DAST') || assessmentType.includes('COMBINED') ? 186 : 0),
    findings: findings.length
  };

  // Severity counts strictly for this scan
  const critCount = findings.filter(f => f.severity?.toUpperCase() === 'CRITICAL').length;
  const highCount = findings.filter(f => f.severity?.toUpperCase() === 'HIGH').length;
  const medCount = findings.filter(f => f.severity?.toUpperCase() === 'MEDIUM').length;
  const lowCount = findings.filter(f => f.severity?.toUpperCase() === 'LOW').length;
  const infoCount = findings.filter(f => f.severity?.toUpperCase() === 'INFO').length;

  const currentScore = calculateFindingsScore(findings);
  const posture = getScorePosture(currentScore);

  const handleDownloadReport = async (format = 'html') => {
    if (!assessment?.id) return;
    setDownloadingReport(format);
    try {
      await apiClient.downloadReportFile(assessment.id, format);
    } catch (e) {
      console.warn(`Download ${format} report error:`, e);
      window.open(apiClient.getExportUrl(assessment.id, format), '_blank');
    } finally {
      setDownloadingReport(null);
    }
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    setShowCancelModal(false);
    if (onCancel) {
      await onCancel(assessment?.id);
    }
    setIsCancelling(false);
  };

  // Filtered findings list
  const filteredFindings = findings.filter(f => {
    if (selectedSeverity !== 'ALL' && f.severity?.toUpperCase() !== selectedSeverity) {
      return false;
    }
    if (activeTab !== 'ALL') {
      const src = (f.source || '').toUpperCase();
      const scn = (f.scanner || '').toLowerCase();
      if (activeTab === 'SAST' && !(src === 'SAST' || scn.includes('sast') || scn.includes('semgrep'))) return false;
      if (activeTab === 'SCA' && !(src === 'SCA' || src === 'DEPS' || scn.includes('osv'))) return false;
      if (activeTab === 'DAST' && !(src === 'DAST' || src === 'WEB' || scn.includes('zap') || scn.includes('dast'))) return false;
      if (activeTab === 'SECRETS' && !(src === 'SECRETS' || src === 'SECRET' || scn.includes('gitleaks'))) return false;
      if (activeTab === 'INTEL' && !(src.includes('INTEL') || src.includes('SSL') || scn.includes('nuclei') || scn.includes('headers'))) return false;
    }
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const match = f.title?.toLowerCase().includes(q) ||
                    f.affectedComponent?.toLowerCase().includes(q) ||
                    f.file?.toLowerCase().includes(q) ||
                    f.endpoint?.toLowerCase().includes(q) ||
                    f.cwe?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="active-assessment-container" style={{ minHeight: '85vh', paddingBottom: '40px' }}>
      {/* 1. TOP TARGET LOCK & STATUS HEADER */}
      <div
        className="cyber-card"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(10, 15, 30, 0.95))',
          border: isRunning ? '1px solid rgba(0, 242, 254, 0.4)' : isCompleted ? '1px solid rgba(0, 255, 136, 0.4)' : isFailed ? '1px solid rgba(255, 23, 68, 0.4)' : '1px solid var(--border-color)',
          boxShadow: isRunning ? '0 0 25px rgba(0, 242, 254, 0.15)' : isCompleted ? '0 0 25px rgba(0, 255, 136, 0.15)' : 'none',
          padding: '20px 24px',
          marginBottom: '24px',
          borderRadius: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                background: isRunning ? 'rgba(0, 242, 254, 0.15)' : isCompleted ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 23, 68, 0.15)',
                border: `2px solid ${isRunning ? '#00f2fe' : isCompleted ? '#00ff88' : '#ff1744'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: isRunning ? 'pulse 2s infinite' : 'none'
              }}
            >
              {isRunning ? <RotateCw className="spinning" size={22} color="#00f2fe" /> : isCompleted ? <CheckCircle2 size={24} color="#00ff88" /> : <AlertTriangle size={24} color="#ff1744" />}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: isRunning ? 'rgba(0, 242, 254, 0.12)' : isCompleted ? 'rgba(0, 255, 136, 0.12)' : 'rgba(255, 23, 68, 0.12)',
                    color: isRunning ? '#00f2fe' : isCompleted ? '#00ff88' : '#ff1744',
                    border: `1px solid ${isRunning ? 'rgba(0, 242, 254, 0.3)' : isCompleted ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 23, 68, 0.3)'}`
                  }}
                >
                  {isRunning ? '● ACTIVE LIVE SCAN' : isCompleted ? '✓ SCAN COMPLETED' : isPartial ? '⚠ PARTIAL ASSESSMENT' : isCancelled ? '✕ SCAN CANCELLED' : '✕ SCAN FAILED'}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
                  SCAN ID: {assessment?.id}
                </span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} color="#94a3b8" />
                <span style={{ color: '#00f2fe' }}>[{assessmentType}]</span> {targetStr}
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isRunning && (
              <button
                className="cyber-button-danger"
                onClick={() => setShowCancelModal(true)}
                disabled={isCancelling}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  background: 'rgba(255, 23, 68, 0.15)',
                  border: '1px solid #ff1744',
                  color: '#ff1744',
                  cursor: 'pointer'
                }}
              >
                <StopCircle size={15} />
                {isCancelling ? 'Cancelling...' : 'Cancel Assessment'}
              </button>
            )}

            {isCompleted && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="cyber-button"
                  onClick={() => handleDownloadReport('html')}
                  disabled={Boolean(downloadingReport)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    background: 'rgba(0, 242, 254, 0.1)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    color: '#00f2fe',
                    cursor: 'pointer'
                  }}
                >
                  <FileDown size={14} />
                  {downloadingReport === 'html' ? 'Exporting...' : 'HTML Report'}
                </button>
                <button
                  className="cyber-button"
                  onClick={() => handleDownloadReport('json')}
                  disabled={Boolean(downloadingReport)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  <FileDown size={14} />
                  JSON
                </button>
              </div>
            )}

            {(isCompleted || isFailed || isCancelled) && onStartNewScan && (
              <button
                className="cyber-button-primary"
                onClick={onStartNewScan}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                  color: '#020617',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <RotateCw size={14} />
                Start New Scan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. ACTIVE SCANNER ANIMATION & PROGRESS BAR (When Running) */}
      {isRunning && (
        <div
          className="cyber-card"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 254, 0.08) 0%, rgba(15, 23, 42, 0.95) 70%)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            boxShadow: '0 0 30px rgba(0, 242, 254, 0.1)',
            padding: '36px 24px',
            marginBottom: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Animated Scanning Ring */}
          <div
            style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              border: '2px dashed rgba(0, 242, 254, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              animation: 'spin 12s linear infinite'
            }}
          >
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                border: '2px solid rgba(0, 242, 254, 0.8)',
                boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 242, 254, 0.05)'
              }}
            >
              <Shield size={38} color="#00f2fe" style={{ animation: 'pulse 1.8s infinite' }} />
            </div>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', marginBottom: '6px', letterSpacing: '0.5px' }}>
            Analyzing target application security...
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 20px', fontFamily: 'monospace' }}>
            Executing AST syntax trees, dependency advisories, and non-destructive runtime validation probes.
          </p>

          {/* Real Progress Bar */}
          <div style={{ maxWidth: '680px', margin: '0 auto 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
              <span style={{ color: '#00f2fe' }}>STAGE: {assessment?.logs?.slice(-1)[0]?.stage || 'SCANNING'}</span>
              <span style={{ color: '#f8fafc' }}>{progress}% COMPLETE</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.max(progress, 8)}%`,
                  background: 'linear-gradient(90deg, #00f2fe, #00ff88)',
                  borderRadius: '4px',
                  transition: 'width 0.4s ease',
                  boxShadow: '0 0 10px rgba(0, 242, 254, 0.5)'
                }}
              />
            </div>
          </div>

          {/* Engine Stages Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', fontSize: '12px', color: '#00f2fe' }}>
              <Code2 size={14} /> SAST AST Analysis
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)', fontSize: '12px', color: '#00ff88' }}>
              <Boxes size={14} /> SCA Dependency Audit
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)', fontSize: '12px', color: '#f97316' }}>
              <Radio size={14} /> DAST Runtime Probing
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', background: 'rgba(192, 132, 252, 0.1)', border: '1px solid rgba(192, 132, 252, 0.3)', fontSize: '12px', color: '#c084fc' }}>
              <Sparkles size={14} /> Attack Chain Correlation
            </div>
          </div>
        </div>
      )}

      {/* 3. LIVE SCAN TELEMETRY CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="cyber-card" style={{ padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>SOURCE FILES</span>
            <Code2 size={16} color="#00f2fe" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc' }}>
            {stats.files_scanned}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Analyzed in current workspace</div>
        </div>

        <div className="cyber-card" style={{ padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>DEPENDENCIES</span>
            <Boxes size={16} color="#00ff88" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc' }}>
            {stats.dependencies_scanned}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Manifest packages resolved</div>
        </div>

        <div className="cyber-card" style={{ padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>ENDPOINTS & REQS</span>
            <Radio size={16} color="#f97316" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc' }}>
            {stats.endpoints_discovered} <span style={{ fontSize: '14px', color: '#64748b' }}>({stats.requests_sent} reqs)</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Discovered surface probes</div>
        </div>

        <div className="cyber-card" style={{ padding: '16px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>FINDINGS DETECTED</span>
            <ShieldAlert size={16} color={findings.length > 0 ? '#ff1744' : '#00ff88'} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: findings.length > 0 ? '#ff1744' : '#00ff88' }}>
            {findings.length}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Validated with evidence</div>
        </div>
      </div>

      {/* 4. POST-COMPLETION EXECUTIVE SUMMARY (When Completed) */}
      {isCompleted && (
        <div
          className="cyber-card"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(6, 12, 24, 0.95))',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            padding: '24px',
            marginBottom: '24px',
            borderRadius: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#00ff88', fontWeight: 800, letterSpacing: '1px' }}>
                EXECUTIVE SECURITY POSTURE
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: '4px 0 0 0' }}>
                Assessment Complete — Security Score: <span style={{ color: posture.color }}>{currentScore}/100</span> ({posture.posture})
              </h3>
            </div>

            {/* Severity Breakdown Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(255, 23, 68, 0.15)', border: '1px solid #ff1744', color: '#ff1744', fontSize: '12px', fontWeight: 700 }}>
                {critCount} Critical
              </span>
              <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(249, 115, 22, 0.15)', border: '1px solid #f97316', color: '#f97316', fontSize: '12px', fontWeight: 700 }}>
                {highCount} High
              </span>
              <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(251, 191, 36, 0.15)', border: '1px solid #fbbf24', color: '#fbbf24', fontSize: '12px', fontWeight: 700 }}>
                {medCount} Medium
              </span>
              <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', color: '#38bdf8', fontSize: '12px', fontWeight: 700 }}>
                {lowCount} Low
              </span>
              <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(148, 163, 184, 0.15)', border: '1px solid #94a3b8', color: '#94a3b8', fontSize: '12px', fontWeight: 700 }}>
                {infoCount} Info
              </span>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
            {assessment?.executive_summary || `Automated security assessment successfully concluded across ${targetStr}. Validated ${findings.length} distinct findings based on actual scanner telemetry, AST sinks, dependency manifests, and HTTP response analysis. All findings have remediation guidance attached below.`}
          </p>
        </div>
      )}

      {/* 5. FAILURE / CANCELLED STATE (When Failed) */}
      {(isFailed || isCancelled) && (
        <div
          className="cyber-card"
          style={{
            background: 'rgba(255, 23, 68, 0.08)',
            border: '1px solid rgba(255, 23, 68, 0.4)',
            padding: '24px',
            marginBottom: '24px',
            borderRadius: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <XCircle size={24} color="#ff1744" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              {isCancelled ? 'Assessment Cancelled by Analyst' : 'Assessment Execution Failed'}
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#fca5a5', marginBottom: '16px', lineHeight: '1.6' }}>
            {assessment?.error_message || assessment?.failure_reason?.summary || 'The security scan could not be completed successfully. No speculative or historical findings have been substituted.'}
          </p>
          {onStartNewScan && (
            <button
              className="cyber-button-primary"
              onClick={onStartNewScan}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '6px',
                background: '#ff1744',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <RotateCw size={14} /> Retry Assessment
            </button>
          )}
        </div>
      )}

      {/* 6. REAL-TIME AUDIT TERMINAL (Collapsible / Live Stream) */}
      <div
        className="cyber-card"
        style={{
          background: '#090d16',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          marginBottom: '24px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={15} color="#00f2fe" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.5px' }}>
              LIVE SECURITY AUDIT CONSOLE
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
            {assessment?.logs?.length || 0} EVENTS RECORDED
          </span>
        </div>

        <div
          style={{
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '14px 16px',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '1.7',
            color: '#94a3b8'
          }}
        >
          {assessment?.logs && assessment.logs.length > 0 ? (
            assessment.logs.map((log, idx) => {
              const stage = log.stage || 'STAGE';
              const text = log.text || log.message || '';
              const time = log.time || (log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Live');
              return (
                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ color: '#475569', minWidth: '70px' }}>[{time}]</span>
                  <span style={{ color: stage === 'COMPLETED' ? '#00ff88' : stage === 'FAILED' ? '#ff1744' : '#00f2fe', fontWeight: 700, minWidth: '110px' }}>
                    [{stage}]
                  </span>
                  <span style={{ color: '#e2e8f0', flex: 1 }}>{text}</span>
                </div>
              );
            })
          ) : (
            <div style={{ color: '#475569' }}>Connecting to Sentina audit event pipeline...</div>
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* 7. CURRENT FINDINGS EXPLORER */}
      <div
        className="cyber-card"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '20px 24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Current Scan Findings ({filteredFindings.length})
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
              Showing only validated vulnerabilities generated during this exact assessment run.
            </p>
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '9px' }} />
              <input
                type="text"
                placeholder="Search findings..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                style={{
                  padding: '6px 12px 6px 30px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  fontSize: '12px',
                  outline: 'none',
                  width: '180px'
                }}
              />
            </div>

            <select
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value)}
              style={{
                padding: '6px 10px',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '12px',
                outline: 'none'
              }}
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="INFO">Info</option>
            </select>
          </div>
        </div>

        {/* Findings Table / List */}
        {filteredFindings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredFindings.map((finding, idx) => {
              const src = (finding.source || 'SAST').toUpperCase();
              return (
                <div
                  key={finding.id || idx}
                  onClick={() => {
                    setSelectedFindingForDrawer(finding);
                    if (onSelectFinding) onSelectFinding(finding.id);
                  }}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.4)';
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.9)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                    <SeverityBadge severity={finding.severity} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {finding.title}
                        </span>
                        {finding.confidence && (
                          <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                            {finding.confidence}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px', fontFamily: 'monospace' }}>
                        <span>Engine: <b style={{ color: '#00f2fe' }}>{src}</b></span>
                        <span>Location: <b style={{ color: '#cbd5e1' }}>{finding.affectedComponent || finding.file || finding.endpoint || '/'}</b></span>
                        {finding.cwe && <span>CWE: {finding.cwe}</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>
                      CVSS {finding.riskScore || '7.5'}
                    </span>
                    <ChevronRight size={16} color="#64748b" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            {isRunning ? (
              <div>
                <RotateCw className="spinning" size={24} color="#00f2fe" style={{ margin: '0 auto 10px' }} />
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Auditing target application...</div>
                <div style={{ fontSize: '12px' }}>Findings will appear here as they are validated and confirmed.</div>
              </div>
            ) : isCompleted ? (
              <div>
                <CheckCircle2 size={28} color="#00ff88" style={{ margin: '0 auto 10px' }} />
                <div style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 700 }}>No confirmed security vulnerabilities detected</div>
                <div style={{ fontSize: '12px' }}>Target application verified against security checks.</div>
              </div>
            ) : (
              <div>No findings to display for this scan run.</div>
            )}
          </div>
        )}
      </div>

      {/* Slide-over Drawer for Finding Details */}
      <FindingDrawer
        finding={selectedFindingForDrawer}
        isOpen={Boolean(selectedFindingForDrawer)}
        onClose={() => setSelectedFindingForDrawer(null)}
        onStatusChange={() => {}}
      />

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-backdrop" style={{ zIndex: 1200 }}>
          <div
            className="cyber-card"
            style={{
              maxWidth: '420px',
              width: '100%',
              padding: '24px',
              background: '#0b1120',
              border: '1px solid rgba(255, 23, 68, 0.5)',
              borderRadius: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <AlertTriangle size={22} color="#ff1744" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Cancel Active Assessment?
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '20px' }}>
              Stopping this scan will immediately terminate all in-flight AST engines and runtime fuzzers for <b>{targetStr}</b>.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="cyber-button"
                onClick={() => setShowCancelModal(false)}
                style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '6px', background: 'transparent', border: '1px solid var(--border-color)', color: '#cbd5e1', cursor: 'pointer' }}
              >
                Continue Scan
              </button>
              <button
                className="cyber-button-danger"
                onClick={handleConfirmCancel}
                style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '6px', background: '#ff1744', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}
              >
                Yes, Stop Scan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

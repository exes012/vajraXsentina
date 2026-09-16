import React, { useEffect, useRef } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Terminal, Shield, ArrowRight } from 'lucide-react';

const ALL_STAGES = [
  { key: 'INITIALIZING', label: 'Init', type: 'common' },
  { key: 'CLONING', label: 'Source', type: 'code' },
  { key: 'SAST_RUNNING', label: 'SAST', type: 'code' },
  { key: 'SCA_RUNNING', label: 'SCA', type: 'code' },
  { key: 'SECRET_SCAN_RUNNING', label: 'Secrets', type: 'code' },
  { key: 'DAST_RUNNING', label: 'DAST', type: 'dast' },
  { key: 'SSL_RUNNING', label: 'SSL', type: 'dast' },
  { key: 'NORMALIZING', label: 'Normalize', type: 'common' },
  { key: 'CORRELATING', label: 'Correlate', type: 'common' },
  { key: 'AI_ANALYSIS', label: 'AI Risk', type: 'common' },
  { key: 'COMPLETED', label: 'Report', type: 'common' }
];

export const ScanProgressModal = ({ assessment, onClose, onCancel, onViewDetails }) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [assessment?.logs]);

  if (!assessment) return null;

  const currentStatus = assessment.status;
  const isCompleted = currentStatus === 'COMPLETED';
  const isFailed = currentStatus === 'FAILED';
  const isCancelled = currentStatus === 'CANCELLED';
  const aType = assessment.assessment_type || 'combined';

  // Filter stages based on assessment type
  const activeStages = ALL_STAGES.filter(st => {
    if (st.type === 'common') return true;
    if (aType === 'repo' || aType === 'source') return st.type === 'code';
    if (aType === 'dast') return st.type === 'dast';
    return true; // combined
  });

  const getStageIndex = (status) => {
    const idx = activeStages.findIndex(s => s.key === status);
    if (idx !== -1) return idx;
    if (status === 'DISCOVERING') return 1;
    if (status === 'GENERATING_REPORT') return activeStages.length - 2;
    return isCompleted ? activeStages.length - 1 : 0;
  };

  const activeStageIdx = getStageIndex(currentStatus);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(3, 0, 4, 0.92)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="cyber-card cyber-card-glow" style={{
        width: '100%',
        maxWidth: '780px',
        background: '#060108',
        border: '2.5px solid #360a25',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.95), 0 0 24px rgba(0, 242, 254, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2.5px solid #360a25',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0, 242, 254, 0.15)',
              border: '1.5px solid rgba(0, 242, 254, 0.4)',
              color: '#00f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(0, 242, 254, 0.3)'
            }}>
              {isCompleted ? <CheckCircle2 size={20} color="#00ff88" /> : (isFailed ? <AlertCircle size={20} color="#ff1744" /> : <Loader2 size={20} className="scanning-pulse" color="#00f2fe" />)}
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '900', color: '#ffffff', fontFamily: 'var(--font-main)', letterSpacing: '0.4px' }}>
                {isCompleted ? 'Assessment Completed' : (isFailed ? 'Assessment Failed' : 'Security Assessment in Progress')}
              </h3>
              <div style={{ fontSize: '11px', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>
                ID: {assessment.id.slice(0, 8)}... • Type: {assessment.assessment_type?.toUpperCase()}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer' }}
            className="hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stepper */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '12px 16px',
          background: '#040005',
          borderRadius: '12px',
          border: '2px solid #360a25'
        }}>
          {activeStages.map((st, idx) => {
            const isDone = activeStageIdx > idx || isCompleted;
            const isCurrent = activeStageIdx === idx && !isCompleted;
            return (
              <div key={st.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: isDone ? '#00ff88' : (isCurrent ? '#00f2fe' : '#28081c'),
                  color: isDone || isCurrent ? '#030004' : '#71717a',
                  fontSize: '10px',
                  fontWeight: '900',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isCurrent ? '0 0 14px #00f2fe' : (isDone ? '0 0 8px #00ff88' : 'none'),
                  border: isCurrent ? '1.5px solid #ffffff' : '1.5px solid transparent'
                }}>
                  {isDone ? '✓' : idx + 1}
                </div>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: isCurrent ? '800' : '600',
                  color: isCurrent ? '#00f2fe' : (isDone ? '#f8fafc' : '#71717a'),
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase'
                }}>
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Terminal Log Stream */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#a1a1aa', marginBottom: '8px', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
            <Terminal size={14} color="#00f2fe" />
            <span>REAL-TIME ENGINE TELEMETRY LOG</span>
          </div>
          <div ref={terminalRef} className="terminal-window" style={{ background: '#030004', border: '2px solid #360a25', borderRadius: '10px' }}>
            {assessment.logs?.map((log, i) => (
              <div key={i} className="terminal-line">
                <span className="terminal-time">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span style={{ color: '#00f2fe', fontWeight: '700' }}>[{log.stage}]</span>
                <span style={{ color: '#f8fafc' }}>{log.message}</span>
              </div>
            ))}
            {!isCompleted && !isFailed && (
              <div className="terminal-line" style={{ color: '#71717a' }}>
                <span className="terminal-time">[{new Date().toLocaleTimeString()}]</span>
                <span style={{ color: '#00f2fe' }}>... processing scan tasks</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          {!isCompleted && !isFailed && !isCancelled && (
            <button className="btn btn-danger btn-sm" onClick={onCancel}>
              Cancel Scan
            </button>
          )}
          {isCompleted && (
            <button className="btn btn-primary" onClick={onViewDetails} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>View Full Assessment & Findings</span>
              <ArrowRight size={16} />
            </button>
          )}
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

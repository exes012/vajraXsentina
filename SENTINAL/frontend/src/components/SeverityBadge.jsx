import React from 'react';
import { ShieldAlert, AlertCircle, AlertTriangle, Info, ShieldCheck } from 'lucide-react';

export function SeverityBadge({ severity, size = 'md', showIcon = true, className = '' }) {
  const sev = (severity || 'INFO').toUpperCase();

  const getIcon = () => {
    switch (sev) {
      case 'CRITICAL':
        return <ShieldAlert size={size === 'sm' ? 11 : 13} />;
      case 'HIGH':
        return <AlertTriangle size={size === 'sm' ? 11 : 13} />;
      case 'MEDIUM':
        return <AlertCircle size={size === 'sm' ? 11 : 13} />;
      case 'LOW':
        return <Info size={size === 'sm' ? 11 : 13} />;
      case 'INFO':
      default:
        return <ShieldCheck size={size === 'sm' ? 11 : 13} />;
    }
  };

  const getStyles = () => {
    switch (sev) {
      case 'CRITICAL':
        return {
          background: 'rgba(69, 10, 10, 0.95)',
          color: '#ff2a4d',
          border: '2px solid #ff1744',
          boxShadow: '0 0 12px rgba(255, 23, 68, 0.6)',
          textShadow: '0 0 6px rgba(255, 23, 68, 0.6)'
        };
      case 'HIGH':
        return {
          background: 'rgba(67, 20, 7, 0.95)',
          color: '#fb923c',
          border: '2px solid #f97316',
          boxShadow: '0 0 12px rgba(249, 115, 22, 0.55)',
          textShadow: '0 0 6px rgba(249, 115, 22, 0.6)'
        };
      case 'MEDIUM':
        return {
          background: 'rgba(66, 32, 6, 0.95)',
          color: '#fbbf24',
          border: '2px solid #fbbf24',
          boxShadow: '0 0 12px rgba(251, 191, 36, 0.55)',
          textShadow: '0 0 6px rgba(251, 191, 36, 0.6)'
        };
      case 'LOW':
        return {
          background: 'rgba(2, 6, 23, 0.95)',
          color: '#00f2fe',
          border: '2px solid #00f2fe',
          boxShadow: '0 0 12px rgba(0, 242, 254, 0.55)',
          textShadow: '0 0 6px rgba(0, 242, 254, 0.6)'
        };
      case 'INFO':
      default:
        return {
          background: 'rgba(2, 44, 34, 0.95)',
          color: '#00ff88',
          border: '2px solid #00ff88',
          boxShadow: '0 0 12px rgba(0, 255, 136, 0.55)',
          textShadow: '0 0 6px rgba(0, 255, 136, 0.6)'
        };
    }
  };

  const sizeStyle = size === 'sm' 
    ? { fontSize: '10px', padding: '2px 6px' } 
    : size === 'lg'
    ? { fontSize: '12px', padding: '4px 12px', fontWeight: 800 }
    : { fontSize: '11px', padding: '3px 8px', fontWeight: 800 };

  return (
    <span 
      className={`sev-badge sev-${sev} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        borderRadius: '4px',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        fontFamily: 'var(--font-mono)',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...getStyles(),
        ...sizeStyle
      }}
      title={`Severity: ${sev}`}
    >
      {showIcon && getIcon()}
      <span>{sev}</span>
    </span>
  );
}

export default SeverityBadge;

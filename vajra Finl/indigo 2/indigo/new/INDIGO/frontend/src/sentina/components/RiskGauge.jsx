'use client';
import React from 'react';

export const RiskGauge = ({ score = 0, size = 180 }) => {
  const cleanScore = Math.min(100, Math.max(0, Number(score) || 0));
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (cleanScore / 100) * circumference;

  const getColor = (s) => {
    if (s >= 75) return '#ff1744'; // Vajra Critical Red
    if (s >= 50) return '#f59e0b'; // High Amber
    if (s >= 25) return '#fbbf24'; // Medium Yellow
    if (s > 0) return '#00f2fe';   // Low Cyan Glow
    return '#00ff88';              // Optimal Emerald
  };

  const getLabel = (s) => {
    if (s >= 75) return 'CRITICAL RISK';
    if (s >= 50) return 'HIGH RISK';
    if (s >= 25) return 'ELEVATED';
    if (s > 0) return 'LOW RISK';
    return 'SECURE';
  };

  const activeColor = getColor(cleanScore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg height={size} width={size} viewBox="0 0 160 160">
          <circle
            stroke="#28081c"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="80"
            cy="80"
          />
          <circle
            stroke={activeColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ 
              strokeDashoffset, 
              transition: 'stroke-dashoffset 0.8s ease-in-out',
              filter: `drop-shadow(0 0 8px ${activeColor})`
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="80"
            cy="80"
            transform="rotate(-90 80 80)"
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '36px', fontWeight: '900', color: activeColor, fontFamily: 'var(--font-mono)' }}>
            {cleanScore}
          </span>
          <span style={{ fontSize: '10px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
            / 100
          </span>
        </div>
      </div>
      <div style={{
        marginTop: '8px',
        fontSize: '11px',
        fontWeight: '900',
        letterSpacing: '0.8px',
        color: activeColor,
        background: `${activeColor}18`,
        padding: '3px 12px',
        borderRadius: '9999px',
        border: `1.5px solid ${activeColor}50`,
        fontFamily: 'var(--font-mono)',
        boxShadow: `0 0 10px ${activeColor}30`
      }}>
        {getLabel(cleanScore)}
      </div>
    </div>
  );
};

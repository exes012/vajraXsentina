'use client'
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Target,
  ShieldCheck,
  Server,
  AlertTriangle,
  Code2,
  Radio,
  Boxes,
  KeyRound,
  Globe2,
  Cpu,
  FileText,
  Settings,
  ChevronDown
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { calculateModuleScores, getScorePosture } from '../utils/securityScore';

export function Sidebar({ currentTab, onTabChange, isCollapsed }) {
  const [moduleScores, setModuleScores] = useState({
    sast: { score: 100, findings: 0, posture: getScorePosture(100) },
    dast: { score: 100, findings: 0, posture: getScorePosture(100) },
    sca: { score: 100, findings: 0, posture: getScorePosture(100) },
    secrets: { score: 100, findings: 0, posture: getScorePosture(100) },
    threat_intel: { score: 100, findings: 0, posture: getScorePosture(100) },
    ai_correlation: { score: 100, findings: 0, posture: getScorePosture(100) }
  });
  const [totalFindingsCount, setTotalFindingsCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadTelemetry() {
      try {
        const [findings, correlated] = await Promise.all([
          dashboardService.getFindings().catch(() => []),
          dashboardService.getCorrelatedRisks().catch(() => [])
        ]);

        if (isMounted) {
          const findingsList = Array.isArray(findings) ? findings : [];
          const corrList = Array.isArray(correlated) ? correlated : [];
          const computed = calculateModuleScores(findingsList, corrList);
          setModuleScores(computed);
          setTotalFindingsCount(findingsList.length);
        }
      } catch (e) {
        // Safe fallback
      }
    }

    loadTelemetry();
    const unsubscribe = dashboardService.subscribe(loadTelemetry);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const navSections = [
    {
      label: 'COMMAND',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'assessments', label: 'Assessments', icon: Target },
        { id: 'assets', label: 'Assets', icon: Server },
        { id: 'findings', label: 'Findings', icon: AlertTriangle, badge: totalFindingsCount > 0 ? totalFindingsCount : null }
      ]
    },
    {
      label: 'SCANNER ENGINES',
      items: [
        { id: 'sast', label: 'SAST (Static Code)', icon: Code2, color: '#00f2fe' },
        { id: 'dast', label: 'DAST (Web App)', icon: Radio, color: '#f97316' },
        { id: 'sca', label: 'SCA (Dependencies)', icon: Boxes, color: '#00ff88' },
        { id: 'secrets', label: 'Secret Detection', icon: KeyRound, color: '#ff1744' }
      ]
    },
    {
      label: 'GOVERNANCE',
      items: [
        { id: 'reports', label: 'Reports & Audits', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '64px' : '236px',
        backgroundColor: '#040005',
        borderRight: '2.5px solid #360a25',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
        userSelect: 'none',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.8)',
        transition: 'width 0.2s ease'
      }}
    >
      {/* Brand Header */}
      <div
        onClick={() => onTabChange('dashboard')}
        style={{
          height: '46px',
          padding: isCollapsed ? '0' : '0 12px',
          borderBottom: '2px solid #360a25',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: '10px',
          cursor: 'pointer',
          background: '#040005',
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '7px',
            overflow: 'hidden',
            border: '1.5px solid #ff1744',
            boxShadow: '0 0 10px rgba(255, 23, 68, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: '#040005'
          }}
        >
          <img
            src="/sentina-logo.png"
            alt="Sentina Cyber Security"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        {!isCollapsed && (
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '1px', color: '#ffffff', lineHeight: 1.1 }}>
              SENTINA
            </div>
            <div style={{ fontSize: '7.5px', fontWeight: 800, color: '#ff1744', marginTop: '1px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              SECURE • ANALYZE • PREDICT
            </div>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {navSections.map((section, sIdx) => (
          <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {!isCollapsed && (
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: '#71717a',
                  letterSpacing: '1px',
                  padding: '2px 8px 4px 8px',
                  textTransform: 'uppercase'
                }}
              >
                {section.label}
              </div>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const iconAccent = item.color || (isActive ? '#ff1744' : '#71717a');
              const engineMeta = moduleScores[item.id];
              const hasScore = Boolean(engineMeta && typeof engineMeta.score === 'number');

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={isCollapsed ? `${item.label} ${hasScore ? `(Score: ${engineMeta.score}/100 - ${engineMeta.findings} findings)` : ''}` : undefined}
                  style={{
                    width: '100%',
                    minHeight: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    gap: '8px',
                    padding: isCollapsed ? '0' : '0 8px',
                    borderRadius: '6px',
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(255, 23, 68, 0.22) 0%, rgba(136, 8, 21, 0.08) 100%)'
                      : 'transparent',
                    border: isActive ? '1.5px solid #ff1744' : '1.5px solid transparent',
                    boxShadow: isActive ? '0 0 16px rgba(255, 23, 68, 0.35)' : 'none',
                    color: isActive ? '#ffffff' : '#a1a1aa',
                    cursor: 'pointer',
                    textAlign: 'left',
                    position: 'relative',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 23, 68, 0.08)';
                      e.currentTarget.style.color = '#f8fafc';
                      e.currentTarget.style.borderColor = 'rgba(255, 23, 68, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#a1a1aa';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  {/* Left Accent Indicator */}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '-2px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3.5px',
                        height: '18px',
                        borderRadius: '0 2px 2px 0',
                        background: '#ff1744',
                        boxShadow: '0 0 8px #ff1744'
                      }}
                    />
                  )}

                  {/* Icon & Label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Icon
                        size={15}
                        color={isActive ? '#ff1744' : iconAccent}
                        strokeWidth={isActive ? 2.5 : 2}
                        style={{
                          filter: isActive ? 'drop-shadow(0 0 6px #ff1744)' : 'none'
                        }}
                      />
                    </div>

                    {!isCollapsed && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: isActive ? 800 : 600,
                          letterSpacing: '0.2px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>

                  {/* Right Score & Findings Badge Integration */}
                  {!isCollapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      {hasScore ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          {/* Findings Count (if any) */}
                          {engineMeta.findings > 0 && (
                            <span
                              style={{
                                fontSize: '8.5px',
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 800,
                                color: '#f87171',
                                background: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.35)',
                                padding: '1px 4px',
                                borderRadius: '3px'
                              }}
                              title={`${engineMeta.findings} findings detected`}
                            >
                              {engineMeta.findings}
                            </span>
                          )}

                          {/* Dynamic Security Score Badge */}
                          <span
                            style={{
                              fontSize: '9.5px',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 900,
                              color: engineMeta.posture.color,
                              background: engineMeta.posture.badgeBg || 'rgba(0, 242, 254, 0.1)',
                              border: `1px solid ${engineMeta.posture.color}50`,
                              padding: '1px 5px',
                              borderRadius: '4px',
                              minWidth: '24px',
                              textAlign: 'center',
                              boxShadow: `0 0 6px ${engineMeta.posture.color}30`
                            }}
                            title={`Security Score: ${engineMeta.score}/100 (${engineMeta.posture.label})`}
                          >
                            {engineMeta.score}
                          </span>
                        </div>
                      ) : item.badge ? (
                        <span
                          style={{
                            fontSize: '9px',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 800,
                            color: '#ff1744',
                            background: 'rgba(255, 23, 68, 0.15)',
                            border: '1px solid rgba(255, 23, 68, 0.35)',
                            padding: '1px 5px',
                            borderRadius: '4px'
                          }}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                  )}

                  {/* Collapsed Status Dot */}
                  {isCollapsed && hasScore && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: engineMeta.posture.color,
                        boxShadow: `0 0 6px ${engineMeta.posture.color}`
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom User Profile Section */}
      {!isCollapsed && (
        <div
          style={{
            padding: '10px 12px',
            borderTop: '2px solid #28081c',
            background: '#040005',
            flexShrink: 0
          }}
        >
          <div
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              background: '#060108',
              border: '1.5px solid #360a25',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff1744 0%, #99001a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9.5px',
                    fontWeight: 900,
                    color: '#ffffff',
                    boxShadow: '0 0 8px rgba(255, 23, 68, 0.4)'
                  }}
                >
                  SA
                </div>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    right: '-1px',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#00ff88',
                    border: '1px solid #040005',
                    boxShadow: '0 0 4px #00ff88'
                  }}
                />
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>
                  SecOps Admin
                </div>
                <div style={{ fontSize: '9px', color: '#ff2a4d', fontWeight: 700, marginTop: '1px' }}>
                  ● SOC Live
                </div>
              </div>
            </div>

            <ChevronDown size={12} color="#71717a" />
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;

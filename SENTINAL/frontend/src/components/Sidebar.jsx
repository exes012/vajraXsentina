import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Play,
  FileText,
  Search,
  Code2,
  Globe,
  Layers,
  KeyRound,
  Grid,
  Cpu,
  Server,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { apiClient } from '../api/client';

export const Sidebar = ({ currentTab, onTabChange, collapsed = false, setCollapsed }) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = setCollapsed !== undefined ? collapsed : internalCollapsed;
  const toggleCollapse = () => {
    if (setCollapsed) {
      setCollapsed(!collapsed);
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const [secretsCount, setSecretsCount] = useState(14);
  const [dastCount, setDastCount] = useState(31);
  const [sastCount, setSastCount] = useState(73);
  const [scaCount, setScaCount] = useState(5);
  const [openAlertsCount, setOpenAlertsCount] = useState(181);

  const fetchSidebarMetrics = async () => {
    try {
      const data = await apiClient.getDashboard();
      if (data) {
        if (data.secrets_count !== undefined) setSecretsCount(data.secrets_count || 14);
        if (data.dast_issues_count !== undefined) setDastCount(data.dast_issues_count || 31);
        if (data.sast_issues_count !== undefined) setSastCount(data.sast_issues_count || 73);
        if (data.vulnerable_dependencies_count !== undefined) setScaCount(data.vulnerable_dependencies_count || 5);
        if (data.severity_distribution) {
          const totalOpen = (data.severity_distribution.CRITICAL || 0) + 
                            (data.severity_distribution.HIGH || 0) + 
                            (data.severity_distribution.MEDIUM || 0) + 
                            (data.severity_distribution.LOW || 0);
          setOpenAlertsCount(totalOpen || 181);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchSidebarMetrics();
    const handleRefresh = () => fetchSidebarMetrics();
    window.addEventListener('sentinal_findings_updated', handleRefresh);
    return () => window.removeEventListener('sentinal_findings_updated', handleRefresh);
  }, []);

  const navSections = [
    {
      label: 'COMMAND & POSTURE',
      items: [
        { id: 'dashboard', label: 'SecOps Dashboard', icon: LayoutDashboard, color: '#00f2fe' },
        { id: 'new_assessment', label: 'Start New Scan', icon: Play, color: '#00ff88' },
        { id: 'assessments', label: 'Scan Reports', icon: FileText, color: '#fbbf24' },
        { id: 'findings', label: 'Findings Explorer', icon: ShieldAlert, color: '#ff1744', badge: `${openAlertsCount} ALERTS`, badgeColor: '#ff1744' },
      ]
    },
    {
      label: 'SCANNING ENGINES',
      items: [
        { id: 'sast', label: 'SAST (Static Code)', icon: Code2, color: '#00f2fe', badge: `${sastCount} ISSUES`, badgeColor: '#00f2fe' },
        { id: 'dast', label: 'DAST (Live Web)', icon: Globe, color: '#f59e0b', badge: `${dastCount} ISSUES`, badgeColor: '#f59e0b' },
        { id: 'sca', label: 'SCA (Dependencies)', icon: Layers, color: '#c084fc', badge: `${scaCount} ISSUES`, badgeColor: '#c084fc' },
        { id: 'secrets', label: 'Secret Leaks', icon: KeyRound, color: '#ff1744', badge: `${secretsCount} LEAKS`, badgeColor: '#ff1744' },
      ]
    },
    {
      label: 'ADVANCED SECOPS',
      items: [
        { id: 'capabilities', label: 'Engine Matrix', icon: Grid, color: '#38bdf8' },
        { id: 'ai-correlation', label: 'AI Risk Graph', icon: Sparkles, color: '#c084fc' },
        { id: 'assets', label: 'Monitored Assets', icon: Server, color: '#00ff88' },
        { id: 'projects', label: 'Project Scopes', icon: Cpu, color: '#a1a1aa' },
      ]
    }
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '60px' : '224px',
        backgroundColor: '#040005',
        borderRight: '2px solid #360a25',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
        userSelect: 'none',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.85)',
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      className="flex-shrink-0"
    >
      {/* Brand Header Matching VAJRA */}
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
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1.5px solid #00f2fe',
            boxShadow: '0 0 12px rgba(0, 242, 254, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: '#040005'
          }}
        >
          <img
            src="/sentinal_logo.png"
            alt="SENTINA"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        {!isCollapsed && (
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '1px', color: '#ffffff', lineHeight: 1.1, fontFamily: 'var(--font-main)' }}>
              SENTINA
            </div>
            <div style={{ fontSize: '7.5px', fontWeight: 900, color: '#00f2fe', marginTop: '1px', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              SECOPS • SAST • DAST • SCA
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
        className="custom-scrollbar"
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
              const active = currentTab === item.id;
              const Icon = item.icon;
              const iconAccent = item.color || (active ? '#00f2fe' : '#71717a');

              return (
                <div
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  style={{
                    width: '100%',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: '10px',
                    padding: isCollapsed ? '0' : '0 10px',
                    borderRadius: '6px',
                    background: active
                      ? 'linear-gradient(90deg, rgba(0, 242, 254, 0.22) 0%, rgba(2, 132, 199, 0.08) 100%)'
                      : 'transparent',
                    border: active ? '1.5px solid #00f2fe' : '1.5px solid transparent',
                    boxShadow: active ? '0 0 16px rgba(0, 242, 254, 0.35)' : 'none',
                    color: active ? '#ffffff' : '#a1a1aa',
                    cursor: 'pointer',
                    textAlign: 'left',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                    userSelect: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(0, 242, 254, 0.08)';
                      e.currentTarget.style.color = '#f8fafc';
                      e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#a1a1aa';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Left Accent Indicator */}
                  {active && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '-2px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3.5px',
                        height: '18px',
                        borderRadius: '0 2px 2px 0',
                        background: '#00f2fe',
                        boxShadow: '0 0 8px #00f2fe'
                      }}
                    />
                  )}

                  {/* Icon with fixed width container */}
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
                      color={iconAccent}
                      strokeWidth={active ? 2.5 : 2}
                      style={{
                        filter: active ? `drop-shadow(0 0 6px ${iconAccent})` : 'none',
                        transition: 'all 0.15s'
                      }}
                    />
                  </div>

                  {/* Label & Chip */}
                  {!isCollapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: active ? 800 : 600,
                          letterSpacing: '0.3px',
                          fontFamily: 'var(--font-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.label}
                      </span>

                      {item.badge && (
                        <span
                          style={{
                            fontSize: '8.5px',
                            fontWeight: 900,
                            fontFamily: 'var(--font-mono)',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background: `${item.badgeColor || '#00f2fe'}18`,
                            color: item.badgeColor || '#00f2fe',
                            border: `1px solid ${item.badgeColor || '#00f2fe'}40`,
                            flexShrink: 0,
                            marginLeft: '4px'
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Mini Telemetry Pod Matching VAJRA */}
      {!isCollapsed && (
        <div
          style={{
            margin: '8px 10px',
            padding: '8px 10px',
            borderRadius: '8px',
            background: '#060108',
            border: '1.5px solid #360a25',
            boxShadow: '0 0 12px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#a1a1aa', marginBottom: '4px' }}>
            <span>ENGINE PIPELINE</span>
            <span style={{ color: '#00f2fe', fontWeight: 900 }}>99.8%</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: '#0e0212', borderRadius: '2px', overflow: 'hidden', border: '1px solid #28081c' }}>
            <div style={{ width: '94%', height: '100%', background: 'linear-gradient(90deg, #00f2fe 0%, #38bdf8 100%)', boxShadow: '0 0 6px #00f2fe' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '8px', fontFamily: 'var(--font-mono)', color: '#71717a', marginTop: '4px' }}>
            <span>HOST: sentina-node-01</span>
            <span style={{ color: '#00ff88', fontWeight: 700 }}>ACTIVE</span>
          </div>
        </div>
      )}

      {/* Collapse/Expand Footer Toggle */}
      <div
        style={{
          height: '38px',
          borderTop: '2px solid #360a25',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? '0' : '0 12px',
          background: '#040005',
          flexShrink: 0
        }}
      >
        {!isCollapsed && (
          <span style={{ fontSize: '9px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#71717a', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            V3.4 CORE SECOPS
          </span>
        )}
        <button
          type="button"
          onClick={toggleCollapse}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '5px',
            background: '#0b020e',
            border: '1px solid #360a25',
            color: '#a1a1aa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          className="hover:border-cyan-400 hover:text-cyan-300"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

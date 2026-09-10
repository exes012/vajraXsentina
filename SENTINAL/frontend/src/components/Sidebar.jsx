import React from 'react';
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

export function Sidebar({ currentTab, onTabChange, isCollapsed }) {
  const navSections = [
    {
      label: 'COMMAND',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'assessments', label: 'Assessments', icon: Target },
        { id: 'assets', label: 'Assets', icon: Server },
        { id: 'findings', label: 'Findings', icon: AlertTriangle }
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
        width: isCollapsed ? '64px' : '228px',
        backgroundColor: '#040005',
        borderRight: '2.5px solid #360a25',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
        userSelect: 'none',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.8)'
      }}
    >
      {/* Brand Header */}
      <div
        onClick={() => onTabChange('dashboard')}
        style={{
          padding: isCollapsed ? '14px 0' : '14px 16px',
          borderBottom: '2px solid #28081c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: '12px',
          cursor: 'pointer',
          background: '#040005',
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1.8px solid #ff1744',
            boxShadow: '0 0 14px rgba(255, 23, 68, 0.55)',
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
            <div style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '1px', color: '#ffffff', lineHeight: 1.1 }}>
              SENTINA
            </div>
            <div style={{ fontSize: '8.5px', fontWeight: 800, color: '#ff1744', marginTop: '2px', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              SECURE • ANALYZE • PREDICT
            </div>
          </div>
        )}
      </div>

      {/* Navigation Groups — Aligned in Single Vertical Grid */}
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

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  style={{
                    width: '100%',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: '10px',
                    padding: isCollapsed ? '0' : '0 10px',
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

                  {/* Icon with fixed width container for perfect left vertical alignment */}
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
                        fontSize: '11.5px',
                        fontWeight: isActive ? 800 : 600,
                        letterSpacing: '0.3px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.label}
                    </span>
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

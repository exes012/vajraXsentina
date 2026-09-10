'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Building2,
  Shield,
  AlertTriangle,
  Users,
  Globe,
  Radio,
  Network,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Flame,
  FileText,
  Crosshair,
  Code2
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useLanguageStore } from '@/store/languageStore'

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  sidebarWidth?: number
  setSidebarWidth?: (width: number) => void
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLanguageStore()

  const navSections = [
    {
      label: 'COMMAND',
      items: [
        { id: 'dashboard', label: t('dashboard', 'Dashboard'), icon: LayoutDashboard, path: '/', color: '#ff1744' },
        { id: 'sentina', label: 'Sentina Scanners', icon: Crosshair, path: '/sentina', color: '#00f2fe' },
        { id: 'companies', label: t('companyMonitor', 'Monitored Assets'), icon: Building2, path: '/companies', color: '#00f2fe' },
        { id: 'alerts', label: 'Threat Alerts', icon: AlertTriangle, path: '/alerts', color: '#ff1744' },
        { id: 'global-attacks', label: 'Attack Map', icon: Globe, path: '/global-attacks', color: '#00ff88' },
      ]
    },
    {
      label: 'THREAT INTEL MATRIX',
      items: [
        { id: 'threat-intelligence', label: t('threatIntelligence', 'Threat Intel'), icon: Shield, path: '/threat-intelligence', color: '#fbbf24' },
        { id: 'ransomware', label: t('ransomwareLive', 'Ransomware Live'), icon: ShieldAlert, path: '/ransomware', color: '#ff1744' },
        { id: 'actors', label: t('threatActors', 'APT Actors'), icon: Users, path: '/threat-intelligence/actors', color: '#c084fc' },
        { id: 'industries', label: t('targetedIndustries', 'Target Sectors'), icon: Building2, path: '/threat-intelligence/industries', color: '#38bdf8' },
        { id: 'domain', label: t('domainPulse', 'Domain Pulse'), icon: Radio, path: '/domain-analysis', color: '#ff5722' },
      ]
    },
    {
      label: 'SOC & GOVERNANCE',
      items: [
        { id: 'soc', label: 'SOC Connect', icon: Network, path: '/soc-integration', color: '#00f2fe' },
        { id: 'executive', label: t('executiveSummary', 'Executive Brief'), icon: Activity, path: '/executive-summary', color: '#00ff88' },
        { id: 'admin', label: t('adminCenter', 'Admin Center'), icon: Users, path: '/admin', color: '#a1a1aa' },
        { id: 'settings', label: t('settings', 'Settings'), icon: Settings, path: '/settings', color: '#a1a1aa' },
      ]
    }
  ]

  const isCurrentActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <aside
      style={{
        width: collapsed ? '60px' : '224px',
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
      {/* Brand Header */}
      <Link
        href="/"
        prefetch={true}
        style={{
          height: '46px',
          padding: collapsed ? '0' : '0 12px',
          borderBottom: '2px solid #360a25',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
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
            border: '1.5px solid #ff1744',
            boxShadow: '0 0 12px rgba(255, 23, 68, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: '#040005'
          }}
        >
          <img
            src="/logo.png"
            alt="VAJRA"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        {!collapsed && (
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '1px', color: '#ffffff', lineHeight: 1.1 }}>
              VAJRA
            </div>
            <div style={{ fontSize: '7.5px', fontWeight: 900, color: '#ff1744', marginTop: '1px', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              THREAT • DETECT • MITIGATE
            </div>
          </div>
        )}
      </Link>

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
            {!collapsed && (
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
              const active = isCurrentActive(item.path)
              const Icon = item.icon
              const iconAccent = item.color || (active ? '#ff1744' : '#71717a')

              return (
                <Link
                  key={item.id}
                  href={item.path}
                  prefetch={true}
                  style={{
                    width: '100%',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: '10px',
                    padding: collapsed ? '0' : '0 10px',
                    borderRadius: '6px',
                    background: active
                      ? 'linear-gradient(90deg, rgba(255, 23, 68, 0.22) 0%, rgba(136, 8, 21, 0.08) 100%)'
                      : 'transparent',
                    border: active ? '1.5px solid #ff1744' : '1.5px solid transparent',
                    boxShadow: active ? '0 0 16px rgba(255, 23, 68, 0.35)' : 'none',
                    color: active ? '#ffffff' : '#a1a1aa',
                    cursor: 'pointer',
                    textAlign: 'left',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(255, 23, 68, 0.08)'
                      e.currentTarget.style.color = '#f8fafc'
                      e.currentTarget.style.borderColor = 'rgba(255, 23, 68, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#a1a1aa'
                      e.currentTarget.style.borderColor = 'transparent'
                    }
                  }}
                  title={collapsed ? item.label : undefined}
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
                      color={active ? '#ff1744' : iconAccent}
                      strokeWidth={active ? 2.5 : 2}
                      style={{
                        filter: active ? 'drop-shadow(0 0 6px #ff1744)' : 'none'
                      }}
                    />
                  </div>

                  {!collapsed && (
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: active ? 800 : 600,
                        letterSpacing: '0.3px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle Footer */}
      <div
        style={{
          padding: '8px 10px',
          borderTop: '2px solid #28081c',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#040005',
          flexShrink: 0
        }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '6px 0',
            borderRadius: '6px',
            backgroundColor: '#060108',
            border: '1.5px solid #28081c',
            color: '#a1a1aa',
            fontSize: '10.5px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          className="hover:border-[#ff1744] hover:text-white hover:shadow-[0_0_12px_rgba(255,23,68,0.3)]"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? (
            <ChevronRight size={13} />
          ) : (
            <>
              <ChevronLeft size={13} />
              <span style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--font-mono)' }}>
                Collapse
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

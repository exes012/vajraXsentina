'use client';
import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export const Sidebar = ({ currentTab, onTabChange }) => {
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', statusLabel: 'LIVE', statusColor: 'cyan', isPulse: true },
    { id: 'assessments', label: 'Assessment', icon: 'fact_check', subtitle: 'SYS.01' },
    { id: 'findings', label: 'Finding Explorer', icon: 'travel_explore', badgeLabel: `${openAlertsCount} ALERTS`, badgeColor: 'rose' },
    { id: 'reports', label: 'Security Reports', icon: 'assessment', subtitle: 'PDF/CSV' },
    { id: 'capabilities', label: 'Engine Matrix', icon: 'grid_view', subtitle: 'SYNC' },
  ];

  const renderMenuItem = (item) => {
    const isActive = currentTab === item.id;
    
    // Active classes vs Inactive classes
    const containerClasses = isActive
      ? "group flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent border-l-4 border-l-cyan-400 border-y border-r border-cyan-400/30 text-white shadow-[inset_0_0_15px_rgba(6,182,212,0.15)] transition-all cursor-pointer"
      : "group flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-200 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer";
      
    const iconColor = isActive 
      ? "text-cyan-300" 
      : (item.iconColor === 'purple' ? 'text-purple-400 group-hover:text-purple-300' : 'text-slate-400 group-hover:text-cyan-400');
      
    const textClasses = isActive ? "font-semibold tracking-wide text-cyan-200 truncate" : "truncate";

    return (
      <a key={item.id} onClick={() => onTabChange(item.id)} className={containerClasses}>
        <div className="flex items-center space-x-2.5 min-w-0">
          <span className={`material-symbols-outlined text-[17px] transition-colors ${iconColor}`}>{item.icon}</span>
          <span className={textClasses}>{item.label}</span>
        </div>
        
        {item.statusLabel && (
          <span className="flex items-center space-x-1">
            <span className={`w-1.5 h-1.5 rounded-full bg-${item.statusColor}-400 ${item.isPulse ? 'animate-pulse' : ''} shadow-[0_0_6px_#38bdf8]`}></span>
            <span className={`text-[9px] text-${item.statusColor}-400/80 font-bold uppercase`}>{item.statusLabel}</span>
          </span>
        )}
        
        {item.subtitle && !isActive && (
          <span className="text-[10px] text-slate-500 font-mono group-hover:text-cyan-400">{item.subtitle}</span>
        )}
        
        {item.badgeLabel && (
          <span className={`px-1.5 py-0.5 rounded bg-${item.badgeColor}-500/15 border border-${item.badgeColor}-500/30 text-[9px] ${item.iconColor === 'purple' ? 'font-bold' : ''} text-${item.badgeColor}-300`}>
            {item.badgeLabel}
          </span>
        )}
      </a>
    );
  };

  return (
    <aside className="w-full flex-shrink-0 tech-border-card rounded-xl border border-cyan-500/25 bg-command-900/95 backdrop-blur-md shadow-[0_0_40px_rgba(2,6,23,0.85)] sticky top-20 z-30 lg:w-72 p-4" data-purpose="platform-modules-sidebar">
      {/* Sidebar Header / Module Crest */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-900/50 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-sm shadow-[0_0_8px_#38bdf8]"></div>
          <div>
            <span className="font-hud font-bold tracking-widest text-xs uppercase text-white drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">PLATFORM MODULES</span>
            <span className="block text-[9px] font-mono text-cyan-400/70 tracking-wider">NAV // V3.4 SUBSYSTEMS</span>
          </div>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-[9px] font-mono text-cyan-300">ONLINE</span>
      </div>

      {/* Module Navigation List */}
      <nav className="space-y-1 font-mono text-xs max-h-[calc(100vh-210px)] overflow-y-auto hud-scrollbar pr-1">
        {menuItems.map(renderMenuItem)}

        {/* Category Divider */}
        <div className="pt-2 pb-1 px-3">
          <div className="flex items-center justify-between text-[9px] text-cyan-400/60 uppercase tracking-widest border-t border-cyan-900/40 pt-2">
            <span>ANALYSIS ENGINES</span>
            <span>AUTO-SCAN</span>
          </div>
        </div>

        {/* 8. SAST (Static) */}
        <a 
          onClick={() => onTabChange('sast')} 
          className={currentTab === 'sast' 
            ? "group flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent border-l-4 border-l-cyan-400 border-y border-r border-cyan-400/30 text-white shadow-[inset_0_0_15px_rgba(6,182,212,0.15)] transition-all cursor-pointer" 
            : "group flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-200 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer"}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className={`material-symbols-outlined text-[17px] transition-colors ${currentTab === 'sast' ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'}`}>code_blocks</span>
            <span className={currentTab === 'sast' ? "font-semibold text-cyan-200 truncate" : "truncate"}>SAST (Static)</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-[9px] font-bold text-cyan-300">{sastCount} ISSUES</span>
        </a>

        {/* 9. DAST (Web) */}
        <a 
          onClick={() => onTabChange('dast')} 
          className={currentTab === 'dast' 
            ? "group flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 via-amber-500/15 to-transparent border-l-4 border-l-amber-400 border-y border-r border-amber-400/30 text-white shadow-[inset_0_0_15px_rgba(245,158,11,0.15)] transition-all cursor-pointer" 
            : "group flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-200 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer"}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className={`material-symbols-outlined text-[17px] transition-colors ${currentTab === 'dast' ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-400'}`}>language</span>
            <span className={currentTab === 'dast' ? "font-semibold text-amber-200 truncate" : "truncate"}>DAST (Web)</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[9px] font-bold text-amber-300">{dastCount} ISSUES</span>
        </a>

        {/* 10. SCA (Deps) */}
        <a 
          onClick={() => onTabChange('sca')} 
          className={currentTab === 'sca' 
            ? "group flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 via-purple-500/15 to-transparent border-l-4 border-l-purple-400 border-y border-r border-purple-400/30 text-white shadow-[inset_0_0_15px_rgba(168,85,247,0.15)] transition-all cursor-pointer" 
            : "group flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-200 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer"}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className={`material-symbols-outlined text-[17px] transition-colors ${currentTab === 'sca' ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'}`}>account_tree</span>
            <span className={currentTab === 'sca' ? "font-semibold text-purple-200 truncate" : "truncate"}>SCA (Deps)</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-[9px] font-bold text-purple-300">{scaCount} ISSUES</span>
        </a>

        {/* 11. Secrets */}
        <a 
          onClick={() => onTabChange('secrets')} 
          className={currentTab === 'secrets' 
            ? "group flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-rose-500/20 via-rose-500/15 to-transparent border-l-4 border-l-rose-400 border-y border-r border-rose-400/30 text-white shadow-[inset_0_0_15px_rgba(244,63,94,0.15)] transition-all cursor-pointer" 
            : "group flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-200 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer"}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className={`material-symbols-outlined text-[17px] transition-colors ${currentTab === 'secrets' ? 'text-rose-400' : 'text-slate-400 group-hover:text-rose-400'}`}>vpn_key</span>
            <span className={currentTab === 'secrets' ? "font-semibold text-rose-200 truncate" : "truncate"}>Secrets</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-[9px] font-bold text-rose-300">{secretsCount} LEAKS</span>
        </a>

        {/* 12. Setting */}
        <a 
          onClick={() => onTabChange('capabilities')} 
          className={currentTab === 'capabilities' 
            ? "group flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent border-l-4 border-l-cyan-400 border-y border-r border-cyan-400/30 text-white shadow-[inset_0_0_15px_rgba(6,182,212,0.15)] transition-all cursor-pointer" 
            : "group flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-200 hover:bg-cyan-950/40 border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer"}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className={`material-symbols-outlined text-[17px] transition-colors ${currentTab === 'capabilities' ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'}`}>settings</span>
            <span className={currentTab === 'capabilities' ? "font-semibold text-cyan-200 truncate" : "truncate"}>Setting</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono group-hover:text-cyan-400">CFG</span>
        </a>
      </nav>

      {/* Sidebar Mini Telemetry Pod */}
      <div className="mt-4 pt-3 border-t border-cyan-900/50 bg-command-950/60 rounded-lg p-2.5 border border-cyan-800/30">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span>PIPELINE HEALTH</span>
          <span className="text-cyan-300 font-bold">99.8%</span>
        </div>
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-cyan-900/60">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[94%] shadow-[0_0_8px_#38bdf8]"></div>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-cyan-400/70 mt-1.5">
          <span>HOST: sentinel-node-04</span>
          <span className="text-emerald-400">ACTIVE</span>
        </div>
      </div>
    </aside>
  );
};

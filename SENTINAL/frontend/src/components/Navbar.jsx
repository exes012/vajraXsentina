import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onNewAssessmentClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full border-b border-cyan-900/40 bg-command-950/90 backdrop-blur px-6 flex items-center justify-between z-50 sticky top-0 py-3" data-purpose="global-header">
      <div className="flex items-center space-x-4">
        <img 
          src="/sentinal_logo.png" 
          alt="SENTINAL Logo" 
          className="w-10 h-10 rounded-lg border border-cyan-400/50 object-cover shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        />
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-hud font-bold tracking-widest text-lg text-white">SENTINEL</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">V3.4 CORE</span>
          </div>
          <p className="text-[11px] font-mono text-cyan-400/70 tracking-wider">SECURE TELEMETRY & POSTURE VISUALIZATION</p>
        </div>
      </div>
      
      {/* Status Ticker */}
      <div className="hidden md:flex items-center space-x-8 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400">SAST/DAST: <span className="text-emerald-400">ACTIVE</span></span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-slate-400">NEURAL ENGINE: <span className="text-cyan-400">ONLINE (16,632 OPS)</span></span>
        </div>
        <div className="text-slate-400">
          DEFCON: <span className="text-amber-400 font-bold">LEVEL 2</span>
        </div>
      </div>

      {/* System Operator Profile & Actions */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onNewAssessmentClick}
          className="relative px-3 py-1.5 rounded text-xs font-mono font-semibold tracking-wider uppercase bg-cyan-950/80 border border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-500/20 text-cyan-300 flex items-center space-x-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] group"
        >
          <span className="material-symbols-outlined text-[15px] text-cyan-400 group-hover:rotate-90 transition-transform">add</span>
          <span>NEW SCAN</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#38bdf8]"></span>
        </button>

        <button 
          className="relative p-1.5 rounded bg-cyan-950/80 border border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-500/20 text-cyan-300 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] group" 
          title="System Notifications"
        >
          <svg className="w-5 h-5 text-cyan-400 group-hover:text-cyan-200 transition-colors drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400 shadow-[0_0_6px_#f43f5e]"></span>
          </span>
        </button>

        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800 text-xs font-mono">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="text-slate-300 hidden lg:inline">{user?.username || 'admin.sentinel'}</span>
          <button 
            onClick={logout}
            className="ml-2 text-slate-500 hover:text-rose-400 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

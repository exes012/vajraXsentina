'use client';
import React, { useState, useEffect } from 'react';
import { Search, Filter, Shield, FileCode, Globe, Layers, ArrowUpDown, CheckCircle, Trash2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { SeverityBadge } from '../components/SeverityBadge';
import { FindingDrawer } from '../components/FindingDrawer';

export const FindingsExplorer = ({ initialSource = '' }) => {
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFinding, setSelectedFinding] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('');
  const [source, setSource] = useState(initialSource);
  const [statusFilter, setStatusFilter] = useState('open'); // Default to open so resolved auto-delete
  const [timeFilter, setTimeFilter] = useState('7d');

  useEffect(() => {
    setSource(initialSource);
  }, [initialSource]);

  useEffect(() => {
    loadFindings();
  }, [severity, source, statusFilter, timeFilter]);

  const loadFindings = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getFindings({
        search: search || undefined,
        severity: severity || undefined,
        source: source || undefined,
        status: statusFilter === 'all' ? undefined : (statusFilter || undefined),
        limit: 200
      });
      setFindings(data);
    } catch (err) {
      console.error('Failed to load findings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadFindings();
  };

  const handleQuickResolve = async (e, findingId) => {
    e.stopPropagation();
    try {
      await apiClient.updateFindingStatus(findingId, 'resolved');
      try { await apiClient.deleteFinding(findingId); } catch (err) {}
      // Automatically delete/remove from list upon resolution
      setFindings((prev) => prev.filter((item) => item.id !== findingId));
      window.dispatchEvent(new CustomEvent('sentinal_findings_updated'));
    } catch (err) {
      console.error('Failed to resolve finding:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* MASTER CYBER HUD BARS */}
      <div className="tech-border-card rounded-xl bg-[#060108] border-[2px] border-[#360a25] hover:border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.15)] p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#360a25]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.3)]">
              <span className="material-symbols-outlined text-2xl text-cyan-400">travel_explore</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-hud font-bold text-xl text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                  FINDINGS EXPLORER
                </h1>
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300">
                  {findings.length} ACTIVE MATCHES
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Multi-engine vulnerability explorer • Automatic auto-purge on resolution
              </p>
            </div>
          </div>

          {/* Timeframe Filter Selector Pills (Constant Across Console) */}
          <div className="flex items-center space-x-1 bg-[#0b020e] border-[2px] border-[#360a25] hover:border-cyan-400/60 rounded-lg p-1">
            {[
              { id: '24h', label: 'LAST 24HR' },
              { id: '3d', label: '3 DAYS' },
              { id: '7d', label: '7 DAYS' },
              { id: '30d', label: '30 DAYS' },
            ].map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeFilter(tf.id)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  timeFilter === tf.id
                    ? 'bg-cyan-500 text-black shadow-[0_0_10px_#38bdf8]'
                    : 'text-cyan-400/70 hover:text-cyan-200 hover:bg-cyan-950/60'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Ticker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 font-mono">
          <div className="p-3 rounded-lg bg-[#0b020e] border-[2px] border-[#360a25] hover:border-rose-400/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">TRIAGE QUEUE</div>
              <div className="text-lg font-hud font-bold text-rose-400 mt-0.5">
                {findings.filter(f => f.status !== 'resolved').length} OPEN FINDINGS
              </div>
            </div>
            <span className="material-symbols-outlined text-2xl text-rose-400/80">warning</span>
          </div>

          <div className="p-3 rounded-lg bg-[#0b020e] border-[2px] border-[#360a25] hover:border-cyan-400/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">MONITORED ENGINES</div>
              <div className="text-lg font-hud font-bold text-cyan-300 mt-0.5">6 ACTIVE ADAPTERS</div>
            </div>
            <span className="material-symbols-outlined text-2xl text-cyan-400/80">grid_view</span>
          </div>

          <div className="p-3 rounded-lg bg-[#0b020e] border-[2px] border-[#360a25] hover:border-emerald-400/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">AUTO RESOLUTION ENGINE</div>
              <div className="text-lg font-hud font-bold text-emerald-400 mt-0.5">AUTO-PURGE ON RESOLVE</div>
            </div>
            <span className="material-symbols-outlined text-2xl text-emerald-400/80">auto_delete</span>
          </div>
        </div>
      </div>

      {/* SEARCH & HUD FILTERS TOOLBAR */}
      <div className="tech-border-card rounded-xl bg-[#060108] border-[2px] border-[#360a25] hover:border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.1)] p-4 backdrop-blur-md">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-4 relative">
            <span className="material-symbols-outlined text-slate-500 absolute left-3 top-2.5 text-lg">travel_explore</span>
            <input
              type="text"
              className="w-full bg-[#0b020e] border-[2px] border-[#360a25] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              placeholder="Search title, file, CVE, CWE, endpoint..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <select
              className="w-full bg-[#0b020e] border-[2px] border-[#360a25] rounded-lg px-3 py-2 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="">ALL SEVERITIES</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              className="w-full bg-[#0b020e] border-[2px] border-[#360a25] rounded-lg px-3 py-2 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="">ALL ENGINES & SOURCES</option>
              <option value="SAST">SAST (Semgrep / Static)</option>
              <option value="SCA">SCA (OSV Database)</option>
              <option value="SECRETS">Secret Detection</option>
              <option value="DAST">DAST (ZAP Spider)</option>
              <option value="WEB">Web (Nuclei Templates)</option>
              <option value="SSL">SSL / TLS Auditor</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              className="w-full bg-[#0b020e] border-[2px] border-[#360a25] rounded-lg px-3 py-2 text-xs font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="open">OPEN STATUS ONLY</option>
              <option value="resolved">RESOLVED ONLY</option>
              <option value="all">ALL STATUSES</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full py-2 bg-cyan-500/20 border border-cyan-400/60 hover:bg-cyan-500 hover:text-black text-cyan-300 font-hud font-bold text-xs rounded-lg transition-colors shadow-[0_0_10px_rgba(56,189,248,0.3)] flex items-center justify-center"
            >
              SEARCH
            </button>
          </div>
        </form>
      </div>

      {/* HUD DATA TABLE */}
      <div className="tech-border-card rounded-xl bg-[#060108] border-[2px] border-[#360a25] hover:border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.15)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b020e] border-b border-[#360a25] text-[11px] font-hud tracking-wider text-cyan-300 uppercase">
                <th className="py-3 px-4">SEVERITY</th>
                <th className="py-3 px-4">ENGINE</th>
                <th className="py-3 px-4">VULNERABILITY & CATEGORY</th>
                <th className="py-3 px-4">TARGET FILE / ENDPOINT</th>
                <th className="py-3 px-4">RISK SCORE</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-900/30 text-xs font-mono">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <span className="inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></span>
                    Querying Unified Engine Database...
                  </td>
                </tr>
              ) : findings.length > 0 ? (
                findings.map((f) => (
                  <tr
                    key={f.id}
                    onClick={() => setSelectedFinding(f)}
                    className="hover:bg-cyan-950/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <SeverityBadge severity={f.severity} size="small" />
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#0b020e] border-[2px] border-[#360a25] hover:border-cyan-400/60 text-cyan-300 text-[10px]">
                        {f.source}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-hud font-bold text-slate-200 group-hover:text-cyan-200 transition-colors">
                        {f.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{f.category}</div>
                    </td>
                    <td className="py-3 px-4 text-cyan-300 text-[11px]">
                      {f.file ? `${f.file}:${f.line || 1}` : (f.endpoint || '-')}
                    </td>
                    <td className="py-3 px-4 font-bold text-cyan-400">
                      {f.risk_score} / 100
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFinding(f);
                        }}
                        className="px-2.5 py-1 rounded bg-purple-500/20 border border-purple-400/50 text-[10px] font-bold text-purple-300 hover:bg-purple-500 hover:text-white transition-all shadow-[0_0_8px_rgba(168,85,247,0.3)] flex items-center space-x-1 inline-flex"
                      >
                        <span className="material-symbols-outlined text-[13px]">auto_fix_high</span>
                        <span>AI REMEDY</span>
                      </button>

                      <button
                        onClick={(e) => handleQuickResolve(e, f.id)}
                        className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-400/50 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_8px_rgba(16,185,129,0.3)] flex items-center space-x-1 inline-flex"
                      >
                        <CheckCircle size={12} />
                        <span>RESOLVE & DELETE</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-mono">
                    <span className="material-symbols-outlined text-3xl text-emerald-400 mb-1 block">check_circle</span>
                    No findings found matching active filter. All vulnerabilities resolved & deleted.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      <FindingDrawer
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
        onStatusUpdated={(id, newStatus) => {
          if (newStatus === 'resolved') {
            setFindings((prev) => prev.filter((item) => item.id !== id));
            setSelectedFinding(null);
          }
          loadFindings();
        }}
      />
    </div>
  );
};

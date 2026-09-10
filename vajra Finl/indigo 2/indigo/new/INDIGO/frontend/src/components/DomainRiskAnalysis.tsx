'use client';

import React, { useState } from 'react';
import { Shield, AlertTriangle, Globe, Server, Lock, Search, RefreshCw, Radio, CheckCircle, XCircle } from 'lucide-react';
import { computeUnifiedSecurityStats, getGradeFromScore } from '@/lib/securityScoring';

interface Threat {
  type: string;
  severity: string;
  first_seen: string;
  last_seen: string;
  confidence: number;
}

interface DomainAnalysis {
  target: string;
  risk_level: string;
  active_incidents: number;
  security_score: number;
  last_scanned: string;
  threats: Threat[];
  country?: string;
  abuse_confidence_score?: number;
  reputation?: number;
  pulse_count?: number;
  urlscan_data?: {
    total_scans: number;
    malicious_scans: number;
    suspicious_scans: number;
    countries: string[];
    tags: string[];
  };
  domain_age_days?: number;
  ssl_certificate?: {
    valid: boolean;
    issuer: string;
    expires_days: number;
  };
  dns_records?: {
    a_records: number;
    mx_records: number;
    txt_records: number;
  };
  isp?: string;
  last_reported?: string;
}

export default function DomainRiskAnalysis() {
  const [domainInput, setDomainInput] = useState('');
  const [analysis, setAnalysis] = useState<DomainAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomainInput(e.target.value);
    if (error) setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      analyzeDomain();
    }
  };

  const analyzeDomain = async () => {
    const rawTarget = domainInput.trim();
    if (!rawTarget) {
      setError('Please enter a domain or IP address (e.g. britishairways.com, 8.8.8.8)');
      return;
    }

    const cleanTarget = rawTarget
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0]
      .split(':')[0]
      .trim();

    if (!cleanTarget) {
      setError('Please enter a valid domain or IP address format.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000); // 40s timeout

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(
        `${API_URL}/api/domain-analysis/analyze?domain=${encodeURIComponent(cleanTarget)}`,
        {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Analysis failed with status ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Analysis timed out. The threat intelligence network may be slow. Please try again.');
      } else {
        setError(err.message || 'Failed to analyze domain. Please check the domain and try again.');
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL': return 'text-[#ff1744] bg-red-950/50 border-red-500/50';
      case 'HIGH': return 'text-[#ff5722] bg-orange-950/50 border-orange-500/50';
      case 'MEDIUM': return 'text-[#fbbf24] bg-amber-950/50 border-amber-500/50';
      case 'LOW': return 'text-[#00f2fe] bg-cyan-950/50 border-cyan-500/50';
      default: return 'text-zinc-400 bg-zinc-900 border-zinc-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL': return 'text-[#ff1744] bg-red-950/40 border-red-500/40';
      case 'HIGH': return 'text-[#ff5722] bg-orange-950/40 border-orange-500/40';
      case 'MEDIUM': return 'text-[#fbbf24] bg-amber-950/40 border-amber-500/40';
      case 'LOW': return 'text-[#00f2fe] bg-cyan-950/40 border-cyan-500/40';
      default: return 'text-zinc-400 bg-zinc-900 border-zinc-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#030004] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white text-glow flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-[#ff1744]" /> Domain & IP Threat Radar
          </h1>
          <p className="text-zinc-400 text-xs font-medium mt-1">
            Real-time multi-scanner domain reconnaissance, active incident analysis, and threat intelligence telemetry
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4 hover:border-[#ff1744] transition-all shadow-[0_8px_32px_0_rgba(0,0,0,0.95)]">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={domainInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter domain or IP address (e.g. britishairways.com, 8.8.8.8)"
                className="w-full bg-[#030004] border-2 border-[#360a25] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff1744] focus:shadow-[0_0_15px_rgba(255,23,68,0.5)] transition-all font-mono"
              />
            </div>
            {domainInput && (
              <button
                type="button"
                onClick={() => { setDomainInput(''); setError(''); }}
                className="px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white border-2 border-[#360a25] rounded-xl hover:border-zinc-500 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={analyzeDomain}
              disabled={loading || !domainInput.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-[#ff1744] via-[#be123c] to-[#880815] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_16px_rgba(255,23,68,0.6)] border border-white/20 hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <span>Analyze Domain</span>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-950/70 border border-red-500/50 text-red-300 rounded-xl flex items-center justify-between text-xs font-semibold">
              <span>{error}</span>
              <button
                onClick={() => setError('')}
                className="text-xs font-bold text-red-400 hover:text-white underline ml-4"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {analysis && (
          <div className="space-y-4">
            {/* Risk Overview */}
            {(() => {
              const unifiedStats = computeUnifiedSecurityStats(analysis, analysis.target || domainInput);
              return (
                <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4 hover:border-[#ff1744] transition-all">
                  <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                    <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-[#ff1744] animate-pulse" /> Threat Telemetry Overview
                    </h2>

                    {/* Rating Badge */}
                    <div className="flex items-center gap-2.5 bg-background/80 border border-border/80 rounded-xl p-1.5 px-2.5 shadow-sm">
                      <div className={`w-10 h-10 rounded-lg border-2 flex flex-col items-center justify-center font-mono flex-shrink-0 ${unifiedStats.gradeInfo.ring} ${unifiedStats.gradeInfo.badge}`}>
                        <span className="text-base font-black leading-none">{unifiedStats.gradeInfo.grade}</span>
                        <span className="text-[6px] uppercase font-bold tracking-wider mt-0.5">Rating</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="flex items-baseline gap-1 font-mono">
                          <span className={`font-black text-lg leading-none ${unifiedStats.gradeInfo.text}`}>{unifiedStats.score}</span>
                          <span className="text-[10px] text-secondary/70 font-semibold">/100</span>
                        </div>
                        <span className="text-[8px] text-secondary font-medium tracking-tight mt-0.5 whitespace-nowrap">Security Score</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#030004] border-2 border-[#360a25] rounded-lg">
                      <div className="text-[10px] font-black uppercase text-zinc-400 mb-1">Risk Level</div>
                      <div className={`text-xl font-black font-mono px-2 py-0.5 rounded border inline-block ${getRiskLevelColor(unifiedStats.risk)}`}>
                        {unifiedStats.risk}
                      </div>
                    </div>
                    <div className="p-3 bg-[#030004] border-2 border-[#360a25] rounded-lg">
                      <div className="text-[10px] font-black uppercase text-zinc-400 mb-1">Total Issues</div>
                      <div className="text-2xl font-black font-mono text-white text-glow">{unifiedStats.totalIssues}</div>
                    </div>
                    <div className="p-3 bg-[#030004] border-2 border-[#360a25] rounded-lg">
                      <div className="text-[10px] font-black uppercase text-zinc-400 mb-1">High / Critical</div>
                      <div className="text-2xl font-black font-mono text-[#ff1744] text-glow-critical">{unifiedStats.highCrit}</div>
                    </div>
                    <div className="p-3 bg-[#030004] border-2 border-[#360a25] rounded-lg">
                      <div className="text-[10px] font-black uppercase text-zinc-400 mb-1">Abuse Confidence</div>
                      <div className="text-2xl font-black font-mono text-[#fbbf24]">{analysis.abuse_confidence_score || 0}%</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* URLScan.io Analysis */}
            {analysis.urlscan_data && (
              <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4 hover:border-[#00f2fe] transition-all">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#00f2fe] mb-3">URLScan.io Intelligence</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="p-3 bg-[#030004] border-2 border-[#360a25] rounded-lg">
                    <div className="text-[10px] font-black uppercase text-zinc-400 mb-1">Total Scans</div>
                    <div className="text-xl font-black font-mono text-white">{analysis.urlscan_data.total_scans}</div>
                  </div>
                  <div className="p-3 bg-[#030004] border-2 border-[#360a25] rounded-lg">
                    <div className="text-[10px] font-black uppercase text-zinc-400 mb-1">Malicious</div>
                    <div className="text-xl font-black font-mono text-[#ff1744]">{analysis.urlscan_data.malicious_scans}</div>
                  </div>
                  <div className="p-3 bg-[#030004] border-2 border-[#360a25] rounded-lg">
                    <div className="text-[10px] font-black uppercase text-zinc-400 mb-1">Suspicious</div>
                    <div className="text-xl font-black font-mono text-[#fbbf24]">{analysis.urlscan_data.suspicious_scans}</div>
                  </div>
                  <div className="p-3 bg-[#030004] border-2 border-[#360a25] rounded-lg">
                    <div className="text-[10px] font-black uppercase text-zinc-400 mb-1">Clean</div>
                    <div className="text-xl font-black font-mono text-[#00ff88]">
                      {analysis.urlscan_data.total_scans - analysis.urlscan_data.malicious_scans - analysis.urlscan_data.suspicious_scans}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Threats */}
            <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4 hover:border-[#ff1744] transition-all">
              <h2 className="text-xs font-black uppercase tracking-widest text-white mb-3">Detected Threat Signatures</h2>
              {analysis.threats.length > 0 ? (
                <div className="space-y-2">
                  {analysis.threats.map((threat, idx) => (
                    <div key={idx} className="p-3 bg-[#030004] border-2 border-[#360a25] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-black text-xs text-white">{threat.type}</div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">First Seen: {threat.first_seen} • Last Seen: {threat.last_seen}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-400">Confidence: {threat.confidence}%</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border font-mono ${getSeverityColor(threat.severity)}`}>
                          {threat.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-xs text-zinc-500 py-3 font-medium">No threats detected for this target</div>
              )}
            </div>

            {/* Additional Information */}
            <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-white mb-3">Infrastructure & DNS Meta</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-[#030004] border-2 border-[#360a25] rounded-lg">
                  <div className="text-[10px] font-black uppercase text-zinc-400 mb-0.5">Country</div>
                  <div className="font-bold text-white font-mono">{analysis.country || 'Unknown'}</div>
                </div>
                <div className="p-2.5 bg-[#030004] border-2 border-[#360a25] rounded-lg">
                  <div className="text-[10px] font-black uppercase text-zinc-400 mb-0.5">ISP</div>
                  <div className="font-bold text-white truncate">{analysis.isp || 'Unknown'}</div>
                </div>
                <div className="p-2.5 bg-[#030004] border-2 border-[#360a25] rounded-lg">
                  <div className="text-[10px] font-black uppercase text-zinc-400 mb-0.5">Domain Age</div>
                  <div className="font-bold text-white font-mono">{analysis.domain_age_days || 'Unknown'} days</div>
                </div>
                <div className="p-2.5 bg-[#030004] border-2 border-[#360a25] rounded-lg">
                  <div className="text-[10px] font-black uppercase text-zinc-400 mb-0.5">SSL Certificate</div>
                  <div className={`font-bold font-mono ${analysis.ssl_certificate?.valid ? 'text-[#00ff88]' : 'text-[#ff1744]'}`}>
                    {analysis.ssl_certificate?.valid ? 'Valid SSL' : 'Invalid SSL'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

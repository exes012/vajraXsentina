'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { TrendingUp, Globe, AlertTriangle, Target, MapPin } from 'lucide-react'

const INITIAL_GLOBAL_ATTACKS = [
  { id: 1, type: 'DDoS', target: 'Financial Services', country: 'USA', severity: 'Critical', time: '2 min ago', source: 'China' },
  { id: 2, type: 'Ransomware', target: 'Healthcare', country: 'UK', severity: 'Critical', time: '5 min ago', source: 'Russia' },
  { id: 3, type: 'Phishing', target: 'Government', country: 'Germany', severity: 'High', time: '8 min ago', source: 'North Korea' },
  { id: 4, type: 'Malware', target: 'Manufacturing', country: 'France', severity: 'High', time: '12 min ago', source: 'Iran' },
  { id: 5, type: 'SQL Injection', target: 'E-commerce', country: 'Canada', severity: 'Medium', time: '15 min ago', source: 'Brazil' },
  { id: 6, type: 'Zero-Day', target: 'Technology', country: 'India', severity: 'Critical', time: '18 min ago', source: 'Unknown' },
  { id: 7, type: 'Botnet', target: 'Energy', country: 'Australia', severity: 'High', time: '22 min ago', source: 'China' },
  { id: 8, type: 'APT', target: 'Defense', country: 'Japan', severity: 'Critical', time: '25 min ago', source: 'China' },
  { id: 9, type: 'Supply Chain', target: 'Software', country: 'South Korea', severity: 'High', time: '28 min ago', source: 'North Korea' },
  { id: 10, type: 'Insider Threat', target: 'Finance', country: 'Singapore', severity: 'Medium', time: '32 min ago', source: 'Internal' },
  { id: 11, type: 'Social Engineering', target: 'Healthcare', country: 'UAE', severity: 'High', time: '35 min ago', source: 'Unknown' },
  { id: 12, type: 'Ransomware', target: 'Education', country: 'South Africa', severity: 'Critical', time: '38 min ago', source: 'Russia' },
  { id: 13, type: 'Credential Stuffing', target: 'Retail', country: 'Mexico', severity: 'Medium', time: '42 min ago', source: 'Dark Web' },
  { id: 14, type: 'Man-in-the-Middle', target: 'Banking', country: 'Brazil', severity: 'High', time: '45 min ago', source: 'Brazil' },
  { id: 15, type: 'Cryptojacking', target: 'Cloud', country: 'Netherlands', severity: 'Medium', time: '48 min ago', source: 'Unknown' },
]

export default function GlobalAttacksPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [attacks, setAttacks] = useState<any[]>(INITIAL_GLOBAL_ATTACKS)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-danger bg-danger/10 border-danger/20'
      case 'High': return 'text-warning bg-warning/10 border-warning/20'
      case 'Medium': return 'text-primary bg-primary/10 border-primary/20'
      default: return 'text-secondary bg-secondary/10 border-secondary/20'
    }
  }

  return (
    <div className="flex min-h-screen bg-[#030004] text-white">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-4 w-full max-w-[1440px] mx-auto space-y-3.5">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">GLOBAL ATTACKS TELEMETRY</h1>
              <p className="text-zinc-400 text-xs font-medium mt-0.5">Live planetary distributed cyber attack monitoring, vectors, and geolocations</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-3.5 hover:border-[#ff1744] hover:shadow-[0_0_16px_rgba(255,23,68,0.35)] transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <TrendingUp className="w-4 h-4 text-[#ff1744]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Total Attacks</span>
                </div>
                <div className="text-2xl font-black text-[#ff1744] font-mono">1,247</div>
                <div className="text-[10px] font-bold text-[#ff1744] font-mono mt-0.5">↑ 18% vs yesterday</div>
              </div>
              <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-3.5 hover:border-[#00f2fe] hover:shadow-[0_0_16px_rgba(0,242,254,0.3)] transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <Globe className="w-4 h-4 text-[#00f2fe]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Countries Impacted</span>
                </div>
                <div className="text-2xl font-black text-[#00f2fe] font-mono">87</div>
              </div>
              <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-3.5 hover:border-[#fbbf24] hover:shadow-[0_0_16px_rgba(251,191,36,0.3)] transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#fbbf24]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Critical Vectors</span>
                </div>
                <div className="text-2xl font-black text-[#fbbf24] font-mono">342</div>
              </div>
              <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-3.5 hover:border-[#00ff88] hover:shadow-[0_0_16px_rgba(0,255,136,0.3)] transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <TrendingUp className="w-4 h-4 text-[#00ff88]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Active Honeypots</span>
                </div>
                <div className="text-2xl font-black text-[#00ff88] font-mono">2,890</div>
              </div>
            </div>

            {/* Live Attack Feed */}
            <div className="bg-card border border-border rounded-xl p-6 hover:border-glow-blue transition-all duration-300 hover:shadow-glow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Live Attack Feed</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-danger rounded-full animate-pulse" />
                  <span className="text-xs text-secondary">Live Updates</span>
                </div>
              </div>

              <div className="space-y-3">
                {attacks.map((attack, index) => (
                  <motion.div
                    key={attack.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-glow-blue transition-all duration-300 hover:shadow-glow cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span className="text-xs text-secondary">{attack.country}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{attack.type}</span>
                          <span className="text-xs text-secondary">→</span>
                          <span className="text-sm text-foreground">{attack.target}</span>
                        </div>
                        <div className="text-xs text-secondary mt-1">Source: {attack.source}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(attack.severity)}`}>
                        {attack.severity}
                      </span>
                      <span className="text-xs text-secondary">{attack.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Attack Types Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-6 hover:border-glow-blue transition-all duration-300 hover:shadow-glow">
                <h3 className="text-sm font-semibold text-foreground mb-4">Attack Types</h3>
                <div className="space-y-3">
                  {[
                    { type: 'DDoS', count: 342, percentage: 27 },
                    { type: 'Ransomware', count: 289, percentage: 23 },
                    { type: 'Phishing', count: 234, percentage: 19 },
                    { type: 'Malware', count: 178, percentage: 14 },
                    { type: 'Zero-Day', count: 89, percentage: 7 },
                    { type: 'Other', count: 115, percentage: 10 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground">{item.type}</span>
                        <span className="text-secondary">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 hover:border-glow-blue transition-all duration-300 hover:shadow-glow">
                <h3 className="text-sm font-semibold text-foreground mb-4">Top Targeted Sectors</h3>
                <div className="space-y-3">
                  {[
                    { sector: 'Financial Services', count: 234 },
                    { sector: 'Healthcare', count: 189 },
                    { sector: 'Government', count: 167 },
                    { sector: 'Technology', count: 145 },
                    { sector: 'Manufacturing', count: 123 },
                    { sector: 'Education', count: 98 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-background rounded-lg">
                      <span className="text-xs text-foreground">{item.sector}</span>
                      <span className="text-xs font-medium text-foreground">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

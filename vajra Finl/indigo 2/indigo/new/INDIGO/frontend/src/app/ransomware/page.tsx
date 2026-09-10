'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import RansomwareLive from '@/components/RansomwareLive'
import { ransomwareService } from '@/services/ransomware.service'

export default function RansomwarePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [stats, setStats] = useState<any>(() => ransomwareService.getCachedOrInitialStats())

  useEffect(() => {
    let isMounted = true
    ransomwareService.getStats().then((data) => {
      if (isMounted && data) {
        setStats(data)
      }
    }).catch((err) => {
      console.warn('Background ransomware stats refresh notice:', err)
    })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-[#030004] text-white">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
      />
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
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">RANSOMWARE THREAT INTELLIGENCE</h1>
              <p className="text-zinc-400 text-xs font-medium mt-0.5">Real-time ransomware adversary monitoring, victim tracking, and decryptor intelligence</p>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-3.5 hover:border-[#00f2fe] hover:shadow-[0_0_16px_rgba(0,242,254,0.3)] transition-all">
                  <div className="text-2xl font-black text-[#00f2fe] font-mono">{stats.groupsCount}</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mt-1">Active APT Groups</div>
                </div>
                <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-3.5 hover:border-white hover:shadow-[0_0_16px_rgba(255,255,255,0.2)] transition-all">
                  <div className="text-2xl font-black text-white font-mono">{stats.overallVictims?.toLocaleString()}</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mt-1">Overall Global Victims</div>
                </div>
                <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-3.5 hover:border-[#ff1744] hover:shadow-[0_0_16px_rgba(255,23,68,0.35)] transition-all">
                  <div className="text-2xl font-black text-[#ff1744] font-mono">{stats.victimsThisYear?.toLocaleString()}</div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-zinc-400 mt-1">
                    <span>Victims This Year</span>
                    <span className="text-[#ff1744] font-bold font-mono">{stats.victimsThisYearTrend}</span>
                  </div>
                </div>
                <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-3.5 hover:border-[#00ff88] hover:shadow-[0_0_16px_rgba(0,255,136,0.3)] transition-all">
                  <div className="text-2xl font-black text-[#00ff88] font-mono">{stats.victimsThisMonth?.toLocaleString()}</div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-zinc-400 mt-1">
                    <span>Victims This Month</span>
                    <span className="text-[#00ff88] font-bold font-mono">{stats.victimsThisMonthTrend}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Ransomware Live Feed */}
            <RansomwareLive />

            {/* Additional Info */}
            <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4 hover:border-[#ff1744] transition-all duration-300">
              <h2 className="text-sm font-black text-white uppercase tracking-wider mb-2">About Ransomware Threat Feed</h2>
              <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                Ransomware.live tracks and monitors ransomware groups&apos; victims and their activity. 
                This dashboard provides simulated threat intelligence data that mirrors the types of 
                information available from ransomware.live, including attack patterns, target industries, 
                and geographic distribution.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Key Features</h3>
                  <ul className="text-xs text-secondary space-y-1">
                    <li>• Real-time attack monitoring</li>
                    <li>• Ransomware group tracking</li>
                    <li>• Target industry analysis</li>
                    <li>• Geographic threat distribution</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Data Sources</h3>
                  <ul className="text-xs text-secondary space-y-1">
                    <li>• Dark web monitoring</li>
                    <li>• Victim leak sites</li>
                    <li>• Security research reports</li>
                    <li>• Threat intelligence feeds</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

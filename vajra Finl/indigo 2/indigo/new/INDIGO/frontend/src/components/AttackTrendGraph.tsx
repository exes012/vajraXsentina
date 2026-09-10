'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AttackTrendGraph() {
  const [showFullChart, setShowFullChart] = useState(false)

  const attackTrendData = [
    { month: 'Jan', attacks: 850, critical: 245, high: 320, medium: 185, low: 100 },
    { month: 'Feb', attacks: 920, critical: 280, high: 350, medium: 190, low: 100 },
    { month: 'Mar', attacks: 880, critical: 260, high: 330, medium: 190, low: 100 },
    { month: 'Apr', attacks: 1050, critical: 320, high: 400, medium: 230, low: 100 },
    { month: 'May', attacks: 1180, critical: 380, high: 450, medium: 250, low: 100 },
    { month: 'Jun', attacks: 1247, critical: 420, high: 480, medium: 247, low: 100 },
  ]

  const stats = {
    totalAttacks: 6127,
    avgPerMonth: 1021,
    peakMonth: 'Jun',
    growthRate: '+46.7%',
    criticalAttacks: 1905,
    blockedAttacks: 4850
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border-[2.5px] border-[#360a25] rounded-xl p-3.5 sm:p-4 hover:border-[#ff1744] transition-all duration-200 hover:shadow-[0_0_18px_rgba(255,23,68,0.25)]"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#ff1744]" />
          <h2 className="text-xs font-black text-white uppercase tracking-widest text-glow">ATTACK TREND TELEMETRY</h2>
          <span className="text-[9.5px] font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full">6 MONTH HORIZON</span>
        </div>
        <button
          onClick={() => setShowFullChart(!showFullChart)}
          className="text-[10.5px] font-black uppercase tracking-wider text-[#ff1744] hover:text-white transition-colors px-2 py-0.5 bg-red-950/40 border border-[#360a25] rounded-lg"
        >
          {showFullChart ? 'Show Less' : 'See More'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-2.5">
        <div className="bg-background border-2 border-[#360a25] rounded-lg p-2 hover:border-[#00f2fe] transition-all duration-150">
          <div className="text-base font-black text-accent text-glow-cyan">{stats.totalAttacks.toLocaleString()}</div>
          <div className="text-[8.5px] text-zinc-400 uppercase font-black tracking-wider mt-0.5">Total Attacks</div>
        </div>
        <div className="bg-background border-2 border-[#360a25] rounded-lg p-2 hover:border-white transition-all duration-150">
          <div className="text-base font-black text-white text-glow">{stats.avgPerMonth.toLocaleString()}</div>
          <div className="text-[8.5px] text-zinc-400 uppercase font-black tracking-wider mt-0.5">Avg/Month</div>
        </div>
        <div className="bg-background border-2 border-[#360a25] rounded-lg p-2 hover:border-red-500 transition-all duration-150">
          <div className="text-base font-black severity-critical text-glow-critical">{stats.criticalAttacks.toLocaleString()}</div>
          <div className="text-[8.5px] text-zinc-400 uppercase font-black tracking-wider mt-0.5">Critical</div>
        </div>
        <div className="bg-background border-2 border-[#360a25] rounded-lg p-2 hover:border-emerald-500 transition-all duration-150">
          <div className="text-base font-black severity-low text-glow-low">{stats.blockedAttacks.toLocaleString()}</div>
          <div className="text-[8.5px] text-zinc-400 uppercase font-black tracking-wider mt-0.5">Blocked</div>
        </div>
        <div className="bg-background border-2 border-[#360a25] rounded-lg p-2 hover:border-orange-500 transition-all duration-150">
          <div className="text-base font-black severity-high text-glow-high">{stats.growthRate}</div>
          <div className="text-[8.5px] text-zinc-400 uppercase font-black tracking-wider mt-0.5">Growth</div>
        </div>
        <div className="bg-background border-2 border-[#360a25] rounded-lg p-2 hover:border-purple-500 transition-all duration-150">
          <div className="text-base font-black text-purple-400 text-glow-purple">{stats.peakMonth}</div>
          <div className="text-[8.5px] text-zinc-400 uppercase font-black tracking-wider mt-0.5">Peak Month</div>
        </div>
      </div>

      <div className={showFullChart ? "h-48" : "h-32"}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={attackTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#28081c" />
            <XAxis dataKey="month" stroke="#a1a1aa" fontSize={9} />
            <YAxis stroke="#a1a1aa" fontSize={9} />
            <Tooltip
              contentStyle={{ backgroundColor: '#060108', border: '2px solid #360a25', borderRadius: '6px', fontSize: '10px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Area
              type="monotone"
              dataKey="attacks"
              stroke="#ff1744"
              fill="rgba(255, 23, 68, 0.25)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

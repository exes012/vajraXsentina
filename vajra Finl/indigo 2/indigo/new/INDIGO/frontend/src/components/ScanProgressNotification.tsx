'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Loader2, 
  ShieldCheck, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Server, 
  Lock, 
  Bug, 
  Activity,
  Clock
} from 'lucide-react'
import { getGradeFromScore } from '@/lib/securityScoring'

export interface ScanState {
  active: boolean
  companyId: number | null
  companyName: string
  domain: string
  step: number
  totalSteps: number
  phaseTitle: string
  phaseDetail: string
  percent: number
  secondsRemaining: number
  status: 'scanning' | 'completed' | 'error'
  resultScore?: number
  resultRisk?: string
  resultIssues?: number
  errorMessage?: string
}

interface ScanProgressNotificationProps {
  scan: ScanState
  onClose: () => void
}

export default function ScanProgressNotification({ scan, onClose }: ScanProgressNotificationProps) {
  if (!scan.active) return null

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Radio className="w-4 h-4 text-[#00f2fe] animate-pulse" />
      case 2:
        return <Lock className="w-4 h-4 text-[#c084fc] animate-pulse" />
      case 3:
        return <Activity className="w-4 h-4 text-[#fbbf24] animate-pulse" />
      case 4:
        return <Server className="w-4 h-4 text-[#ff5722] animate-pulse" />
      case 5:
        return <Bug className="w-4 h-4 text-[#ff1744] animate-pulse" />
      default:
        return <Loader2 className="w-4 h-4 text-[#ff1744] animate-spin" />
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed bottom-5 right-5 z-[9999] max-w-md w-[calc(100vw-2.5rem)] sm:w-[420px] bg-[#060108]/95 backdrop-blur-xl border-2 border-[#360a25] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.95),0_0_24px_rgba(255,23,68,0.25)] p-4 text-white overflow-hidden"
      >
        {/* Glowing Top Status Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-300"
          style={{
            background: scan.status === 'completed'
              ? 'linear-gradient(90deg, #00ff88, #00f2fe)'
              : scan.status === 'error'
              ? '#ff1744'
              : 'linear-gradient(90deg, #ff1744, #00f2fe, #c084fc)'
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${
              scan.status === 'completed'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-[#00ff88]'
                : scan.status === 'error'
                ? 'bg-red-500/15 border-red-500/40 text-[#ff1744]'
                : 'bg-red-500/10 border-[#360a25] text-[#ff1744]'
            }`}>
              {scan.status === 'completed' ? (
                <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
              ) : scan.status === 'error' ? (
                <AlertTriangle className="w-5 h-5 text-[#ff1744]" />
              ) : (
                <Loader2 className="w-5 h-5 text-[#ff1744] animate-spin" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-300">
                  {scan.status === 'completed' ? 'Scan Complete' : scan.status === 'error' ? 'Scan Failed' : 'Security Recon In Progress'}
                </span>
                {scan.status === 'scanning' && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    ~{scan.secondsRemaining}s left
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white truncate font-mono mt-0.5">
                {scan.domain || scan.companyName}
              </h4>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scanning Content & Live Progress */}
        {scan.status === 'scanning' && (
          <div className="space-y-2.5 mt-1">
            {/* Phase Description */}
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-1.5 text-zinc-200">
                {getStepIcon(scan.step)}
                <span className="font-semibold">{scan.phaseTitle}</span>
              </div>
              <span className="font-mono text-[11px] font-bold text-[#00f2fe]">
                {scan.percent}%
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-tight line-clamp-1">
              {scan.phaseDetail}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-[#030004] border border-[#360a25] rounded-full h-2 overflow-hidden p-[1px]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#ff1744] via-[#be123c] to-[#00f2fe] shadow-[0_0_10px_rgba(255,23,68,0.5)]"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(100, Math.max(5, scan.percent))}%` }}
                transition={{ ease: 'easeOut', duration: 0.35 }}
              />
            </div>

            {/* Multi-Engine Matrix Strip */}
            <div className="flex items-center justify-between pt-1 border-t border-[#360a25]/60 text-[10px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${scan.step >= 1 ? 'bg-[#00ff88]' : 'bg-zinc-600'}`} />
                DNS/WHOIS
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${scan.step >= 2 ? 'bg-[#00ff88]' : 'bg-zinc-600'}`} />
                TLS/SSL
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${scan.step >= 3 ? 'bg-[#00ff88]' : 'bg-zinc-600'}`} />
                ThreatFox/VT
              </span>
              <span className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${scan.step >= 4 ? 'bg-[#00ff88]' : 'bg-zinc-600'}`} />
                Ports/CVEs
              </span>
            </div>
          </div>
        )}

        {/* Completed State */}
        {scan.status === 'completed' && (() => {
          const score = scan.resultScore ?? 95
          const gradeInfo = getGradeFromScore(score)
          return (
            <div className="mt-2.5 pt-2.5 border-t border-emerald-500/20 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2.5">
                {/* Rating Badge */}
                <div className={`w-8 h-8 rounded-lg border flex flex-col items-center justify-center font-mono flex-shrink-0 ${gradeInfo.ring} ${gradeInfo.badge}`}>
                  <span className="text-xs font-black leading-none">{gradeInfo.grade}</span>
                  <span className="text-[5px] uppercase font-bold tracking-tight mt-0.5">Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[#00ff88] font-mono font-bold">
                    Score: {score}/100
                  </div>
                  <span className="text-zinc-300 font-medium">
                    {scan.resultRisk || gradeInfo.risk} Risk
                  </span>
                </div>
              </div>
              <span className="text-zinc-400 text-[10px] font-mono whitespace-nowrap">
                Telemetry Synced
              </span>
            </div>
          )
        })()}

        {/* Error State */}
        {scan.status === 'error' && (
          <div className="mt-2 pt-2 border-t border-red-500/20 text-xs text-red-300">
            {scan.errorMessage || 'Scan could not reach external engines. Retrying with local cache.'}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

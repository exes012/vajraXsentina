'use client'

import { motion } from 'framer-motion'
import { Shield, Crosshair } from 'lucide-react'
import { usePlatformStore, PlatformMode } from '@/store/platformStore'
import { useRouter, usePathname } from 'next/navigation'

interface PlatformToggleProps {
  className?: string
  compact?: boolean
}

export default function PlatformToggle({ className = '', compact = false }: PlatformToggleProps) {
  const { currentPlatform, setPlatform } = usePlatformStore()
  const router = useRouter()
  const pathname = usePathname()

  const handleSwitch = (platform: PlatformMode) => {
    setPlatform(platform)
    if (pathname !== '/') {
      router.push('/')
    }
  }

  return (
    <div
      className={`inline-flex items-center p-1 bg-[#040006] border-[1.5px] border-[#360a25] rounded-xl backdrop-blur-xl shadow-[0_0_14px_rgba(255,23,68,0.2)] relative select-none flex-shrink-0 ${className}`}
    >
      {/* VAJRA Switch Button */}
      <button
        type="button"
        onClick={() => handleSwitch('VAJRA')}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
          currentPlatform === 'VAJRA'
            ? 'text-white'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Shield
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            currentPlatform === 'VAJRA' ? 'text-[#ff1744] scale-105' : 'text-zinc-500'
          }`}
        />
        <span>VAJRA</span>
        {!compact && (
          <span
            className={`text-[8.5px] px-1 py-0.2 rounded font-mono font-bold tracking-normal ${
              currentPlatform === 'VAJRA'
                ? 'bg-red-500/30 text-red-200 border border-red-500/50'
                : 'bg-zinc-800/80 text-zinc-500'
            }`}
          >
            INTEL
          </span>
        )}
        {currentPlatform === 'VAJRA' && (
          <motion.div
            layoutId="platform-active-pill"
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#ff1744]/35 via-[#be123c]/45 to-[#880815]/35 border border-[#ff1744] shadow-[0_0_12px_rgba(255,23,68,0.6)] -z-10"
          />
        )}
      </button>

      {/* SENTINA Switch Button */}
      <button
        type="button"
        onClick={() => handleSwitch('SENTINA')}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
          currentPlatform === 'SENTINA'
            ? 'text-white'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Crosshair
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            currentPlatform === 'SENTINA' ? 'text-[#00f2fe] scale-105 rotate-45' : 'text-zinc-500'
          }`}
        />
        <span>SENTINA</span>
        {!compact && (
          <span
            className={`text-[8.5px] px-1 py-0.2 rounded font-mono font-bold tracking-normal ${
              currentPlatform === 'SENTINA'
                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50'
                : 'bg-zinc-800/80 text-zinc-500'
            }`}
          >
            SECOPS
          </span>
        )}
        {currentPlatform === 'SENTINA' && (
          <motion.div
            layoutId="platform-active-pill"
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00f2fe]/30 via-[#0284c7]/40 to-[#0369a1]/30 border border-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.5)] -z-10"
          />
        )}
      </button>
    </div>
  )
}

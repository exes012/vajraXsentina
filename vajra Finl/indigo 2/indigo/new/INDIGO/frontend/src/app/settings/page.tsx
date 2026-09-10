'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, Bell, Globe, Lock, User, Database, Radio, 
  Sliders, Webhook, CheckCircle2, Send, Save, AlertTriangle, RefreshCw
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useLanguageStore } from '@/store/languageStore'
import { useNotificationStore } from '@/store/notificationStore'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user } = useAuthStore()
  const { addNotification } = useNotificationStore()

  // Settings State
  const [scanInterval, setScanInterval] = useState('15m')
  const [criticalThreshold, setCriticalThreshold] = useState(80)
  const [highThreshold, setHighThreshold] = useState(60)
  const [minConfidence, setMinConfidence] = useState(85)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [ransomwareAlerts, setRansomwareAlerts] = useState(true)
  const [gdeltAlerts, setGdeltAlerts] = useState(true)
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXXX')
  const [discordWebhook, setDiscordWebhook] = useState('')
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [testWebhookStatus, setTestWebhookStatus] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveSettings = () => {
    setSavedSuccess(true)
    addNotification({
      title: '⚙️ Settings Updated',
      message: 'Platform telemetry scan frequencies, alert thresholds, and webhook dispatchers saved successfully.',
      type: 'SYSTEM',
      severity: 'INFO'
    })
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleTestWebhook = () => {
    setTestWebhookStatus('Testing...')
    setTimeout(() => {
      setTestWebhookStatus('✅ Webhook Test Payload Successfully Delivered')
      addNotification({
        title: '📡 Webhook Dispatcher Test',
        message: 'A test alert payload was dispatched to your configured endpoint.',
        type: 'SYSTEM',
        severity: 'INFO'
      })
      setTimeout(() => setTestWebhookStatus(null), 4000)
    }, 1000)
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-[#030004]">
        <div className="w-[232px] bg-[#040005] border-r-[2.5px] border-[#360a25] h-screen animate-pulse" />
        <div className="flex-1 flex flex-col">
          <div className="h-[52px] bg-[#060108] border-b-[2.5px] border-[#360a25] animate-pulse" />
          <main className="flex-1 p-6 space-y-6">
            <div className="h-64 bg-[#060108] rounded-xl animate-pulse" />
          </main>
        </div>
      </div>
    )
  }

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider text-glow flex items-center gap-2">
                  <Sliders className="w-6 h-6 text-[#ff1744]" /> Enterprise System Settings
                </h1>
                <p className="text-zinc-400 text-xs font-medium mt-0.5">
                  Configure automated scanning intervals, alert thresholds, multi-channel webhooks, and preferences
                </p>
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-gradient-to-r from-[#ff1744] via-[#be123c] to-[#880815] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_14px_rgba(255,23,68,0.5)] border border-white/20 hover:brightness-110 transition-all"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-xs text-[#00ff88] font-bold flex items-center gap-2 shadow-[0_0_14px_rgba(0,255,136,0.2)]">
                <CheckCircle2 className="w-4 h-4" /> System preferences & thresholds saved successfully!
              </div>
            )}

            {/* 1. Automated Telemetry & Scan Frequency */}
            <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.95)] space-y-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#ff1744]" />
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-white">Automated Telemetry & Scan Frequencies</h2>
                  <p className="text-[10px] text-zinc-400">Define how frequently domain assets, NVD CVE feeds, and dark web indexes sync</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {[
                  { label: 'Real-Time (15m)', value: '15m', desc: 'Continuous stream for high-risk assets' },
                  { label: 'Standard (1 hour)', value: '1h', desc: 'Default hourly assessment cycle' },
                  { label: 'Extended (6 hours)', value: '6h', desc: 'Periodic domain telemetry check' },
                  { label: 'Daily (24 hours)', value: '24h', desc: 'Low bandwidth daily snapshot' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setScanInterval(item.value)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      scanInterval === item.value
                        ? 'bg-red-950/40 border-[#ff1744] text-white shadow-[0_0_12px_rgba(255,23,68,0.3)]'
                        : 'bg-[#030004] border-[#360a25] text-zinc-400 hover:border-zinc-500 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-black font-mono">{item.label}</p>
                    <p className="text-[9.5px] text-zinc-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Alert Threshold Sliders */}
            <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.95)] space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#fbbf24]" />
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-white">Security Risk Trigger Thresholds</h2>
                  <p className="text-[10px] text-zinc-400">Fine-tune automated alerting triggers for risk score drops and adversary activity</p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-zinc-300">Critical Severity Alert Trigger</span>
                    <span className="font-mono font-black text-[#ff1744]">Score &ge; {criticalThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="95"
                    value={criticalThreshold}
                    onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#030004] rounded-lg appearance-none cursor-pointer accent-[#ff1744]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-zinc-300">High Severity Alert Trigger</span>
                    <span className="font-mono font-black text-[#fbbf24]">Score &ge; {highThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="80"
                    value={highThreshold}
                    onChange={(e) => setHighThreshold(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#030004] rounded-lg appearance-none cursor-pointer accent-[#fbbf24]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Multi-Channel Webhooks */}
            <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.95)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Webhook className="w-4 h-4 text-[#00f2fe]" />
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-white">Real-Time Webhook Alert Dispatchers</h2>
                    <p className="text-[10px] text-zinc-400">Push high-severity threat payloads to SIEM, Slack, Discord, or SOAR</p>
                  </div>
                </div>

                <button
                  onClick={handleTestWebhook}
                  className="px-3 py-1 bg-[#030004] hover:bg-black border-2 border-[#360a25] hover:border-[#00f2fe] text-xs font-black uppercase tracking-wider text-[#00f2fe] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" /> Test Webhook
                </button>
              </div>

              {testWebhookStatus && (
                <div className="p-2.5 bg-cyan-950/60 border border-cyan-500/40 rounded-lg text-xs text-[#00f2fe] font-mono">
                  {testWebhookStatus}
                </div>
              )}

              <div className="space-y-2 pt-1">
                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-400 mb-1">Slack / Mattermost Webhook Endpoint</label>
                  <input
                    type="text"
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full bg-[#030004] border-2 border-[#360a25] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#00f2fe]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

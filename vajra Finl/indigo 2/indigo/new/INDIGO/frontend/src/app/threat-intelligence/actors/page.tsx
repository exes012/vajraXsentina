'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Search, 
  X, 
  Shield, 
  AlertTriangle, 
  Globe, 
  Crosshair, 
  Cpu, 
  Lock, 
  Activity, 
  CheckCircle2, 
  FileCode, 
  Layers, 
  Bug, 
  Zap, 
  Key, 
  Radio,
  BookOpen,
  Calendar,
  Compass,
  FileText,
  Filter
} from 'lucide-react'
import { threatActorsService, ThreatActor, MitreTechnique, IncidentCase } from '@/services/threatActors.service'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

type DossierTab = 'OVERVIEW' | 'MITRE' | 'WEAPONRY' | 'CASES' | 'DEFENSE'

export default function ThreatActorsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [actors, setActors] = useState<ThreatActor[]>(() => threatActorsService.getCachedOrInitial())
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('ALL')
  const [countryFilter, setCountryFilter] = useState<string>('ALL')
  const [selectedActor, setSelectedActor] = useState<ThreatActor | null>(null)
  const [activeTab, setActiveTab] = useState<DossierTab>('OVERVIEW')

  useEffect(() => {
    let isMounted = true
    threatActorsService.getThreatActors().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setActors(data)
      }
    }).catch((err) => {
      console.warn('Background threat actors refresh notice:', err)
    })
    return () => {
      isMounted = false
    }
  }, [])

  const getActivityColor = (level: string = 'HIGH') => {
    const l = level.toUpperCase()
    if (l === 'CRITICAL') return 'bg-red-950/70 text-[#ff1744] border-red-500/60 shadow-[0_0_12px_rgba(255,23,68,0.4)]'
    if (l === 'HIGH') return 'bg-orange-950/70 text-[#ff5722] border-orange-500/60 shadow-[0_0_10px_rgba(255,87,34,0.3)]'
    return 'bg-cyan-950/70 text-[#00f2fe] border-cyan-500/60'
  }

  const getTacticColor = (tactic: string = '') => {
    const t = tactic.toLowerCase()
    if (t.includes('initial') || t.includes('access')) return 'bg-amber-950/50 text-amber-400 border-amber-500/40'
    if (t.includes('execution') || t.includes('command')) return 'bg-purple-950/50 text-purple-400 border-purple-500/40'
    if (t.includes('persistence') || t.includes('evasion')) return 'bg-blue-950/50 text-blue-400 border-blue-500/40'
    if (t.includes('credential') || t.includes('privilege')) return 'bg-rose-950/50 text-rose-400 border-rose-500/40'
    if (t.includes('impact') || t.includes('destruction')) return 'bg-red-950/60 text-[#ff1744] border-red-500/50'
    return 'bg-cyan-950/50 text-cyan-400 border-cyan-500/40'
  }

  // Extract unique countries
  const availableCountries = useMemo(() => {
    const list = new Set<string>()
    actors.forEach(a => {
      if (a.country) list.add(a.country.split('/')[0].trim())
    })
    return ['ALL', ...Array.from(list)]
  }, [actors])

  const filteredActors = useMemo(() => {
    return actors.filter((actor) => {
      const matchesSearch = 
        (actor.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (actor.country || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (actor.attribution || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (actor.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (actor.additional_description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (actor.targeted_sectors || actor.targets || []).some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (actor.aliases || []).some((a: string) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (actor.malware_tools || []).some((m: string) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (actor.weaponized_cves || []).some((c: string) => c.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesSeverity = severityFilter === 'ALL' || actor.activity_level.toUpperCase() === severityFilter.toUpperCase()
      const matchesCountry = countryFilter === 'ALL' || (actor.country || '').includes(countryFilter)

      return matchesSearch && matchesSeverity && matchesCountry
    })
  }, [actors, searchQuery, severityFilter, countryFilter])

  return (
    <div className="flex min-h-screen bg-[#030004] text-white">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-4 w-full max-w-[1440px] mx-auto space-y-4">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0d0111] via-[#060108] to-[#0d0111] border-2 border-[#360a25] rounded-2xl p-4 sm:p-5 shadow-[0_0_25px_rgba(255,23,68,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center justify-center shadow-[0_0_12px_rgba(255,23,68,0.4)]">
                  <Crosshair className="w-5 h-5 text-[#ff1744]" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider text-glow flex items-center gap-2">
                    NATION-STATE APT & THREAT ADVERSARIES
                  </h1>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Comprehensive Threat Intelligence Dossiers • MITRE ATT&CK Mappings • Weaponized CVEs & Toolsets
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#030004] border border-[#360a25] px-3.5 py-1.5 rounded-xl text-center">
                <span className="text-[9px] text-zinc-400 uppercase font-black tracking-wider block">Tracked Syndicates</span>
                <span className="text-base font-black text-white font-mono">{actors.length} APT Groups</span>
              </div>
              <div className="bg-[#030004] border border-red-500/40 px-3.5 py-1.5 rounded-xl text-center shadow-[0_0_10px_rgba(255,23,68,0.2)]">
                <span className="text-[9px] text-[#ff1744] uppercase font-black tracking-wider block">Critical Severity</span>
                <span className="text-base font-black text-[#ff1744] font-mono">
                  {actors.filter(a => a.activity_level.toUpperCase() === 'CRITICAL').length} Active
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#060108] border-2 border-[#360a25] p-3 rounded-xl">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by actor name, aliases, CVE, malware, country, sector, or attribution..."
                className="w-full pl-10 pr-4 py-2 bg-[#030004] border border-[#360a25] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff1744] focus:shadow-[0_0_12px_rgba(255,23,68,0.4)] transition-all font-medium"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                <Filter className="w-3.5 h-3.5 text-zinc-500" /> Severity:
              </div>
              {['ALL', 'CRITICAL', 'HIGH'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border transition-all ${
                    severityFilter === sev
                      ? 'bg-red-950 text-[#ff1744] border-red-500/80 shadow-[0_0_8px_rgba(255,23,68,0.4)]'
                      : 'bg-[#030004] text-zinc-400 border-[#360a25] hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}

              <div className="h-4 w-[1px] bg-[#360a25] mx-1 hidden sm:block" />

              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-[#030004] border border-[#360a25] text-zinc-300 text-[11px] font-mono rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#ff1744]"
              >
                {availableCountries.map(c => (
                  <option key={c} value={c}>Origin: {c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Threat Actors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredActors.map((actor, index) => {
              const attackCount = actor.attacks_count || actor.attack_count || 185
              const sectors = actor.targeted_sectors || actor.targets || ['Government', 'Finance', 'Healthcare']
              const aliases = actor.aliases || []
              const malwareList = actor.malware_tools || []
              const cvesList = actor.weaponized_cves || []

              return (
                <motion.div
                  key={actor.id || index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  onClick={() => {
                    setSelectedActor(actor)
                    setActiveTab('OVERVIEW')
                  }}
                  className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4 hover:border-[#ff1744] hover:shadow-[0_0_20px_rgba(255,23,68,0.25)] transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-600/5 to-transparent rounded-bl-full pointer-events-none" />

                  <div>
                    {/* Top Row: Icon + Name + Severity */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-red-950/50 border border-red-500/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(255,23,68,0.3)]">
                          <Users className="w-5 h-5 text-[#ff1744]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white group-hover:text-[#ff1744] transition-colors leading-tight">
                            {actor.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full border font-mono ${getActivityColor(actor.activity_level)}`}>
                              {actor.activity_level || 'HIGH'}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {actor.country || 'Global'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Aliases Chips */}
                    {aliases.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap mb-2.5">
                        <span className="text-[9px] font-mono text-zinc-500 font-bold">AKA:</span>
                        {aliases.slice(0, 3).map((alias, aIdx) => (
                          <span key={aIdx} className="text-[9px] font-mono px-1.5 py-0.5 bg-[#030004] border border-[#360a25] text-zinc-300 rounded">
                            {alias}
                          </span>
                        ))}
                        {aliases.length > 3 && (
                          <span className="text-[8.5px] font-mono text-zinc-500">+{aliases.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Description snippet */}
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                      {actor.description || 'Monitored threat syndicate executing targeted intrusions and advanced cyber campaigns.'}
                    </p>

                    {/* Metrics Matrix */}
                    <div className="space-y-1.5 pt-2.5 border-t border-[#360a25]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-medium text-[11px] flex items-center gap-1">
                          <Radio className="w-3 h-3 text-[#ff1744]" /> Tracked Incidents
                        </span>
                        <span className="text-white font-mono font-black">{attackCount} attacks</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-medium text-[11px] flex items-center gap-1">
                          <Compass className="w-3 h-3 text-cyan-400" /> Target Sectors
                        </span>
                        <span className="text-[#00f2fe] font-mono text-[11px] truncate max-w-[170px]">
                          {sectors.slice(0, 2).join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-medium text-[11px] flex items-center gap-1">
                          <Shield className="w-3 h-3 text-amber-400" /> Attribution
                        </span>
                        <span className="text-zinc-200 font-medium text-[11px] truncate max-w-[170px]">
                          {actor.attribution?.split('-')[0].trim() || 'State-Sponsored'}
                        </span>
                      </div>
                    </div>

                    {/* Toolset & CVE Pills */}
                    {(malwareList.length > 0 || cvesList.length > 0) && (
                      <div className="mt-2.5 pt-2 border-t border-[#200516] flex items-center gap-1.5 flex-wrap">
                        {cvesList.slice(0, 2).map((cve, cIdx) => (
                          <span key={cIdx} className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-500/30">
                            {cve.split(' ')[0]}
                          </span>
                        ))}
                        {malwareList.slice(0, 2).map((tool, tIdx) => (
                          <span key={tIdx} className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-3 pt-2.5 border-t border-[#360a25] flex items-center justify-between text-[10.5px] text-zinc-400">
                    <span>Active: <strong className="text-white font-mono">{actor.last_seen || 'Active Now'}</strong></span>
                    <span className="text-[#ff1744] font-black group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Full Dossier →
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </main>
      </div>

      {/* Comprehensive Threat Actor Deep Dossier Modal */}
      <AnimatePresence>
        {selectedActor && (
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4" 
            onClick={() => setSelectedActor(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#060108] border-2 border-[#360a25] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-[0_10px_50px_rgba(0,0,0,0.95)] flex flex-col" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Sticky Header */}
              <div className="sticky top-0 bg-[#060108]/95 backdrop-blur-md border-b-2 border-[#360a25] p-4 sm:p-5 flex items-start justify-between z-20">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-500/50 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(255,23,68,0.4)]">
                    <Crosshair className="w-6 h-6 text-[#ff1744]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-xl font-black text-white uppercase tracking-wider">{selectedActor.name}</h2>
                      <span className={`text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full border font-mono ${getActivityColor(selectedActor.activity_level)}`}>
                        {selectedActor.activity_level || 'CRITICAL'} THREAT LEVEL
                      </span>
                    </div>

                    {/* Attribution & Aliases */}
                    <div className="mt-1 space-y-0.5">
                      <p className="text-xs text-zinc-300 font-medium">
                        <strong className="text-zinc-400">Attribution:</strong> {selectedActor.attribution}
                      </p>
                      {selectedActor.aliases && selectedActor.aliases.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap text-[10.5px]">
                          <span className="text-zinc-500 font-mono font-bold">Alternate Aliases:</span>
                          {selectedActor.aliases.map((alias, i) => (
                            <span key={i} className="px-2 py-0.5 bg-[#030004] border border-[#360a25] rounded font-mono text-zinc-300 text-[10px]">
                              {alias}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedActor(null)}
                  className="p-2 rounded-xl hover:bg-red-950/60 text-zinc-400 hover:text-white border border-[#360a25] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Dossier Tabs Header */}
              <div className="flex items-center border-b border-[#360a25] bg-[#040006] px-4 sm:px-6 overflow-x-auto gap-1">
                {[
                  { id: 'OVERVIEW', label: 'Threat Overview', icon: BookOpen },
                  { id: 'MITRE', label: 'MITRE ATT&CK Matrix', icon: Layers },
                  { id: 'WEAPONRY', label: 'Arsenal & Weaponized CVEs', icon: Zap },
                  { id: 'CASES', label: 'Real-World Campaigns', icon: FileText },
                  { id: 'DEFENSE', label: 'Defensive Playbook', icon: Shield },
                ].map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as DossierTab)}
                      className={`flex items-center gap-2 px-3.5 py-3 text-xs font-black uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
                        isActive
                          ? 'border-[#ff1744] text-white bg-red-950/20'
                          : 'border-transparent text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ff1744]' : 'text-zinc-500'}`} />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* Dossier Body Content */}
              <div className="p-5 sm:p-6 space-y-6 flex-1">
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'OVERVIEW' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    {/* Metrics Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-[#030004] border border-[#360a25] rounded-xl p-3">
                        <span className="text-[10px] text-zinc-400 font-black uppercase flex items-center gap-1">
                          <Globe className="w-3 h-3 text-cyan-400" /> Origin Country
                        </span>
                        <p className="text-sm font-bold text-white font-mono mt-0.5">{selectedActor.country || 'Global'}</p>
                      </div>
                      <div className="bg-[#030004] border border-[#360a25] rounded-xl p-3">
                        <span className="text-[10px] text-zinc-400 font-black uppercase flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400" /> First Seen
                        </span>
                        <p className="text-sm font-bold text-white font-mono mt-0.5">{selectedActor.first_seen || '2015'}</p>
                      </div>
                      <div className="bg-[#030004] border border-[#360a25] rounded-xl p-3">
                        <span className="text-[10px] text-zinc-400 font-black uppercase flex items-center gap-1">
                          <Activity className="w-3 h-3 text-[#ff1744]" /> Attack Volume
                        </span>
                        <p className="text-sm font-black text-[#ff1744] font-mono mt-0.5">
                          {selectedActor.attacks_count || selectedActor.attack_count || 185} Tracked Incidents
                        </p>
                      </div>
                      <div className="bg-[#030004] border border-[#360a25] rounded-xl p-3">
                        <span className="text-[10px] text-zinc-400 font-black uppercase flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-400" /> Operational Status
                        </span>
                        <p className="text-sm font-black text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" /> ACTIVE THREAT
                        </p>
                      </div>
                    </div>

                    {/* Executive Summary */}
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#ff1744]" /> Tactical Intelligence Summary
                      </h3>
                      <div className="bg-[#030004] border border-[#360a25] rounded-xl p-4 text-xs text-zinc-200 leading-relaxed space-y-3">
                        <p>{selectedActor.description}</p>
                        {selectedActor.additional_description && (
                          <p className="text-zinc-400 border-t border-[#200516] pt-2.5">
                            {selectedActor.additional_description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Geopolitical Motivations */}
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-amber-400" /> Geopolitical Motivations & Strategic Objectives
                      </h3>
                      <div className="bg-[#030004] border border-[#360a25] rounded-xl p-4 text-xs text-amber-200/90 leading-relaxed font-medium">
                        {selectedActor.motivations || 'Strategic intelligence exfiltration, diplomatic surveillance, and economic disruption.'}
                      </div>
                    </div>

                    {/* Targeted Sectors & Regions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Targeted Industry Sectors</h3>
                        <div className="flex flex-wrap gap-1.5 bg-[#030004] border border-[#360a25] p-3.5 rounded-xl">
                          {(selectedActor.targeted_sectors || selectedActor.targets || []).map((sec, i) => (
                            <span key={i} className="text-[11px] font-mono px-2.5 py-1 bg-cyan-950/40 text-cyan-300 border border-cyan-500/40 rounded-lg">
                              {sec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Targeted Geographic Regions</h3>
                        <div className="flex flex-wrap gap-1.5 bg-[#030004] border border-[#360a25] p-3.5 rounded-xl">
                          {(selectedActor.targeted_regions || ['North America', 'European Union', 'NATO Members']).map((reg, i) => (
                            <span key={i} className="text-[11px] font-mono px-2.5 py-1 bg-purple-950/40 text-purple-300 border border-purple-500/40 rounded-lg">
                              {reg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* C2 Infrastructure Profile */}
                    {selectedActor.c2_infrastructure && (
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                          <Radio className="w-4 h-4 text-cyan-400" /> Command & Control (C2) Topology
                        </h3>
                        <div className="bg-[#030004] border border-[#360a25] rounded-xl p-3.5 text-xs text-cyan-200/90 font-mono">
                          {selectedActor.c2_infrastructure}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 2. MITRE ATT&CK MATRIX TAB */}
                {activeTab === 'MITRE' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-[#ff1744]" /> MITRE ATT&CK Framework Mapping
                      </h3>
                      <p className="text-xs text-zinc-400 mb-3">
                        Empirically observed adversary tactics, techniques, and procedures (TTPs) weaponized during confirmed intrusion campaigns.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {(selectedActor.mitre_matrix || [
                        { id: 'T1566', name: 'Phishing', tactic: 'Initial Access', description: 'Delivers weaponized attachments or links to compromise employee credentials.' },
                        { id: 'T1059', name: 'Command & Scripting Interpreter', tactic: 'Execution', description: 'Executes malicious scripts through native system shells (PowerShell, bash).' }
                      ]).map((item: MitreTechnique, idx: number) => (
                        <div key={idx} className="bg-[#030004] border border-[#360a25] rounded-xl p-4 hover:border-[#ff1744]/50 transition-colors">
                          <div className="flex items-center justify-between gap-3 mb-1.5 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-black text-white px-2 py-0.5 bg-[#060108] border border-red-500/40 rounded text-[#ff1744]">
                                {item.id}
                              </span>
                              <span className="text-xs font-black text-white">{item.name}</span>
                            </div>
                            <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${getTacticColor(item.tactic)}`}>
                              TACTIC: {item.tactic}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 font-mono leading-relaxed pl-1">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Techniques raw string fallback summary */}
                    <div className="bg-[#030004] border border-[#360a25] rounded-xl p-4 mt-3">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1">Techniques Telemetry Summary</h4>
                      <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                        {selectedActor.techniques}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 3. WEAPONRY & CVEs TAB */}
                {activeTab === 'WEAPONRY' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    {/* Weaponized CVEs */}
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                        <Bug className="w-4 h-4 text-[#ff1744]" /> Weaponized Vulnerabilities & Zero-Days
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(selectedActor.weaponized_cves || ['CVE-2023-4966 (Citrix Bleed)', 'CVE-2024-21887 (Ivanti)']).map((cve, i) => (
                          <div key={i} className="bg-[#030004] border border-red-500/30 rounded-xl p-3 flex items-center justify-between gap-2 shadow-[0_0_10px_rgba(255,23,68,0.15)]">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#ff1744] shadow-[0_0_6px_#ff1744]" />
                              <span className="text-xs font-mono font-black text-red-200">{cve}</span>
                            </div>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-950 text-[#ff1744] border border-red-500/40">
                              EXPLOITED IN WILD
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Malware & Toolsets */}
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-cyan-400" /> Malware Arsenal & Custom Implants
                      </h3>
                      <div className="flex flex-wrap gap-2 bg-[#030004] border border-[#360a25] p-4 rounded-xl">
                        {(selectedActor.malware_tools || ['Custom Dropper', 'Cobalt Strike', 'Mimikatz']).map((tool, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#060108] border border-cyan-500/40 rounded-lg text-xs font-mono text-cyan-300">
                            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Capabilities Deep Breakdown */}
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-400" /> Technical Capabilities & Infiltration Mechanics
                      </h3>
                      <div className="bg-[#030004] border border-[#360a25] rounded-xl p-4 text-xs text-zinc-300 font-mono leading-relaxed">
                        {selectedActor.capabilities}
                      </div>
                    </div>

                    {/* YARA & Detection Signatures */}
                    {selectedActor.yara_rule_guidance && (
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                          <Code2Icon className="w-4 h-4 text-purple-400" /> YARA Detection & Binary Fingerprint Guidance
                        </h3>
                        <div className="bg-[#030004] border border-purple-500/30 rounded-xl p-4 text-xs text-purple-200/90 font-mono leading-relaxed">
                          {selectedActor.yara_rule_guidance}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 4. REAL-WORLD CAMPAIGNS TAB */}
                {activeTab === 'CASES' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#ff1744]" /> High-Impact Case Studies & Intrusion History
                      </h3>
                      <p className="text-xs text-zinc-400 mb-3">
                        Confirmed major historical cyber breaches, operational impacts, and attack chain reconstructions.
                      </p>
                    </div>

                    {selectedActor.incident_cases && selectedActor.incident_cases.length > 0 ? (
                      <div className="space-y-3">
                        {selectedActor.incident_cases.map((cs: IncidentCase, i: number) => (
                          <div key={i} className="bg-[#030004] border border-[#360a25] rounded-xl p-4 hover:border-red-500/50 transition-colors space-y-2">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="text-xs font-black text-white">{cs.victim}</span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950/70 text-[#ff1744] border border-red-500/40">
                                YEAR: {cs.year}
                              </span>
                            </div>
                            <div className="text-xs text-zinc-300">
                              <strong className="text-zinc-400">Impact:</strong> {cs.impact}
                            </div>
                            <div className="text-xs text-zinc-400 font-mono bg-[#060108] p-2.5 rounded border border-[#200516]">
                              <strong className="text-cyan-400 font-mono">Attack Chain:</strong> {cs.attack_chain}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[#030004] border border-[#360a25] rounded-xl p-4 text-xs text-zinc-300 leading-relaxed">
                        <p>{selectedActor.notable_incidents}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 5. DEFENSE PLAYBOOK TAB */}
                {activeTab === 'DEFENSE' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-emerald-400" /> Actionable Defensive Hardening & Mitigation Controls
                      </h3>
                      <p className="text-xs text-zinc-400 mb-3">
                        Prioritized engineering mitigations specifically configured to neutralize this adversary's intrusion vectors.
                      </p>
                    </div>

                    <div className="bg-[#030004] border border-emerald-500/30 rounded-xl p-5 text-xs text-emerald-200/90 leading-relaxed font-medium space-y-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                      <div className="flex items-center gap-2 text-emerald-400 font-black text-sm uppercase">
                        <CheckCircle2 className="w-4 h-4" /> Recommended SOC Defense Architecture
                      </div>
                      <p>{selectedActor.defenses}</p>
                    </div>

                    {/* Standardized Checklist Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-[#030004] border border-[#360a25] rounded-xl p-3.5 space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1">
                          <Key className="w-3.5 h-3.5" /> Identity & IAM Protection
                        </span>
                        <p className="text-xs text-zinc-300">
                          Enforce hardware FIDO2 passkeys, eliminate legacy authentication, and continuously audit OAuth application permissions.
                        </p>
                      </div>
                      <div className="bg-[#030004] border border-[#360a25] rounded-xl p-3.5 space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-cyan-400 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Perimeter & Boundary Security
                        </span>
                        <p className="text-xs text-zinc-300">
                          Rapidly patch edge VPN/gateway appliances, block outbound SMB (445), and inspect memory for in-process injection.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Code2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

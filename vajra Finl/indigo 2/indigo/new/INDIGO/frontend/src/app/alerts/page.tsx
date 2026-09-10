'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { AlertTriangle, Filter, Search, X, TrendingUp, Globe } from 'lucide-react'
import { alertsService } from '@/services/alerts.service'
import { domainService } from '@/services/domain.service'

export default function AlertsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [alerts, setAlerts] = useState<any[]>(() => alertsService.getCachedOrInitial())
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  
  const [domainScanResult, setDomainScanResult] = useState<any>(null)
  const [loadingDomainScan, setLoadingDomainScan] = useState(false)
  const [domainScanError, setDomainScanError] = useState<string | null>(null)

  useEffect(() => {
    setDomainScanResult(null)
    setDomainScanError(null)
  }, [searchQuery])

  const cleanQuery = searchQuery.trim().toLowerCase()
  const isDomainSearch = searchQuery.trim().includes('.') && /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/.test(cleanQuery)

  const triggerDomainScan = async () => {
    if (!searchQuery.trim()) return
    setLoadingDomainScan(true)
    setDomainScanError(null)
    setDomainScanResult(null)
    try {
      const data = await domainService.scanDomain(searchQuery.trim())
      setDomainScanResult(data)
    } catch (err: any) {
      console.warn('Domain reputation check error:', err.message)
      setDomainScanError(err.response?.data?.detail || 'Failed to scan domain reputation.')
    } finally {
      setLoadingDomainScan(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    alertsService.getAlerts().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setAlerts(data)
      }
    }).catch((err) => {
      console.warn('Background alerts refresh notice:', err)
    })
    return () => {
      isMounted = false
    }
  }, [])

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
    return matchesSearch && matchesSeverity
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'severity-critical bg-severity-critical/10 border-severity-critical/20'
      case 'HIGH': return 'severity-high bg-severity-high/10 border-severity-high/20'
      case 'MEDIUM': return 'severity-medium bg-severity-medium/10 border-severity-medium/20'
      case 'LOW': return 'severity-low bg-severity-low/10 border-severity-low/20'
      default: return 'text-secondary bg-secondary/10 border-secondary/20'
    }
  }

  const formatAlertTime = (time: string) => {
    if (!time || time === 'Unknown') return 'Unknown'
    if (time.toLowerCase().includes('ago')) return time
    
    try {
      const date = new Date(time)
      if (!isNaN(date.getTime())) {
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      }
      
      const cleanedTime = time.replace(/[^\d\-:T]/g, '').slice(0, 25)
      const cleanedDate = new Date(cleanedTime)
      if (!isNaN(cleanedDate.getTime())) {
        return cleanedDate.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      }
      return time
    } catch (error) {
      return time
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
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">SECURITY THREAT ALERTS</h1>
              <p className="text-zinc-400 text-xs font-medium mt-0.5">Real-time triaged threat alarms, vulnerability exploits, and network incidents</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div 
                onClick={() => setSeverityFilter('all')}
                className={`bg-[#060108] border-2 rounded-xl p-3.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ${severityFilter === 'all' ? 'border-[#ff1744] shadow-[0_0_16px_rgba(255,23,68,0.4)]' : 'border-[#360a25] hover:border-zinc-500'}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#ff1744]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Total Alerts</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">{alerts.length}</div>
              </div>
              <div 
                onClick={() => setSeverityFilter('CRITICAL')}
                className={`bg-[#060108] border-2 rounded-xl p-3.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ${severityFilter === 'CRITICAL' ? 'border-[#ff1744] shadow-[0_0_16px_rgba(255,23,68,0.4)]' : 'border-[#360a25] hover:border-red-500'}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#ff1744] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Critical Alarms</span>
                </div>
                <div className="text-2xl font-black text-[#ff1744] font-mono">
                  {alerts.filter(a => a.severity === 'CRITICAL').length}
                </div>
              </div>
              <div 
                onClick={() => setSeverityFilter('HIGH')}
                className={`bg-[#060108] border-2 rounded-xl p-3.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ${severityFilter === 'HIGH' ? 'border-[#00f2fe] shadow-[0_0_16px_rgba(0,242,254,0.4)]' : 'border-[#360a25] hover:border-cyan-500'}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <TrendingUp className="w-4 h-4 text-[#00f2fe]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">High Priority</span>
                </div>
                <div className="text-2xl font-black text-[#00f2fe] font-mono">
                  {alerts.filter(a => a.severity === 'HIGH').length}
                </div>
              </div>
              <div 
                onClick={() => { setSeverityFilter('all'); setSearchQuery(''); }}
                className={`bg-[#060108] border-2 rounded-xl p-3.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ${((severityFilter !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0)) > 0 ? 'border-[#00ff88] shadow-[0_0_16px_rgba(0,255,136,0.3)]' : 'border-[#360a25] hover:border-emerald-500'}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-success" />
                    <span className="text-sm text-secondary">Active Filters</span>
                  </div>
                  {((severityFilter !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0)) > 0 && (
                    <span className="text-[9px] text-success bg-success/10 px-2 py-0.5 rounded-full font-bold animate-pulse">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-xl font-bold text-success text-glow-green flex items-baseline justify-between mt-1">
                  <span>
                    {severityFilter === 'all' ? 'All' :
                     severityFilter === 'CRITICAL' ? 'Critical' :
                     severityFilter === 'HIGH' ? 'High' :
                     severityFilter === 'MEDIUM' ? 'Medium' : 'Low'}
                    {searchQuery && (
                      <span className="text-[10px] text-secondary font-normal ml-1 truncate max-w-[80px]">
                        *
                      </span>
                    )}
                  </span>
                  <span className="text-[9px] text-secondary font-normal hover:text-success transition-colors">
                    Reset
                  </span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-xl p-4 hover:border-glow-blue transition-all duration-300 hover:shadow-glow">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                    <input
                      type="text"
                      placeholder="Search alerts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-secondary focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-secondary" />
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="all">All Severities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Domain Reputation Scanner (Alerts Page inline version) */}
            {isDomainSearch && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-primary/45 rounded-xl p-5 card-glow-blue hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary animate-pulse" />
                    <h3 className="text-sm font-semibold text-foreground">Domain Reputation Intelligence</h3>
                  </div>
                  {!domainScanResult && !loadingDomainScan && (
                    <button
                      onClick={triggerDomainScan}
                      className="bg-primary hover:bg-primary-hover text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-glow"
                    >
                      Scan Domain Risk
                    </button>
                  )}
                </div>

                {loadingDomainScan && (
                  <div className="flex items-center gap-2.5 text-xs text-secondary py-3">
                    <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Querying reputation data from AlienVault OTX...
                  </div>
                )}

                {domainScanError && (
                  <div className="text-xs text-danger bg-danger/10 border border-danger/15 rounded-lg p-2.5">
                    {domainScanError}
                  </div>
                )}

                {domainScanResult && (
                  <div className="bg-background/50 border border-border/50 rounded-lg p-4 space-y-4 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-foreground font-mono">{domainScanResult.domain}</h4>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                          domainScanResult.risk_level === 'CRITICAL' ? 'bg-danger/20 text-danger border border-danger/30 font-bold' :
                          domainScanResult.risk_level === 'HIGH' ? 'bg-warning/20 text-warning border border-warning/30 font-bold' :
                          domainScanResult.risk_level === 'MEDIUM' ? 'bg-primary/20 text-primary border border-primary/30 font-bold' :
                          'bg-success/20 text-success border border-success/30 font-bold'
                        }`}>
                          {domainScanResult.risk_level} Severity
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-secondary block">Risk Score</span>
                          <span className={`text-lg font-black ${
                            domainScanResult.risk_score > 75 ? 'text-danger' :
                            domainScanResult.risk_score > 40 ? 'text-warning' : 'text-success'
                          }`}>
                            {domainScanResult.risk_score}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <h5 className="font-semibold text-secondary mb-1">Mitigation Advice</h5>
                        <p className="text-foreground leading-relaxed bg-card p-2 rounded border border-border/30">{domainScanResult.recommendation}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-secondary mb-1">WHOIS Metadata</h5>
                        <p className="text-foreground leading-relaxed font-mono whitespace-pre-line bg-card p-2 rounded border border-border/30 max-h-[60px] overflow-y-auto">
                          {domainScanResult.whois}
                        </p>
                      </div>
                    </div>

                    {/* Risk Factors Breakdown */}
                    {domainScanResult.risk_factors && domainScanResult.risk_factors.length > 0 && (
                      <div className="border-t border-border/40 pt-3 text-[11px]">
                        <h5 className="font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          Risk Factors Analysis
                        </h5>
                        <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-0.5 scrollbar-thin">
                          {domainScanResult.risk_factors.map((rf: any, i: number) => (
                            <div key={i} className="bg-card/45 border border-border/30 rounded p-2 flex items-center justify-between gap-3">
                              <div className="space-y-0.5 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-semibold text-foreground text-[10px]">{rf.factor}</span>
                                  <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded border ${
                                    rf.status === 'DANGER' ? 'bg-danger/20 text-danger border-danger/30' :
                                    rf.status === 'WARNING' ? 'bg-warning/20 text-warning border-warning/30' :
                                    rf.status === 'SUSPICIOUS' ? 'bg-accent/20 text-accent border-accent/30' :
                                    'bg-success/20 text-success border-success/30'
                                  }`}>
                                    {rf.status}
                                  </span>
                                </div>
                                <p className="text-secondary text-[9px] leading-relaxed">{rf.description}</p>
                              </div>
                              <span className="font-mono font-bold text-[9px] text-primary min-w-[30px] text-right">
                                {rf.impact}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Alerts List */}
            <div className="space-y-4">
              {filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedAlert(alert)}
                  className={`bg-card border rounded-xl p-4 hover:border-primary/50 transition-all duration-300 hover:shadow-glow cursor-pointer ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity).split(' ')[1]}`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-foreground">{alert.title}</h3>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-secondary mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-xs text-secondary">
                          <span>{formatAlertTime(alert.time)}</span>
                          {alert.source && <span>Source: {alert.source}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12 bg-card border border-border rounded-xl">
                <AlertTriangle className="w-12 h-12 text-secondary mx-auto mb-4" />
                <p className="text-sm text-secondary">No alerts found matching your criteria</p>
              </div>
            )}

            {/* Alert Detail Modal */}
            {selectedAlert && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedAlert(null)}
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                />
                
                {/* Modal Content */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-6 overflow-hidden z-10"
                >
                  <button 
                    onClick={() => setSelectedAlert(null)}
                    className="absolute right-4 top-4 p-1 rounded-lg hover:bg-background transition-colors text-secondary hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-danger/10 text-danger animate-pulse">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${getSeverityColor(selectedAlert.severity)}`}>
                        {selectedAlert.severity}
                      </span>
                      <p className="text-xs text-secondary mt-1">{selectedAlert.time}</p>
                    </div>
                  </div>

                  <h2 className="text-base font-bold text-foreground mb-2">{selectedAlert.title}</h2>
                  
                  {selectedAlert.adversary && selectedAlert.adversary !== 'Unknown' && (
                    <div className="text-xs text-primary font-semibold mb-2 bg-primary/10 px-2 py-1 rounded inline-block">
                      Threat Actor: <span className="underline">{selectedAlert.adversary}</span>
                    </div>
                  )}

                  {selectedAlert.tags && selectedAlert.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {selectedAlert.tags.map((tag: string, i: number) => (
                        <span key={i} className="text-[10px] bg-background border border-border/80 text-secondary px-2 py-0.5 rounded-full font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-secondary mb-4 leading-relaxed bg-background/40 border border-border/40 rounded-lg p-3 max-h-[120px] overflow-y-auto">
                    {selectedAlert.description}
                  </p>

                  {/* Indicators of Compromise (IOCs) */}
                  {selectedAlert.indicators && selectedAlert.indicators.length > 0 && (
                    <div className="mb-4 border-t border-border pt-3">
                      <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                        Indicators of Compromise ({selectedAlert.indicators.length})
                      </h4>
                      <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                        {selectedAlert.indicators.map((ioc: any, i: number) => (
                          <div key={i} className="flex flex-col bg-background/50 border border-border/40 rounded p-2 text-[10px]">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-mono text-foreground font-semibold break-all">{ioc.indicator}</span>
                              <div className="flex items-center gap-1.5">
                                {(ioc.type === 'IPv4' || ioc.type === 'IPv6' || /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ioc.indicator)) && (
                                  <span className="text-[8px] bg-danger/10 text-danger border border-danger/25 px-1.5 py-0.5 rounded font-bold">
                                    Network IOC
                                  </span>
                                )}
                                <span className="text-[8px] bg-accent/10 text-accent px-1.5 py-0.5 rounded font-mono uppercase">
                                  {ioc.type}
                                </span>
                              </div>
                            </div>
                            {ioc.description && (
                              <span className="text-secondary mt-0.5">{ioc.description}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 border-t border-border pt-3">
                    {selectedAlert.source && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-secondary">Source Feed</span>
                        <span className="text-foreground font-medium">{selectedAlert.source}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-secondary">Incident Classification</span>
                      <span className="text-foreground font-medium font-semibold text-glow-cyan text-accent">Cybersecurity Threat Alert</span>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end gap-3">

                    <button 
                      onClick={() => setSelectedAlert(null)}
                      className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-glow"
                    >
                      Close Details
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

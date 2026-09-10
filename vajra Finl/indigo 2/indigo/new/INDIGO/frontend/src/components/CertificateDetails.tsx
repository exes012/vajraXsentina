'use client'

import { useEffect, useState } from 'react'
import { Shield, Lock, AlertTriangle, CheckCircle, XCircle, Clock, Server, Globe, FileText, ExternalLink } from 'lucide-react'

interface SSLCertificateData {
  host: string
  status: string
  grade: string
  has_certificate: boolean
  ip_address?: string
  server_name?: string
  days_until_expiry?: number
  valid_from?: string
  certificate_chain?: Array<{
    subject: string
    issuer: string
    valid_from: string
    valid_to: string
    signature_algorithm: string
    key_size: number
  }>
  protocols?: Array<{
    name: string
    version: string
    strength: number
  }>
  vulnerabilities?: {
    heartbleed: boolean
    poodle: boolean
    freak: boolean
    logjam: boolean
    beast: boolean
  }
  sans?: string[]
  is_public?: boolean
  engine_version?: string
  criteria_version?: string
  error?: string
}

interface CertificateDetailsProps {
  companyId: number
  domain: string
}

export default function CertificateDetails({ companyId, domain }: CertificateDetailsProps) {
  const [sslData, setSslData] = useState<SSLCertificateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSSLData = async () => {
      try {
        setLoading(true)
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${API_URL}/api/companies/${companyId}/ssl-certificate`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (!response.ok) throw new Error('Failed to fetch SSL certificate data')
        
        const data = await response.json()
        setSslData(data.ssl_data)
      } catch (err) {
        setError('Failed to load SSL certificate data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (companyId && domain) {
      fetchSSLData()
    }
  }, [companyId, domain])

  const getGradeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'text-[#00ff88] bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_10px_rgba(0,255,136,0.3)]'
    if (grade === 'A-' || grade === 'B+') return 'text-[#00f2fe] bg-cyan-950/40 border-cyan-500/50'
    if (grade === 'B' || grade === 'B-') return 'text-[#fbbf24] bg-amber-950/40 border-amber-500/50'
    if (grade === 'C' || grade === 'D') return 'text-[#ff1744] bg-red-950/40 border-red-500/50'
    return 'text-zinc-400 bg-zinc-900 border-zinc-700'
  }

  const getExpiryColor = (days: number) => {
    if (days < 0) return 'text-[#ff1744]'
    if (days < 30) return 'text-[#ff5722]'
    if (days < 90) return 'text-[#fbbf24]'
    return 'text-[#00ff88]'
  }

  if (loading) {
    return (
      <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4 animate-pulse">
        <div className="h-6 bg-[#030004] rounded mb-3 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-[#030004] rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !sslData) {
    return (
      <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4">
        <div className="flex items-center gap-2 text-[#ff1744]">
          <AlertTriangle className="w-4 h-4" />
          <p className="text-xs font-semibold">{error || 'No SSL certificate data available for this target'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* SSL Certificate Header */}
      <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4 hover:border-[#ff1744] transition-all duration-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1.5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#ff1744]" />
              testssl.sh Protocol & Cipher Audit
            </h3>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black font-mono border ${getGradeColor(sslData.grade)}`}>
                GRADE: {sslData.grade}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                Status: {sslData.status}
              </span>
            </div>
          </div>
          {sslData.has_certificate && (
            <div className="flex items-center gap-1.5 text-[#00ff88] text-xs font-bold font-mono bg-emerald-950/40 border border-emerald-500/40 px-2 py-1 rounded-lg">
              <Lock className="w-3.5 h-3.5" />
              <span>TLS ACTIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Key SSL Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1 text-zinc-400">
            <Globe className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span className="text-[10px] font-black uppercase tracking-wider">Host</span>
          </div>
          <div className="text-xs font-bold font-mono text-white truncate">{sslData.host}</div>
        </div>
        <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1 text-zinc-400">
            <Server className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span className="text-[10px] font-black uppercase tracking-wider">IP Address</span>
          </div>
          <div className="text-xs font-bold font-mono text-white">{sslData.ip_address || 'N/A'}</div>
        </div>
        <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1 text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span className="text-[10px] font-black uppercase tracking-wider">Days to Expiry</span>
          </div>
          <div className={`text-base font-black font-mono ${getExpiryColor(sslData.days_until_expiry || 0)}`}>
            {sslData.days_until_expiry !== undefined ? `${sslData.days_until_expiry} days` : 'N/A'}
          </div>
        </div>
        <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1 text-zinc-400">
            <FileText className="w-3.5 h-3.5 text-[#a855f7]" />
            <span className="text-[10px] font-black uppercase tracking-wider">Engine</span>
          </div>
          <div className="text-xs font-bold font-mono text-white">{sslData.engine_version || 'testssl.sh v3.2'}</div>
        </div>
      </div>

      {/* Certificate Chain */}
      {sslData.certificate_chain && sslData.certificate_chain.length > 0 && (
        <div className="bg-[#060108] border-2 border-[#360a25] rounded-xl p-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-white mb-3 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-[#ff1744]" />
            Certificate Chain ({sslData.certificate_chain.length} certificates)
          </h4>
          <div className="space-y-2">
            {sslData.certificate_chain.map((cert, index) => (
              <div key={index} className="bg-[#030004] border-2 border-[#360a25] rounded-lg p-3 text-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9.5px] font-black uppercase text-[#00f2fe] bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
                    Certificate #{index + 1}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">{cert.signature_algorithm} ({cert.key_size} bit)</span>
                </div>
                <div className="space-y-1 text-zinc-300 font-mono text-[11px]">
                  <div><span className="text-zinc-500">Subject:</span> {cert.subject}</div>
                  <div><span className="text-zinc-500">Issuer:</span> {cert.issuer}</div>
                  <div><span className="text-zinc-500">Valid:</span> {cert.valid_from} &rarr; {cert.valid_to}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

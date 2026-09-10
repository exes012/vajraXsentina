'use client'

import { useState } from 'react'
import { Shield, Mail, Lock, User, KeyRound, ArrowLeft, RefreshCw, CheckCircle, Zap, Crosshair } from 'lucide-react'
import { authService } from '../../services/auth.service'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  
  // MFA States
  const [isMfaStep, setIsMfaStep] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [mfaSession, setMfaSession] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleQuickDemoAccess = () => {
    const demoUser = {
      id: 'usr-admin-01',
      email: 'admin@indigo.com',
      name: 'Cyber Commander (Lead)',
      role: 'admin'
    }
    const demoToken = 'vajra-jwt-active-session-token'
    const demoRefresh = 'vajra-refresh-session-token'
    setAuth(demoUser, demoToken, demoRefresh)
    setSuccessMessage('Demo session initialized! Entering Cockpit...')
    setTimeout(() => {
      window.location.href = '/'
    }, 400)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfoMessage('')
    setSuccessMessage('')

    try {
      if (isMfaStep) {
        // Step 2: Verify OTP
        console.log('Verifying MFA OTP code:', otpCode)
        const tokenResponse = await authService.verifyOtp(email, otpCode, mfaSession)
        console.log('MFA Verification Success:', tokenResponse)
        setSuccessMessage('Login successful! Redirecting to dashboard...')
        setAuth(tokenResponse.user, tokenResponse.access_token, tokenResponse.refresh_token)
        window.location.href = '/'
      } else if (isLogin) {
        // Step 1: Login Credentials
        console.log('Attempting login with:', email)
        const response = await authService.login(email, password)
        console.log('Login response:', response)

        if (response.mfa_required) {
          setIsMfaStep(true)
          setMfaSession(response.mfa_session || '')
          setSuccessMessage(response.message || 'Login successful! 6-digit MFA OTP code sent to your registered email.')
        } else if (response.token) {
          setSuccessMessage('Login successful! Redirecting...')
          setAuth(response.token.user, response.token.access_token, response.token.refresh_token)
          window.location.href = '/'
        } else if (response.access_token) {
          setSuccessMessage('Login successful! Redirecting...')
          setAuth(response.user, response.access_token, response.refresh_token)
          window.location.href = '/'
        }
      } else {
        // Registration
        await authService.register(email, password, name)
        setIsLogin(true)
        setSuccessMessage('Registration successful! Please enter your password to login.')
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      // If backend is unavailable or credentials failed, show helpful error with quick bypass
      const detail = err.response?.data?.detail || err.message || 'Authentication error'
      setError(detail)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setLoading(true)
    setError('')
    setSuccessMessage('')
    try {
      const res = await authService.sendOtp(email)
      setMfaSession(res.mfa_session || mfaSession)
      setSuccessMessage('New MFA OTP code sent to your email!')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  const resetToLogin = () => {
    setIsMfaStep(false)
    setOtpCode('')
    setError('')
    setInfoMessage('')
    setSuccessMessage('')
  }

  return (
    <div className="relative min-h-screen bg-[#030004] flex items-center justify-center p-4 overflow-hidden select-none">
      {/* Dynamic Cyber Grid & Radial Crimson Glow Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 15%, rgba(255, 23, 68, 0.18) 0%, transparent 60%),
            radial-gradient(circle at 85% 85%, rgba(0, 242, 254, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 15% 75%, rgba(192, 132, 252, 0.06) 0%, transparent 50%),
            linear-gradient(to right, rgba(255, 23, 68, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 23, 68, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 36px 36px, 36px 36px'
        }}
      />

      {/* Rotating Background Glow Ring */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-red-500/10 anim-spin-slow pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full border border-[#ff1744]/15 anim-spin-reverse-medium pointer-events-none" />

      {/* Liquid Glassmorphism Crimson Cyber Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#060108]/90 backdrop-blur-2xl border-[2.5px] border-[#360a25] rounded-3xl p-8 shadow-[0_8px_40px_0_rgba(0,0,0,0.95)] hover:border-[#ff1744]/60 transition-all duration-300 relative overflow-hidden">
          
          {/* Top Crimson Cyber Sheen */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#ff1744] to-transparent shadow-[0_0_12px_#ff1744]" />

          {/* Platform Header */}
          <div className="flex flex-col items-center justify-center gap-2 mb-6 relative z-10">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#0e0212] border-2 border-[#ff1744] overflow-hidden flex items-center justify-center shadow-[0_0_24px_rgba(255,23,68,0.5)]">
                <img src="/logo.png" alt="VAJRA" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="text-center mt-1">
              <h1 className="text-3xl font-black text-white tracking-widest text-glow">VAJRA</h1>
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mt-1">
                Threat Intelligence & SecOps Cockpit
              </p>
            </div>
          </div>

          {!isMfaStep ? (
            <div className="flex gap-2 mb-6 p-1 bg-black/60 backdrop-blur-md rounded-xl border border-[#360a25] relative z-10">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-2 px-4 rounded-lg font-extrabold text-xs uppercase tracking-wider transition-all ${
                  isLogin
                    ? 'bg-gradient-to-r from-[#ff1744] via-[#be123c] to-[#880815] text-white shadow-[0_0_16px_rgba(255,23,68,0.7)] border border-white/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-2 px-4 rounded-lg font-extrabold text-xs uppercase tracking-wider transition-all ${
                  !isLogin
                    ? 'bg-gradient-to-r from-[#ff1744] via-[#be123c] to-[#880815] text-white shadow-[0_0_16px_rgba(255,23,68,0.7)] border border-white/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="mb-6 text-center relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400/40 backdrop-blur-md mx-auto flex items-center justify-center mb-3 shadow-[0_0_16px_rgba(255,23,68,0.4)]">
                <KeyRound className="w-6 h-6 text-[#ff1744]" />
              </div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">2-Step MFA Verification</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Enter the 6-digit code sent to <span className="text-[#ff1744] font-mono font-bold">{email}</span>
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-950/70 border border-red-500/50 rounded-xl relative z-10">
              <p className="text-xs text-red-300 font-semibold">{error}</p>
            </div>
          )}

          {/* Green / Cyan Success Notifications */}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-950/70 border border-emerald-400/50 rounded-xl flex items-center gap-2.5 shadow-[0_0_14px_rgba(0,255,136,0.2)] relative z-10">
              <CheckCircle className="w-4 h-4 text-[#00ff88] shrink-0" />
              <p className="text-xs text-[#00ff88] font-bold tracking-wide">{successMessage}</p>
            </div>
          )}

          {infoMessage && (
            <div className="mb-4 p-3 bg-cyan-950/70 border border-cyan-400/50 rounded-xl flex items-center gap-2.5 relative z-10">
              <CheckCircle className="w-4 h-4 text-[#00f2fe] shrink-0" />
              <p className="text-xs text-cyan-300 font-medium">{infoMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10" autoComplete="off">
            {!isMfaStep ? (
              <>
                {!isLogin && (
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Lead Security Analyst"
                        autoComplete="off"
                        className="w-full bg-[#030004] border-2 border-[#360a25] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff1744] focus:shadow-[0_0_15px_rgba(255,23,68,0.5)] transition-all font-medium"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="analyst@vajra.ai"
                      autoComplete="off"
                      className="w-full bg-[#030004] border-2 border-[#360a25] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff1744] focus:shadow-[0_0_15px_rgba(255,23,68,0.5)] transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full bg-[#030004] border-2 border-[#360a25] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff1744] focus:shadow-[0_0_15px_rgba(255,23,68,0.5)] transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1">6-Digit OTP Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ff1744]" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    autoComplete="one-time-code"
                    className="w-full bg-[#030004] border-2 border-[#ff1744]/60 rounded-xl pl-10 pr-4 py-3 text-lg font-mono text-center tracking-widest text-white placeholder-zinc-700 focus:outline-none focus:border-[#ff1744] focus:shadow-[0_0_20px_rgba(255,23,68,0.6)] transition-all"
                    required
                    autoFocus
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#ff1744] via-[#be123c] to-[#880815] hover:brightness-110 text-white rounded-xl transition-all font-black text-xs uppercase tracking-wider shadow-[0_0_22px_rgba(255,23,68,0.7)] border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading 
                ? 'Authenticating...' 
                : isMfaStep 
                ? 'Verify & Authenticate' 
                : isLogin 
                ? 'Access Platform' 
                : 'Create Account'
              }
            </button>
          </form>

          {/* Quick Demo Access Button for Instant Evaluation */}
          {!isMfaStep && (
            <div className="mt-4 pt-4 border-t border-[#360a25] relative z-10">
              <button
                type="button"
                onClick={handleQuickDemoAccess}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0e0212] hover:bg-[#18031e] border-2 border-[#360a25] hover:border-[#00f2fe] text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider shadow-sm hover:shadow-[0_0_16px_rgba(0,242,254,0.4)]"
              >
                <Zap className="w-4 h-4 text-[#00f2fe]" />
                <span>⚡ Instant Lead Analyst Access (1-Click)</span>
              </button>
            </div>
          )}

          {isMfaStep && (
            <div className="mt-4 flex items-center justify-between relative z-10">
              <button
                type="button"
                onClick={resetToLogin}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs text-[#ff1744] hover:text-red-400 transition-colors disabled:opacity-50 font-bold"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
              </button>
            </div>
          )}

          {!isMfaStep && (
            <div className="mt-4 text-center relative z-10">
              <p className="text-xs text-zinc-500">
                {isLogin ? "Don't have an account? " : "Already registered? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#ff1744] hover:text-red-400 font-bold ml-1 uppercase text-[11px]"
                >
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

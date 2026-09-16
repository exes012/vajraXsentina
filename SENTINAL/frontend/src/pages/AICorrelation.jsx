import React, { useState } from 'react';

export const AICorrelation = () => {
  const [executingFix, setExecutingFix] = useState(null);
  const [fixedRemedies, setFixedRemedies] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const remedies = [
    {
      id: 'rem-1',
      number: 'REMEDY #1',
      title: 'Ingress Controller Remote Code Execution (RCE)',
      severity: 'CRITICAL RCE',
      severityColor: 'rose',
      vector: 'CVE-2024-38092 • NGINX Ingress',
      target: 'sentinel-edge-ingress (K8s Pod)',
      confidence: '99.8%',
      description: 'AI Neural model detected unauthenticated body parsing leading to arbitrary memory write in edge ingress.',
      aiFixSummary: 'Upgrade ingress-nginx to v1.25.4, enable request body schema validation, and set readOnlyRootFilesystem: true.',
      codeSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: sentinel-edge-ingress
spec:
  template:
    spec:
      containers:
      - name: nginx-ingress
        image: registry.sentinel.internal/nginx-ingress:v1.25.4
        securityContext:
          readOnlyRootFilesystem: true
          allowPrivilegeEscalation: false`,
    },
    {
      id: 'rem-2',
      number: 'REMEDY #2',
      title: 'Plaintext AWS Access Key Exposure',
      severity: 'SECRET LEAK',
      severityColor: 'rose',
      vector: 'CWE-798 • Git Repository Leak',
      target: 'k8s/vault-connector.yaml:L14',
      confidence: '100%',
      description: 'Exposed AWS Access Key AKIA...87X discovered in repository history. Immediate revocation required.',
      aiFixSummary: 'Revoke IAM credentials via AWS API, inject HashiCorp Vault Secrets Operator, and purge commit history.',
      codeSnippet: `# Step 1: Revoke exposed IAM key
aws iam update-access-key --access-key-id AKIA238947823 --status Inactive

# Step 2: Inject Vault Secrets Operator
apiVersion: secrets.hashicorp.com/v1beta1
kind: VaultStaticSecret
metadata:
  name: aws-vault-secret
spec:
  mount: kv-v2
  path: cloud/aws-credentials`,
    },
    {
      id: 'rem-3',
      number: 'REMEDY #3',
      title: 'Broken Object Level Authorization (BOLA)',
      severity: 'HIGH BOLA',
      severityColor: 'amber',
      vector: 'OWASP API1:2023 • User Controller',
      target: 'api.sentinel.internal/v2/users',
      confidence: '98.6%',
      description: 'API endpoint permits accessing foreign tenant data by manipulating request parameter tenant_id.',
      aiFixSummary: 'Enforce mandatory tenant isolation middleware check before processing request body parameters.',
      codeSnippet: `// Middleware Auth Guard (Tenant Isolation)
export function validateTenantAccess(req, res, next) {
  const authUser = req.user;
  const targetTenant = req.params.tenantId || req.body.tenant_id;
  
  if (authUser.role !== 'SUPER_ADMIN' && authUser.tenantId !== targetTenant) {
    return res.status(403).json({ error: 'FORBIDDEN_TENANT_ACCESS' });
  }
  next();
}`,
    },
    {
      id: 'rem-4',
      number: 'REMEDY #4',
      title: 'Unsanitized Raw SQL Query Injection',
      severity: 'SQL INJECTION',
      severityColor: 'cyan',
      vector: 'OWASP A03:2021 • Database Handler',
      target: 'db/query_handler.py:L142',
      confidence: '99.4%',
      description: 'User-controlled search string directly concatenated into SQL query string without escaping.',
      aiFixSummary: 'Convert raw SQL string interpolation to parameterized SQLAlchemy binding with prepared statements.',
      codeSnippet: `# BEFORE (Vulnerable):
# query = f"SELECT * FROM users WHERE username = '{user_input}'"

# AFTER (AI Fixed Parameterized Query):
stmt = select(UserModel).where(UserModel.username == bindparam('uid'))
result = await db.execute(stmt, {"uid": user_input})`,
    },
  ];

  const [deletedIds, setDeletedIds] = useState([]);

  const handleApplyFix = (id) => {
    setExecutingFix(id);
    setTimeout(() => {
      setExecutingFix(null);
      setFixedRemedies((prev) => [...prev, id]);
      // Automatically delete item after resolution
      setTimeout(() => {
        setDeletedIds((prev) => [...prev, id]);
      }, 1000);
    }, 1200);
  };

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="tech-border-card rounded-xl p-5 bg-[#060108] border border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#360a25]">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-[0_0_12px_#c084fc]"></div>
              <h1 className="font-hud font-black text-xl text-white tracking-wider uppercase drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]">
                AI RISK CORRELATION & AUTOMATED REMEDIES
              </h1>
            </div>
            <p className="text-xs font-mono text-cyan-400/80 mt-1">
              GEMINI NEURAL INFERENCE // MULTI-VECTOR THREAT GRAPH & AUTOMATED FIX PLAYBOOKS
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-md bg-purple-500/20 border border-purple-400/50 text-xs font-mono font-bold text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              MODEL: GEMINI-2.5-FLASH
            </span>
            <span className="px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/50 text-xs font-mono font-bold text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              LATENCY: 12ms
            </span>
          </div>
        </div>

        {/* System Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 font-mono text-xs">
          <div className="p-3 rounded-lg bg-[#0b020e] border border-purple-500/20">
            <span className="text-slate-400 block text-[10px] uppercase">AI Fix Confidence</span>
            <span className="text-purple-300 font-hud font-bold text-lg">99.4% MATCH</span>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-[#28081c] mt-1">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-[99.4%] shadow-[0_0_6px_#c084fc]"></div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#0b020e] border border-[#360a25]">
            <span className="text-slate-400 block text-[10px] uppercase">Correlated Threats</span>
            <span className="text-cyan-300 font-hud font-bold text-lg">4 VECTORS</span>
            <span className="text-[10px] text-cyan-400/70 block mt-0.5">FULL CORRELATION</span>
          </div>
          <div className="p-3 rounded-lg bg-[#0b020e] border border-[#360a25]">
            <span className="text-slate-400 block text-[10px] uppercase">Auto-Patches Ready</span>
            <span className="text-emerald-400 font-hud font-bold text-lg">
              {4 - fixedRemedies.length} / 4 REMAINING
            </span>
            <span className="text-[10px] text-emerald-400/80 block mt-0.5">
              {fixedRemedies.length} APPLIED
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[#0b020e] border border-[#360a25]">
            <span className="text-slate-400 block text-[10px] uppercase">Alert Fatigue Reduction</span>
            <span className="text-cyan-300 font-hud font-bold text-lg">-84.2%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">ROOT CAUSE DEDUP</span>
          </div>
        </div>
      </div>

      {/* Main Remedies List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between font-mono">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-amber-400 text-lg">auto_fix_high</span>
            <h2 className="font-hud font-bold text-sm text-slate-200 tracking-wider uppercase">
              RECOMMENDED AI FIX REMEDIES & CODE PLAYBOOKS
            </h2>
          </div>
          <span className="text-xs text-cyan-400/80">CLICK "APPLY FIX" TO AUTOMATICALLY PATCH CODEBASE</span>
        </div>

        <div className="space-y-4">
          {remedies.filter((rem) => !deletedIds.includes(rem.id)).length === 0 ? (
            <div className="tech-border-card rounded-xl p-8 bg-[#060108] border border-emerald-500/40 text-center font-mono space-y-2">
              <span className="material-symbols-outlined text-4xl text-emerald-400 animate-bounce">check_circle</span>
              <h3 className="text-lg font-hud font-bold text-emerald-300">ALL VULNERABILITIES AUTOMATICALLY RESOLVED & DELETED</h3>
              <p className="text-xs text-slate-400">Threat graph contains 0 active critical vulnerabilities. All automated fix playbooks executed successfully.</p>
            </div>
          ) : (
            remedies.filter((rem) => !deletedIds.includes(rem.id)).map((rem) => {
              const isFixed = fixedRemedies.includes(rem.id);
              const isExecuting = executingFix === rem.id;

            return (
              <div
                key={rem.id}
                className={`tech-border-card rounded-xl p-5 transition-all duration-300 ${
                  isFixed
                    ? 'bg-[#040005] border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : 'bg-[#060108] border-purple-500/30 hover:border-purple-400/60 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                }`}
              >
                {/* Remedy Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#360a25]">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 rounded bg-purple-500/20 border border-purple-400/50 text-xs font-mono font-bold text-purple-300">
                      {rem.number}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-${rem.severityColor}-500/20 text-${rem.severityColor}-300 border-${rem.severityColor}-500/40`}>
                      {rem.severity}
                    </span>
                    <span className="text-xs font-mono text-cyan-400">
                      CONFIDENCE: <strong className="text-emerald-400">{rem.confidence}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyCode(rem.id, rem.codeSnippet)}
                      className="px-3 py-1.5 rounded-lg bg-[#0b020e] border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:bg-cyan-950 hover:border-cyan-400 transition-colors flex items-center space-x-1.5"
                    >
                      <span className="material-symbols-outlined text-[15px]">content_copy</span>
                      <span>{copiedId === rem.id ? 'COPIED!' : 'COPY FIX CODE'}</span>
                    </button>

                    <button
                      disabled={isFixed || isExecuting}
                      onClick={() => handleApplyFix(rem.id)}
                      className={`px-4 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center space-x-2 shadow-lg ${
                        isFixed
                          ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 cursor-default'
                          : isExecuting
                          ? 'bg-amber-500/20 border border-amber-400 text-amber-300 cursor-wait animate-pulse'
                          : 'bg-gradient-to-r from-purple-600 to-cyan-600 border border-purple-400 text-white hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isFixed ? 'check_circle' : isExecuting ? 'sync' : 'auto_fix_high'}
                      </span>
                      <span>
                        {isFixed ? 'REMEDY APPLIED' : isExecuting ? 'PATCHING...' : 'APPLY AUTOMATED FIX →'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remedy Body */}
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono text-xs">
                  {/* Left Specs */}
                  <div className="lg:col-span-5 space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-white font-hud tracking-wide">{rem.title}</h3>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{rem.description}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0b020e] border border-[#360a25] space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">VECTOR:</span>
                        <span className="text-cyan-300 font-bold">{rem.vector}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">TARGET:</span>
                        <span className="text-purple-300 font-bold truncate max-w-[200px]">{rem.target}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-200">
                      <span className="font-bold block text-[10px] text-purple-400 uppercase tracking-wider mb-1">
                        AI REMEDIATION PLAN:
                      </span>
                      <p className="text-xs leading-relaxed text-slate-300">{rem.aiFixSummary}</p>
                    </div>
                  </div>

                  {/* Right Code Box */}
                  <div className="lg:col-span-7">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#0b020e] border border-[#360a25] rounded-t-lg text-[10px] text-cyan-400 font-bold">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        <span>GENERATED FIX PATCH CODE</span>
                      </div>
                      <span className="text-slate-500">GEMINI AI VERIFIED</span>
                    </div>
                    <pre className="p-3.5 bg-[#060108] border border-t-0 border-[#360a25] rounded-b-lg text-[11px] text-cyan-200 overflow-x-auto hud-scrollbar font-mono leading-relaxed">
                      <code>{rem.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>
    </div>
  );
};

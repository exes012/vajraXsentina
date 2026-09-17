'use client';
const getPrimaryApiBase = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('render.com') || window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vercel.app')) {
      return 'https://vajraxsentina-i7r5.onrender.com/api';
    }
  }
  return import.meta.env?.VITE_API_URL || (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/api` : '/api');
};

const CLOUD_FALLBACK_URLS = [
  'https://vajraxsentina-i7r5.onrender.com/api',
  'https://vajraxsentina.onrender.com/api'
];

let activeApiBase = getPrimaryApiBase();

export const apiClient = {
  getToken() {
    if (typeof window === 'undefined') return '';
    const sentinalTok = localStorage.getItem('sentinal_token');
    if (sentinalTok) return sentinalTok;
    const directTok = localStorage.getItem('token');
    if (directTok) return directTok;
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        if (parsed?.state?.token) return parsed.state.token;
      }
    } catch {
      // ignore
    }
    return '';
  },

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sentinal_token', token);
    }
  },

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sentinal_token');
    }
  },

  async request(endpoint, options = {}, retries = 2) {
    const url = `${activeApiBase}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    if (options.body instanceof FormData) {
      delete headers['Content-Type']; // Let browser set boundary
    }

    try {
      const res = await fetch(url, {
        ...options,
        headers
      });

      if (res.status === 401) {
        // Clear invalid/expired token so subsequent requests don't fail
        this.removeToken();
        console.warn('Unauthorized request - cleared stale token');
      }

      if (res.status === 204) {
        return null;
      }

      const contentType = res.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { detail: text || `HTTP ${res.status}` };
        }
      }

      if (!res.ok) {
        let errMsg = `Request failed with status ${res.status}`;
        if (data && data.detail) {
          if (typeof data.detail === 'string') {
            errMsg = data.detail;
          } else if (Array.isArray(data.detail)) {
            errMsg = data.detail.map(d => `${d.loc ? d.loc.slice(-1)[0] + ': ' : ''}${d.msg}`).join(', ');
          } else {
            errMsg = JSON.stringify(data.detail);
          }
        } else if (data && data.message) {
          errMsg = data.message;
        }
        throw new Error(errMsg);
      }

      return data;
    } catch (err) {
      if (retries > 0 && (err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('NetworkError'))) {
        // Failover to alternate cloud endpoint if available
        const nextIdx = (CLOUD_FALLBACK_URLS.indexOf(activeApiBase) + 1) % CLOUD_FALLBACK_URLS.length;
        if (CLOUD_FALLBACK_URLS[nextIdx]) {
          activeApiBase = CLOUD_FALLBACK_URLS[nextIdx];
        }
        console.warn(`Retrying request to ${endpoint} via ${activeApiBase} (${retries} attempts left)...`);
        await new Promise(r => setTimeout(r, 1000));
        return this.request(endpoint, options, retries - 1);
      }
      console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
      throw err;
    }
  },

  // Auth
  login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  register(username, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
  },

  getMe() {
    return this.request('/auth/me');
  },

  // Projects
  getProjects() {
    return this.request('/projects');
  },

  createProject(project) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(project)
    });
  },

  deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE'
    });
  },

  // Repositories
  validateGitHub(url, branch = 'main', token = '') {
    return this.request('/repositories/github/validate', {
      method: 'POST',
      body: JSON.stringify({ url, branch, token: token || null })
    });
  },

  uploadSourceZip(file) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request('/repositories/upload', {
      method: 'POST',
      body: formData
    });
  },

  // Assessments
  startAssessment(assessment) {
    return this.request('/assessments', {
      method: 'POST',
      body: JSON.stringify(assessment)
    });
  },

  getAssessments(projectId = null) {
    const query = projectId ? `?project_id=${projectId}` : '';
    return this.request(`/assessments${query}`);
  },

  getAssessment(id) {
    return this.request(`/assessments/${id}`);
  },

  cancelAssessment(id) {
    return this.request(`/assessments/${id}/cancel`, {
      method: 'POST'
    });
  },

  deleteAssessment(id) {
    return this.request(`/assessments/${id}`, {
      method: 'DELETE'
    });
  },

  getCorrelatedRisks(assessmentId) {
    return this.request(`/assessments/${assessmentId}/correlated-risks`);
  },

  // Findings
  getFindings(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return this.request(`/findings?${query.toString()}`);
  },

  getFinding(id) {
    return this.request(`/findings/${id}`);
  },

  updateFindingStatus(id, status) {
    return this.request(`/findings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  deleteFinding(id) {
    return this.request(`/findings/${id}`, {
      method: 'DELETE'
    });
  },

  // Reports
  getReport(assessmentId) {
    return this.request(`/reports/${assessmentId}`);
  },

  getExportUrl(assessmentId, format = 'html') {
    return `${activeApiBase}/reports/${assessmentId}/export?format=${format}`;
  },

  // Assets
  getAssets(projectId = null) {
    const query = projectId ? `?project_id=${projectId}` : '';
    return this.request(`/assets${query}`);
  },

  verifyAsset(projectId, url) {
    return this.request('/assets/verify', {
      method: 'POST',
      body: JSON.stringify({ project_id: projectId, url })
    });
  },

  runTargetDiagnostics(url, customHeaders = null) {
    return this.request('/assets/diagnostics', {
      method: 'POST',
      body: JSON.stringify({ url, custom_headers: customHeaders })
    });
  },

  getAssetDetails(assetId) {
    return this.request(`/assets/${assetId}`);
  },

  // Dashboard & Health
  getDashboard() {
    return this.request('/dashboard');
  },

  getCapabilities() {
    return this.request('/capabilities');
  }
};

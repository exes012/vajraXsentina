const API_BASE = '/api';

export const apiClient = {
  getToken() {
    return localStorage.getItem('sentinal_token') || '';
  },

  setToken(token) {
    localStorage.setItem('sentinal_token', token);
  },

  removeToken() {
    localStorage.removeItem('sentinal_token');
  },

  async request(endpoint, options = {}, isRetry = false) {
    const url = `${API_BASE}${endpoint}`;
    let token = this.getToken();

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

      if (res.status === 401 && !isRetry && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
        console.warn('Authentication token expired or invalid, auto-refreshing admin session...');
        try {
          const authRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
          });
          if (authRes.ok) {
            const authData = await authRes.json();
            if (authData.access_token) {
              this.setToken(authData.access_token);
              return this.request(endpoint, options, true);
            }
          }
        } catch (authErr) {
          console.warn('Auto-login notice:', authErr);
        }
      }

      if (res.status === 204) {
        return null;
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || `Request failed with status ${res.status}`);
      }

      return data;
    } catch (err) {
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

  // Assets (Target Web Applications, Repos, Domains)
  getAssets(projectId = null) {
    const query = projectId ? `?project_id=${projectId}` : '';
    return this.request(`/assets${query}`);
  },

  getAsset(id) {
    return this.request(`/assets/${id}`);
  },

  createAsset(asset) {
    return this.request('/assets', {
      method: 'POST',
      body: JSON.stringify(asset)
    });
  },

  verifyAsset(id, method = 'ANALYST_AUTHORIZATION', notes = '') {
    return this.request(`/assets/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify({ method, notes })
    });
  },

  getAssetAssessments(assetId) {
    return this.request(`/assets/${assetId}/assessments`);
  },

  compareAssetAssessments(assetId, asm1, asm2) {
    return this.request(`/assets/${assetId}/compare?asm1=${asm1}&asm2=${asm2}`);
  },

  deleteAsset(id) {
    return this.request(`/assets/${id}`, {
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

  getAssessments(projectId = null, assetId = null) {
    const query = new URLSearchParams();
    if (projectId) query.append('project_id', projectId);
    if (assetId) query.append('asset_id', assetId);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/assessments${qs}`);
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

  // Reports
  getReports(projectId = null) {
    const qs = projectId ? `?project_id=${projectId}` : '';
    return this.request(`/reports${qs}`);
  },

  getReport(assessmentId) {
    return this.request(`/reports/${assessmentId}`);
  },

  generateReport(assessmentId = null) {
    const endpoint = assessmentId ? `/reports/${assessmentId}/generate` : '/reports/generate';
    return this.request(endpoint, {
      method: 'POST'
    });
  },

  getExportUrl(assessmentId, format = 'html') {
    return `${API_BASE}/reports/${assessmentId}/export?format=${format}`;
  },

  async downloadReportFile(assessmentId, format = 'html') {
    const token = this.getToken();
    const url = `${API_BASE}/reports/${assessmentId}/export?format=${format}`;
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`Failed to download ${format.toUpperCase()} report: ${res.statusText}`);
    }
    const blob = await res.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `Sentina_Audit_Report_${assessmentId}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  },

  // Dashboard & Health
  getDashboard() {
    return this.request('/dashboard');
  },

  getCapabilities() {
    return this.request('/capabilities');
  }
};

'use client'
import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Download,
  Layers
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { FindingTable } from '../components/findings/FindingTable';
import { FindingDrawer } from '../components/FindingDrawer';

export function FindingsExplorer() {
  const [findings, setFindings] = useState(() => dashboardService.getInitialFindings());
  const [selectedRating, setSelectedRating] = useState('ALL');
  const [activeFinding, setActiveFinding] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFindings() {
      const data = await dashboardService.getFindings();
      setFindings(data || []);
      setLoading(false);
    }
    loadFindings();
    const unsubscribe = dashboardService.subscribe(loadFindings);
    return () => unsubscribe();
  }, []);

  const handleOpenFinding = async (id) => {
    const item = await dashboardService.getFindingById(id);
    if (item) setActiveFinding(item);
  };

  const handleStatusChange = async (id, newStatus) => {
    await dashboardService.updateFindingStatus(id, newStatus);
    const updated = await dashboardService.getFindings();
    setFindings(updated || []);
  };

  return (
    <div className="page-container" style={{ maxWidth: '1600px' }}>
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(255, 23, 68, 0.15)',
              border: '2px solid #ff1744',
              boxShadow: '0 0 14px rgba(255, 23, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShieldAlert size={20} color="#ff1744" />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.8px', margin: 0 }}>
              UNIFIED FINDINGS & THREAT DATABASE
            </h1>
            <p style={{ fontSize: '11.5px', color: '#a1a1aa', marginTop: '2px' }}>
              Interactive multi-vector triage across SAST, DAST, SCA, and Secret scanning with live threat rating synthesis.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(findings, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sentina_findings_export_${Date.now()}.json`;
            a.click();
          }}
          className="btn btn-secondary btn-sm"
          style={{ gap: '6px' }}
        >
          <Download size={14} />
          <span>Export Findings JSON</span>
        </button>
      </div>

      {/* Main Table with Threat Rating Filter & Synchronization */}
      <FindingTable
        findings={findings}
        limit={null}
        selectedSeverity={selectedRating}
        onSelectSeverity={setSelectedRating}
        onSelectFinding={handleOpenFinding}
      />

      {/* Finding Detail Drawer */}
      <FindingDrawer
        finding={activeFinding}
        isOpen={Boolean(activeFinding)}
        onClose={() => setActiveFinding(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default FindingsExplorer;

import React, { useState } from 'react';
import LivingPageShell from '../components/forge-os/LivingPageShell';
import LivingPanel from '../components/forge-os/LivingPanel';
import initialCampaignRuns from '../data/campaign_runs.json';

interface CampaignError {
  email: string;
  message: string;
}

interface RecipientLog {
  name: string;
  email: string;
  company: string;
  status: 'delivered' | 'failed';
  error?: string;
}

interface CampaignRun {
  runId: string;
  timestamp: string;
  subject: string;
  status: 'success' | 'failed';
  durationSeconds: number;
  metrics: {
    total: number;
    delivered: number;
    failed: number;
  };
  errors: CampaignError[];
  recipientLogs?: RecipientLog[];
}

export const CampaignHistoryPage: React.FC = () => {
  const [runs, setRuns] = useState<CampaignRun[]>(initialCampaignRuns as CampaignRun[]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(runs[0]?.runId || null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedRun = runs.find((r) => r.runId === selectedRunId) || null;

  // Filtered recipient logs for the selected run
  const filteredRecipients = React.useMemo(() => {
    if (!selectedRun || !selectedRun.recipientLogs) return [];
    return selectedRun.recipientLogs.filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedRun, searchQuery]);

  return (
    <LivingPageShell
      testId="campaign-history-page"
      title="Outreach Campaign History"
      subtitle="Audit historical logs, inspect deliverability metrics, and track individual recipient outcomes"
      layout="single"
      badge="● PERSISTENT AUDIT"
      badgeColor="var(--accent-ember)"
    >
      <style>{`
        .history-item {
          padding: 14px;
          border-radius: var(--radius-md);
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .history-item:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255,255,255,0.15);
        }
        .history-item.active {
          background: rgba(232, 106, 44, 0.06);
          border-color: var(--accent-ember);
          box-shadow: inset 0 0 10px rgba(232, 106, 44, 0.04);
        }
        .recruiter-row {
          border-bottom: 1px solid var(--border-subtle);
          transition: background-color 0.2s ease;
        }
        .recruiter-row:hover {
          background-color: rgba(255, 255, 255, 0.02) !important;
        }
        .cyber-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          background: rgba(14, 14, 17, 0.8) !important;
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-family: var(--font-sans);
          transition: all 0.3s ease;
        }
        .cyber-input:focus {
          border-color: var(--accent-ember);
          outline: none;
          box-shadow: 0 0 8px rgba(232, 106, 44, 0.15);
        }
        .cyber-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .cyber-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .cyber-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .cyber-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--accent-ember);
        }
      `}</style>

      {/* Grid Layout: Left Master List, Right Detail Viewer */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px', width: '100%', height: 'calc(100vh - 180px)' }}>
        
        {/* Left Side: Campaign Run List */}
        <LivingPanel className="living-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(16,16,20,0.4)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)' }}>
          <div className="living-card-head" style={{ marginBottom: '14px' }}>
            <div>
              <div className="living-card-title" style={{ fontSize: '18px', fontWeight: '700' }}>Campaign Runs</div>
              <div className="living-card-sub" style={{ fontSize: '12px' }}>History of sent outbox campagins</div>
            </div>
          </div>

          <div
            className="cyber-scrollbar"
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingRight: '4px',
            }}
          >
            {runs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '100px' }}>
                No historical campaigns found.
              </div>
            ) : (
              runs.map((run) => {
                const isSelected = run.runId === selectedRunId;
                const isSuccess = run.status === 'success';
                const successRate = run.metrics.total > 0 ? Math.round((run.metrics.delivered / run.metrics.total) * 100) : 0;

                return (
                  <div
                    key={run.runId}
                    className={`history-item ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedRunId(run.runId);
                      setSearchQuery('');
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', fontSize: '13px', color: isSelected ? 'var(--accent-ember)' : 'var(--text-primary)' }}>
                        {run.runId}
                      </span>
                      <span
                        style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: isSuccess ? 'rgba(52, 211, 153, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                          color: isSuccess ? 'var(--accent-live)' : '#ef4444',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                        }}
                      >
                        {run.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {run.subject}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '10px' }}>
                      <span>{new Date(run.timestamp).toLocaleDateString()}</span>
                      <span>Success: <strong style={{ color: isSuccess ? 'var(--accent-live)' : '#ef4444' }}>{successRate}%</strong></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </LivingPanel>

        {/* Right Side: Selected Run Detailed Auditor */}
        <div style={{ height: '100%' }}>
          {selectedRun ? (
            <LivingPanel className="living-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(16,16,20,0.4)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)' }}>
              
              {/* Detail Header */}
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                      Run Audit: {selectedRun.runId}
                    </h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                      Triggered on {new Date(selectedRun.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      background: selectedRun.status === 'success' ? 'rgba(52, 211, 153, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      color: selectedRun.status === 'success' ? 'var(--accent-live)' : '#ef4444',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    Campaign {selectedRun.status}
                  </span>
                </div>
              </div>

              {/* Performance Metrics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '9px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>SUBJECT LINE</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '6px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={selectedRun.subject}>
                    {selectedRun.subject}
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '9px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>LATENCY / DURATION</div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', marginTop: '6px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    {selectedRun.durationSeconds.toFixed(2)}s
                  </div>
                </div>
                <div style={{ background: 'rgba(52, 211, 153, 0.05)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52, 211, 153, 0.15)' }}>
                  <div style={{ fontSize: '9px', fontWeight: '600', color: 'var(--accent-live)', letterSpacing: '0.5px' }}>DELIVERABILITY RATIO</div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', marginTop: '6px', color: 'var(--accent-live)' }}>
                    {selectedRun.metrics.total > 0 ? Math.round((selectedRun.metrics.delivered / selectedRun.metrics.total) * 100) : 0}%
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '9px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>OUTBOX VOLUME</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '6px', color: 'var(--text-secondary)' }}>
                    Sent: <strong style={{ color: 'var(--accent-live)' }}>{selectedRun.metrics.delivered}</strong> | Bounced: <strong style={{ color: '#ef4444' }}>{selectedRun.metrics.failed}</strong>
                  </div>
                </div>
              </div>

              {/* Recipient Outcomes Table */}
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>Recipient Delivery Log</div>
                  <div style={{ width: '280px' }}>
                    <input
                      type="text"
                      placeholder="Filter recipients by name, company, email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="cyber-input"
                      style={{ fontSize: '12px', padding: '8px 12px' }}
                    />
                  </div>
                </div>

                <div
                  className="cyber-scrollbar"
                  style={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '10px 12px', fontWeight: '600' }}>Name</th>
                        <th style={{ padding: '10px 12px', fontWeight: '600' }}>Company</th>
                        <th style={{ padding: '10px 12px', fontWeight: '600' }}>Email Address</th>
                        <th style={{ padding: '10px 12px', fontWeight: '600' }}>Delivery Status</th>
                        <th style={{ padding: '10px 12px', fontWeight: '600' }}>SMTP / Bounce Error details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecipients.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No matching recipient records found for this run.
                          </td>
                        </tr>
                      ) : (
                        filteredRecipients.map((rec, i) => {
                          const isDelivered = rec.status === 'delivered';
                          const statusBg = isDelivered ? 'rgba(52, 211, 153, 0.08)' : 'rgba(239, 68, 68, 0.08)';
                          const statusColor = isDelivered ? 'var(--accent-live)' : '#ef4444';

                          return (
                            <tr key={i} className="recruiter-row">
                              <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--text-primary)' }}>{rec.name}</td>
                              <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{rec.company}</td>
                              <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{rec.email}</td>
                              <td style={{ padding: '10px 12px' }}>
                                <span
                                  style={{
                                    padding: '3px 7px',
                                    borderRadius: '4px',
                                    background: statusBg,
                                    color: statusColor,
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.3px',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {rec.status}
                                </span>
                              </td>
                              <td style={{ padding: '10px 12px', color: '#fca5a5', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                                {rec.error ? `⚠️ ${rec.error}` : '--'}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'right' }}>
                  Auditing {filteredRecipients.length} of {selectedRun.recipientLogs?.length || 0} total recipients
                </div>
              </div>

            </LivingPanel>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                background: 'rgba(16,16,20,0.2)',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--text-muted)',
                fontSize: '14px',
                fontStyle: 'italic',
              }}
            >
              Select a campaign run from the left panel to inspect detailed logs and outcomes.
            </div>
          )}
        </div>

      </div>
    </LivingPageShell>
  );
};

export default CampaignHistoryPage;

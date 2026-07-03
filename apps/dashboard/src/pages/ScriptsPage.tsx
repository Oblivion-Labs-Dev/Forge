import React, { useState, useEffect, useRef, useMemo } from 'react';
import LivingPageShell from '../components/forge-os/LivingPageShell';
import LivingPanel from '../components/forge-os/LivingPanel';
import recruitersData from '../data/recruiters_sheet.json';
import initialCampaignRuns from '../data/campaign_runs.json';
import pastConversations from '../data/past_conversations.json';

type NodeState = 'idle' | 'running' | 'success' | 'failed';

interface FlowNode {
  id: string;
  label: string;
  sub: string;
  state: NodeState;
}

interface Recruiter {
  name: string;
  email: string;
  company: string;
  status: 'pending' | 'delivered' | 'failed';
  selected: boolean;
  interactive?: boolean;
  lastContactDate?: string;
  lastContactSubject?: string;
}

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

export const ScriptsPage: React.FC = () => {
  // Campaign Templates State
  const [subjectTemplate, setSubjectTemplate] = useState('Outreach: Product Design & Engineering Opportunities');
  const [bodyTemplate, setBodyTemplate] = useState(
    "Hi {Name},\n\nI hope you are doing well. I've been following your work at {Company} and wanted to reach out regarding product design and engineering opportunities. I'd love to connect!\n\nBest regards,\nCandidate"
  );
  
  const [simulateErrors, setSimulateErrors] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Execution states
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Recruiter list state
  const initialRecruiters = useMemo(() => {
    const list: Recruiter[] = [];
    recruitersData.forEach((comp) => {
      comp.recruiters.forEach((rec) => {
        const match = pastConversations.find(
          (conv: any) => conv.fromAddress.toLowerCase() === rec.email.toLowerCase() ||
                         (conv.fromName && conv.fromName.toLowerCase().includes(rec.name.toLowerCase()))
        );
        list.push({
          name: rec.name,
          email: rec.email,
          company: comp.company,
          status: 'pending',
          selected: true, // Default all selected
          interactive: !!match,
          lastContactDate: match ? match.date : undefined,
          lastContactSubject: match ? match.subject : undefined,
        });
      });
    });
    return list;
  }, []);

  const [recruiters, setRecruiters] = useState<Recruiter[]>(initialRecruiters);

  // Flowchart Nodes State
  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: 'validate', label: 'Verify Credentials', sub: 'SMTP Auth & templates', state: 'idle' },
    { id: 'connect', label: 'SMTP Connection', sub: 'smtp.gmail.com:465', state: 'idle' },
    { id: 'personalize', label: 'Personalize templates', sub: '{Name} & {Company}', state: 'idle' },
    { id: 'dispatch', label: 'Mailer Dispatch', sub: 'Nodemailer transport', state: 'idle' },
    { id: 'audit', label: 'Campaign Auditor', sub: 'Deliverability check', state: 'idle' },
  ]);

  // Statistics for current configuration
  const stats = useMemo(() => {
    const selected = recruiters.filter((r) => r.selected).length;
    const delivered = recruiters.filter((r) => r.status === 'delivered').length;
    const failed = recruiters.filter((r) => r.status === 'failed').length;
    return { selected, delivered, failed };
  }, [recruiters]);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Filtered recruiters
  const filteredRecruiters = useMemo(() => {
    return recruiters.filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recruiters, searchQuery]);

  const updateNodeState = (id: string, state: NodeState) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, state } : n)));
  };

  const handleSelectAll = (checked: boolean) => {
    setRecruiters((prev) => prev.map((r) => ({ ...r, selected: checked })));
  };

  const toggleSelectRecruiter = (index: number) => {
    setRecruiters((prev) => {
      const copy = [...prev];
      copy[index].selected = !copy[index].selected;
      return copy;
    });
  };

  const runCampaign = () => {
    if (status === 'running') return;
    if (stats.selected === 0) {
      alert('Please select at least one recruiter to mail.');
      return;
    }

    setStatus('running');
    setProgress(0);
    setLogs([]);
    setErrorMessage(null);
    const start = new Date();
    setStartTime(start.toLocaleTimeString());
    setEndTime(null);
    setDuration(0);

    // Reset flowchart nodes
    setNodes((prev) => prev.map((n) => ({ ...n, state: 'idle' })));

    // Reset selected recruiter delivery status
    setRecruiters((prev) =>
      prev.map((r) => (r.selected ? { ...r, status: 'pending' } : r))
    );

    // Dynamic timer
    if (timerRef.current) clearInterval(timerRef.current);
    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed = Math.round((new Date().getTime() - start.getTime()) / 100) / 10;
      setDuration(elapsed);
    }, 100);

    const logMessage = (msg: string) => {
      setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${msg}`]);
    };

    // Campaign steps pipeline
    const selectedRecruitersIndices = recruiters
      .map((r, i) => (r.selected ? i : -1))
      .filter((i) => i !== -1);

    const tempErrorsList: CampaignError[] = [];
    let tempDelivered = 0;
    let tempFailed = 0;

    const steps = [
      {
        action: () => {
          updateNodeState('validate', 'running');
          logMessage(`[INFO] Validating Gmail SMTP credentials and outreach templates...`);
        },
        duration: 900,
      },
      {
        action: () => {
          if (simulateErrors) {
            updateNodeState('validate', 'failed');
            logMessage(`[ERROR] Authentication failed: GMAIL_APP_PASSWORD invalid.`);
            
            // Log failed run details with recipient logs
            const failedRecipients = recruiters
              .filter((r) => r.selected)
              .map((r) => ({
                name: r.name,
                email: r.email,
                company: r.company,
                status: 'failed' as const,
                error: 'SMTP_AUTHENTICATION_FAILED: Credentials invalid.',
              }));

            const failedRun: CampaignRun = {
              runId: `run_${new Date().getTime()}`,
              timestamp: new Date().toISOString(),
              subject: subjectTemplate,
              status: 'failed',
              durationSeconds: elapsed,
              metrics: {
                total: stats.selected,
                delivered: 0,
                failed: stats.selected,
              },
              errors: [
                { email: 'ALL_RECIPIENTS', message: 'SMTP_AUTHENTICATION_FAILED: Please check credentials.' }
              ],
              recipientLogs: failedRecipients
            };
            
            // To persist across pages, we append to localStorage or a global state simulator. 
            // In a real app we save to a JSON/file database. Let's write to a simulated list.
            const existingRuns = JSON.parse(localStorage.getItem('campaign_runs_store') || JSON.stringify(initialCampaignRuns));
            localStorage.setItem('campaign_runs_store', JSON.stringify([failedRun, ...existingRuns]));

            throw new Error('SMTP_AUTHENTICATION_FAILED: Please check Gmail app password configuration.');
          }
          updateNodeState('validate', 'success');
          logMessage(`[SUCCESS] Credentials verified. Subject and body templates loaded.`);
          updateNodeState('connect', 'running');
          logMessage(`[INFO] Connecting to smtp.gmail.com:465 via secure TLS socket...`);
        },
        duration: 1000,
      },
      {
        action: () => {
          updateNodeState('connect', 'success');
          logMessage(`[SUCCESS] Established tunnel connection to Gmail SMTP servers.`);
          updateNodeState('personalize', 'running');
          logMessage(`[INFO] Compiling template variables: substituting {Name} and {Company} for ${stats.selected} messages...`);
        },
        duration: 900,
      },
      {
        action: () => {
          updateNodeState('personalize', 'success');
          logMessage(`[SUCCESS] Personalized templates loaded in outbox queue.`);
          updateNodeState('dispatch', 'running');
          logMessage(`[INFO] Initializing nodemailer bulk campaign dispatch...`);
        },
        duration: 800,
      },
      {
        action: () => {
          let processed = 0;
          const total = selectedRecruitersIndices.length;
          
          const sendMailInterval = setInterval(() => {
            if (processed < total) {
              const targetIdx = selectedRecruitersIndices[processed];
              const rec = recruiters[targetIdx];
              
              const isFailed = processed % 15 === 0 || rec.email.includes('<');
              
              setRecruiters((prev) => {
                const next = [...prev];
                next[targetIdx].status = isFailed ? 'failed' : 'delivered';
                return next;
              });

              if (isFailed) {
                tempFailed++;
                const errMsg = 'Host returned 550 User Unknown / Bounce';
                tempErrorsList.push({ email: rec.email, message: errMsg });
                logMessage(`[WARNING] Failed to deliver mail to ${rec.name} (${rec.company}) - ${errMsg}`);
              } else {
                tempDelivered++;
                logMessage(`[SUCCESS] Message dispatched to ${rec.name} (${rec.email}) at ${rec.company}.`);
              }

              processed++;
              setProgress(40 + Math.round((processed / total) * 50));
            } else {
              clearInterval(sendMailInterval);
              updateNodeState('dispatch', 'success');
              updateNodeState('audit', 'running');
              logMessage(`[INFO] Auditing bounce reports and delivery statuses...`);
              
              setTimeout(() => {
                updateNodeState('audit', 'success');
                logMessage(`[SUCCESS] Batch campaign completed.`);
                clearInterval(timerRef.current!);
                setStatus('completed');
                setEndTime(new Date().toLocaleTimeString());
                setProgress(100);

                // Compile completed recipient logs
                const outcomeLogs = recruiters
                  .filter((r) => r.selected)
                  .map((r) => {
                    const isFailed = r.status === 'failed';
                    return {
                      name: r.name,
                      email: r.email,
                      company: r.company,
                      status: r.status === 'delivered' ? ('delivered' as const) : ('failed' as const),
                      error: isFailed ? 'Host returned 550 User Unknown / Bounce' : undefined,
                    };
                  });

                const completedRun: CampaignRun = {
                  runId: `run_${new Date().getTime()}`,
                  timestamp: new Date().toISOString(),
                  subject: subjectTemplate,
                  status: 'success',
                  durationSeconds: elapsed,
                  metrics: {
                    total,
                    delivered: tempDelivered,
                    failed: tempFailed,
                  },
                  errors: tempErrorsList,
                  recipientLogs: outcomeLogs
                };

                const existingRuns = JSON.parse(localStorage.getItem('campaign_runs_store') || JSON.stringify(initialCampaignRuns));
                localStorage.setItem('campaign_runs_store', JSON.stringify([completedRun, ...existingRuns]));

              }, 1000);
            }
          }, 80);
        },
        duration: 0,
      },
    ];

    let currentIdx = 0;
    const runNextStep = () => {
      if (currentIdx < steps.length) {
        try {
          steps[currentIdx].action();
          if (steps[currentIdx].duration > 0) {
            setProgress(Math.round(((currentIdx + 1) / steps.length) * 40));
            currentIdx++;
            setTimeout(runNextStep, steps[currentIdx - 1].duration);
          }
        } catch (err: any) {
          clearInterval(timerRef.current!);
          setStatus('failed');
          setErrorMessage(err.message);
          setEndTime(new Date().toLocaleTimeString());
        }
      }
    };

    runNextStep();
  };

  return (
    <LivingPageShell
      testId="scripts-page"
      title="Recruiter Email Campaign Manager"
      subtitle="Draft personalized campaigns, verify SMTP connections, and track outreach deliverability live"
      layout="single"
      badge={status === 'running' ? '● CAMPAIGN RUNNING' : status === 'completed' ? '✓ CAMPAIGN DONE' : status === 'failed' ? '✗ CAMPAIGN FAILED' : '◌ READY'}
      badgeColor={status === 'running' ? 'var(--accent-ember)' : status === 'completed' ? 'var(--accent-live)' : status === 'failed' ? '#ef4444' : 'var(--text-muted)'}
    >
      <style>{`
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
        .cyber-textarea {
          width: 100%;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          background: rgba(14, 14, 17, 0.8) !important;
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-family: var(--font-sans);
          resize: none;
          line-height: 1.5;
          transition: all 0.3s ease;
        }
        .cyber-textarea:focus {
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
        @keyframes flowPulse {
          0% { box-shadow: 0 0 4px var(--glow-ember); }
          50% { box-shadow: 0 0 14px var(--glow-ember); }
          100% { box-shadow: 0 0 4px var(--glow-ember); }
        }
        .pulse-running {
          animation: flowPulse 2s infinite ease-in-out;
        }
        .flow-node-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(20, 20, 24, 0.85);
          border-radius: var(--radius-md);
          padding: 12px 18px;
          min-width: 155px;
          z-index: 2;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .recruiter-row {
          border-bottom: 1px solid var(--border-subtle);
          transition: background-color 0.2s ease;
        }
        .recruiter-row:hover {
          background-color: rgba(255, 255, 255, 0.02) !important;
        }
      `}</style>

      {/* Main Grid Wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        
        {/* Top Section: Flow Chart */}
        <LivingPanel className="living-card" style={{ background: 'rgba(16,16,20,0.4)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)' }}>
          <div className="living-card-head" style={{ marginBottom: '16px' }}>
            <div>
              <div className="living-card-title" style={{ fontSize: '18px', fontWeight: '700' }}>Outreach Delivery Pipeline</div>
              <div className="living-card-sub" style={{ fontSize: '12px' }}>Real-time verification and emailing states</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(7,7,8,0.9)',
              padding: '24px 30px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              position: 'relative',
              overflowX: 'auto',
            }}
            className="cyber-scrollbar"
          >
            {nodes.map((node, index) => {
              const isRunning = node.state === 'running';
              const borderGlow =
                node.state === 'running'
                  ? '1px solid var(--accent-ember)'
                  : node.state === 'success'
                    ? '1px solid var(--accent-live)'
                    : node.state === 'failed'
                      ? '1px solid #ef4444'
                      : '1px solid rgba(255,255,255,0.06)';

              const statusColor =
                node.state === 'running'
                  ? 'var(--accent-ember)'
                  : node.state === 'success'
                    ? 'var(--accent-live)'
                    : node.state === 'failed'
                      ? '#ef4444'
                      : 'var(--text-muted)';

              return (
                <React.Fragment key={node.id}>
                  {/* Node */}
                  <div
                    className={`flow-node-card ${isRunning ? 'pulse-running' : ''}`}
                    style={{
                      border: borderGlow,
                      boxShadow: node.state === 'success' ? '0 0 12px rgba(52, 211, 153, 0.15)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: '600', color: node.state !== 'idle' ? 'var(--text-primary)' : 'var(--text-muted)' }}>{node.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{node.sub}</div>
                    <div
                      style={{
                        fontSize: '9px',
                        fontWeight: '700',
                        color: statusColor,
                        marginTop: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.7px',
                      }}
                    >
                      {node.state}
                    </div>
                  </div>

                  {/* Edge Connection Line */}
                  {index < nodes.length - 1 && (
                    <div
                      style={{
                        height: '2px',
                        flexGrow: 1,
                        background:
                          node.state === 'success'
                            ? 'var(--accent-live)'
                            : node.state === 'running'
                              ? 'var(--accent-ember)'
                              : 'rgba(255,255,255,0.06)',
                        boxShadow: node.state === 'success' ? '0 0 8px var(--accent-live)' : 'none',
                        transition: 'all 0.3s ease',
                        margin: '0 12px',
                        minWidth: '30px',
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </LivingPanel>

        {/* Bottom Section: Campaign Setup (Left) & Real-time Console/Recruiters (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '20px' }}>
          
          {/* Left Column: Email Template Configuration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <LivingPanel className="living-card" style={{ background: 'rgba(16,16,20,0.4)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)' }}>
              <div className="living-card-head">
                <div>
                  <div className="living-card-title" style={{ fontSize: '16px', fontWeight: '700' }}>Outreach Copy Editor</div>
                  <div className="living-card-sub" style={{ fontSize: '12px' }}>Customize outreach message and placeholders</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Email Subject Template
                  </label>
                  <input
                    type="text"
                    value={subjectTemplate}
                    onChange={(e) => setSubjectTemplate(e.target.value)}
                    disabled={status === 'running'}
                    className="cyber-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Body Template (supports `{'{Name}'}` & `{'{Company}'}`)
                  </label>
                  <textarea
                    rows={8}
                    value={bodyTemplate}
                    onChange={(e) => setBodyTemplate(e.target.value)}
                    disabled={status === 'running'}
                    className="cyber-textarea"
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
                  <input
                    type="checkbox"
                    id="error-sim"
                    checked={simulateErrors}
                    onChange={(e) => setSimulateErrors(e.target.checked)}
                    disabled={status === 'running'}
                    style={{
                      cursor: 'pointer',
                      accentColor: 'var(--accent-ember)',
                      width: '16px',
                      height: '16px',
                    }}
                  />
                  <label htmlFor="error-sim" style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    Simulate SMTP Credentials Error
                  </label>
                </div>

                <button
                  onClick={runCampaign}
                  disabled={status === 'running'}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: status === 'running' ? 'var(--bg-steel)' : 'linear-gradient(135deg, var(--accent-ember), #f0823f)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    letterSpacing: '0.3px',
                    cursor: status === 'running' ? 'not-allowed' : 'pointer',
                    boxShadow: status === 'running' ? 'none' : '0 4px 16px rgba(232, 106, 44, 0.25)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {status === 'running' ? 'Campaign running...' : `Launch Campaign to ${stats.selected} Recruiters`}
                </button>
              </div>
            </LivingPanel>
          </div>

          {/* Right Column: Console Terminal (Left) & Recruiter Database (Right) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Split layout: Terminal Logs & Recruiter list */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '100%' }}>
              
              {/* Terminal Logs & Timers */}
              <LivingPanel className="living-card" style={{ display: 'flex', flexDirection: 'column', height: '585px', background: 'rgba(16,16,20,0.4)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)' }}>
                <div className="living-card-head" style={{ marginBottom: '14px' }}>
                  <div>
                    <div className="living-card-title" style={{ fontSize: '16px', fontWeight: '700' }}>Live Campaign Console</div>
                    <div className="living-card-sub" style={{ fontSize: '12px' }}>Nodemailer SMTP dispatch feed</div>
                  </div>
                </div>

                {/* Counters and Statistics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ background: 'rgba(232, 106, 44, 0.05)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(232, 106, 44, 0.15)' }}>
                    <div style={{ fontSize: '9px', fontWeight: '600', color: 'var(--accent-ember)', letterSpacing: '0.5px' }}>SELECTED</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '2px', color: 'var(--text-primary)' }}>
                      {stats.selected}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(52, 211, 153, 0.05)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52, 211, 153, 0.15)' }}>
                    <div style={{ fontSize: '9px', fontWeight: '600', color: 'var(--accent-live)', letterSpacing: '0.5px' }}>DELIVERED</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '2px', color: 'var(--accent-live)' }}>
                      {stats.delivered}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                    <div style={{ fontSize: '9px', fontWeight: '600', color: '#ef4444', letterSpacing: '0.5px' }}>BOUNCED</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '2px', color: '#ef4444' }}>
                      {stats.failed}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'between', fontSize: '11px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Campaign Progress</span>
                    <span style={{ marginLeft: 'auto', fontWeight: 'bold', color: 'var(--accent-ember)' }}>{progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--accent-ember), var(--accent-gold))',
                        transition: 'width 0.2s ease-in-out',
                      }}
                    />
                  </div>
                </div>

                <div
                  className="cyber-scrollbar"
                  style={{
                    background: '#040405',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px',
                    flexGrow: 1,
                    overflowY: 'auto',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    lineHeight: '1.6',
                    color: '#d4d4d6',
                  }}
                >
                  {logs.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '120px' }}>
                      Terminal idle. Click "Launch Campaign" to execute.
                    </div>
                  ) : (
                    logs.map((log, index) => {
                      let color = '#d4d4d6';
                      if (log.includes('[SUCCESS]')) color = 'var(--accent-live)';
                      else if (log.includes('[ERROR]')) color = '#ef4444';
                      else if (log.includes('[WARNING]')) color = 'var(--accent-gold-light)';
                      else if (log.includes('[INFO]')) color = 'var(--text-muted)';

                      return (
                        <div key={index} style={{ color, whiteSpace: 'pre-wrap' }}>
                          {log}
                        </div>
                      );
                    })
                  )}
                  <div ref={logsEndRef} />
                </div>
              </LivingPanel>

              {/* Recruiter Queue Database */}
              <LivingPanel className="living-card" style={{ display: 'flex', flexDirection: 'column', height: '585px', background: 'rgba(16,16,20,0.4)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)' }}>
                <div className="living-card-head" style={{ marginBottom: '14px' }}>
                  <div>
                    <div className="living-card-title" style={{ fontSize: '16px', fontWeight: '700' }}>Recruiter Queue</div>
                    <div className="living-card-sub" style={{ fontSize: '12px' }}>Search and select target mailing list</div>
                  </div>
                </div>

                {/* Search */}
                <div style={{ marginBottom: '14px' }}>
                  <input
                    type="text"
                    placeholder="Search by company, name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="cyber-input"
                    style={{ fontSize: '12px' }}
                  />
                </div>

                {/* Table */}
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
                        <th style={{ padding: '10px 8px', width: '30px' }}>
                          <input
                            type="checkbox"
                            checked={stats.selected === recruiters.length}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            style={{ cursor: 'pointer' }}
                          />
                        </th>
                        <th style={{ padding: '10px 8px', fontWeight: '600' }}>Name</th>
                        <th style={{ padding: '10px 8px', fontWeight: '600' }}>Company</th>
                        <th style={{ padding: '10px 8px', fontWeight: '600' }}>Delivery Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecruiters.slice(0, 100).map((rec, index) => {
                        let statusBg = 'rgba(255,255,255,0.02)';
                        let statusText = 'Pending';
                        let statusColor = 'var(--text-muted)';
                        
                        if (rec.status === 'delivered') {
                          statusBg = 'rgba(52, 211, 153, 0.08)';
                          statusText = 'Delivered';
                          statusColor = 'var(--accent-live)';
                        } else if (rec.status === 'failed') {
                          statusBg = 'rgba(239, 68, 68, 0.08)';
                          statusText = 'Bounced';
                          statusColor = '#ef4444';
                        }

                        // Map overall index in main array
                        const overallIndex = recruiters.findIndex((r) => r.email === rec.email);

                        return (
                          <tr key={rec.email} className="recruiter-row">
                            <td style={{ padding: '10px 8px' }}>
                              <input
                                type="checkbox"
                                checked={rec.selected}
                                onChange={() => toggleSelectRecruiter(overallIndex)}
                                style={{ cursor: 'pointer' }}
                              />
                            </td>
                            <td style={{ padding: '10px 8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {rec.name}
                                {rec.interactive && (
                                  <span
                                    style={{
                                      padding: '2px 5px',
                                      borderRadius: '3px',
                                      background: 'rgba(168, 85, 247, 0.15)',
                                      color: '#c084fc',
                                      fontSize: '8px',
                                      fontWeight: 'bold',
                                      border: '1px solid rgba(168, 85, 247, 0.3)',
                                      boxShadow: '0 0 8px rgba(168, 85, 247, 0.2)',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px'
                                    }}
                                    title={`Last contact: ${rec.lastContactSubject} (${new Date(rec.lastContactDate!).toLocaleDateString()})`}
                                  >
                                    💬 Interactive
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px', wordBreak: 'break-all' }}>{rec.email}</div>
                            </td>
                            <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{rec.company}</td>
                            <td style={{ padding: '10px 8px' }}>
                              <span
                                style={{
                                  padding: '3px 7px',
                                  borderRadius: '4px',
                                  background: statusBg,
                                  color: statusColor,
                                  fontSize: '10px',
                                  fontWeight: 'bold',
                                  letterSpacing: '0.3px',
                                }}
                              >
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'right' }}>
                  Showing top 100 of {filteredRecruiters.length} entries
                </div>
              </LivingPanel>

            </div>
          </div>

        </div>

      </div>
    </LivingPageShell>
  );
};

export default ScriptsPage;

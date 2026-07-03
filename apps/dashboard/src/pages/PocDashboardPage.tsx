import React, { useState, useEffect } from 'react';
import VisualizationModeSelector from '../components/visualizations/VisualizationModeSelector';
import CommandCenterView from '../components/visualizations/CommandCenterView';
import ForgeFloorView from '../components/visualizations/ForgeFloorView';
import DependencyGalaxyView from '../components/visualizations/DependencyGalaxyView';
import TimelineReplayView from '../components/visualizations/TimelineReplayView';
import RuleCompilerView from '../components/visualizations/RuleCompilerView';
import ArsenalExplorerView from '../components/visualizations/ArsenalExplorerView';
import LivingPageShell from '../components/forge-os/LivingPageShell';
import LivingPanel from '../components/forge-os/LivingPanel';

export const PocDashboardPage: React.FC = () => {
  const [visMode, setVisMode] = useState('command-center');
  const [latestRun, setLatestRun] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPocData = async () => {
    try {
      const runRes = await fetch('/api/poc/latest');
      if (!runRes.ok) throw new Error('No latest POC run found. Run pnpm forge:poc first!');
      const runData = await runRes.json();
      setLatestRun(runData);

      const eventsRes = await fetch(`/api/poc/events/${runData.id}`);
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events || eventsData);
      }
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchPocData();
    const interval = setInterval(fetchPocData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getActiveStep = () => {
    if (events.length === 0) return 'blueprint';
    const lastEvent = events[events.length - 1];
    if (lastEvent.type === 'forge.completed') return 'completed';
    return lastEvent.type.replace('.created', '').replace('.started', '');
  };

  const renderActiveView = () => {
    switch (visMode) {
      case 'command-center':
        return <CommandCenterView events={events} activeStep={getActiveStep()} />;
      case 'forge-floor':
        return <ForgeFloorView events={events} activeStep={getActiveStep()} />;
      case 'dependency-galaxy':
        return <DependencyGalaxyView events={events} />;
      case 'timeline-replay':
        return <TimelineReplayView events={events} />;
      case 'rule-compiler':
        return <RuleCompilerView events={events} />;
      case 'arsenal-explorer':
        return <ArsenalExplorerView events={events} />;
      default:
        return <CommandCenterView events={events} activeStep={getActiveStep()} />;
    }
  };

  if (error) {
    return (
      <LivingPageShell
        testId="poc-dashboard-page"
        title="Forge Core POC Dashboard"
        subtitle="Visual proof-of-concept run telemetry"
        badge="⚠ ERROR"
        badgeColor="var(--red)"
      >
        <LivingPanel className="living-card" style={{ textAlign: 'center', padding: 30 }}>
          <span style={{ fontSize: '3rem' }}>⚠️</span>
          <h3 style={{ fontSize: '1.2rem', margin: '15px 0 5px 0' }}>Data Resolution Error</h3>
          <p style={{ color: '#91a0bb', fontSize: '0.9rem' }}>{error}</p>
          <div
            className="living-tag"
            style={{ display: 'inline-block', marginTop: 20, fontFamily: 'var(--font-mono, monospace)' }}
          >
            pnpm forge:poc
          </div>
        </LivingPanel>
      </LivingPageShell>
    );
  }

  return (
    <LivingPageShell
      testId="poc-dashboard-page"
      title="Forge Core POC Dashboard"
      subtitle={`Visualizing POC Run ID: ${latestRun?.id ?? '…'}`}
      badge={latestRun?.status?.toUpperCase() ?? 'LOADING'}
      badgeColor={latestRun?.status === 'complete' ? 'var(--green)' : 'var(--orange)'}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -8 }}>
        <VisualizationModeSelector mode={visMode} onChange={setVisMode} />
      </div>
      <div className="living-poc-grid">
        <div className="living-poc-main">
          <LivingPanel>{renderActiveView()}</LivingPanel>
        </div>
        <LivingPanel className="living-telemetry">
          <div className="title" style={{ fontSize: 15 }}>
            Run Telemetry
          </div>
          <div>
            <div className="small">Blueprint Title</div>
            <div style={{ fontWeight: 600, color: 'var(--gold)' }}>
              {latestRun?.blueprint?.title || 'TODO.md Creation'}
            </div>
          </div>
          <div>
            <div className="small">Status</div>
            <span
              className="badge"
              style={{
                ['--c' as string]:
                  latestRun?.status === 'complete' ? 'var(--green)' : 'var(--orange)'
              }}
            >
              {latestRun?.status?.toUpperCase()}
            </span>
          </div>
          <div>
            <div className="small">Chronicle decision logs</div>
            <div className="living-log">
              <div>[INFO] Init Forge engine...</div>
              {events.map((e, idx) => (
                <div key={idx}>
                  [{e.status?.toUpperCase()}] {e.message || e.summary}
                </div>
              ))}
            </div>
          </div>
        </LivingPanel>
      </div>
    </LivingPageShell>
  );
};

export default PocDashboardPage;

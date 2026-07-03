import React from 'react';
import type { RuntimeMetrics } from '../../lib/runtimeMetrics';
import type { ForgeRuntimeSnapshot } from '../../lib/forge-client/types';
import { TOOLS, LAB_BADGES } from './constants';
import { useLivingForge } from './LivingForgeContext';

interface Props {
  metrics: RuntimeMetrics;
  activeArtisan?: ForgeRuntimeSnapshot['artisans'][number];
  workpieceName?: string;
  workpieceCount?: number;
  onToolClick: (label: string, color: string, x: number, y: number) => void;
  addEvent: (icon: string, message: string, tag: string) => void;
}

export const LivingMetricsSection: React.FC<Props> = ({
  metrics,
  activeArtisan,
  workpieceName = 'dark-mode.css',
  workpieceCount = 18,
  onToolClick,
  addEvent
}) => {
  const { burst, toast } = useLivingForge();
  const metricCards = [
    { label: 'Active', value: `${metrics.activeArtisanCount} / 12`, colorVar: '--violet' },
    { label: 'Workpieces', value: String(workpieceCount), colorVar: '--ember' },
    { label: 'Success', value: `${(metrics.successRate * 100).toFixed(1)}%`, colorVar: '--mint' },
    { label: 'Strikes', value: metrics.strikeCount.toLocaleString(), colorVar: '--aqua' }
  ];

  const artisanName = activeArtisan?.name ?? 'BuilderArtisan';
  const isActive = activeArtisan?.status === 'active';

  return (
    <>
      <section className="strip">
        <div className="panel cards" data-testid="section-health">
          <p className="kicker">System Metrics</p>
          <div className="metric-grid">
            {metricCards.map((metric) => (
              <div key={metric.label} className="metric">
                <span className="quiet">{metric.label}</span>
                <b>{metric.value}</b>
                <svg className="spark" viewBox="0 0 120 34" aria-hidden>
                  <polyline
                    points="0,28 12,21 24,24 36,14 48,18 60,10 72,14 84,7 96,17 108,11 120,5"
                    fill="none"
                    stroke={`var(${metric.colorVar})`}
                    strokeWidth="2"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
        <div className="panel tools">
          <p className="kicker">Active Instruments</p>
          <div className="tool-grid">
            {TOOLS.map((tool) => (
              <button
                key={tool.label}
                type="button"
                className="tool"
                style={{ ['--c' as string]: `var(${tool.colorVar})` }}
                title={tool.label}
                onClick={(e) => {
                  const color = getComputedStyle(e.currentTarget).getPropertyValue('--c').trim() || '#ff8a2a';
                  onToolClick(tool.label, color, e.clientX, e.clientY);
                  addEvent('⚒', `${tool.label} activated`, 'RUNNING');
                }}
              >
                {tool.icon}
                <small>{tool.label}</small>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="panel component-lab" data-testid="section-artisans">
        <p className="kicker">Component Lab</p>
        <div className="lab-grid">
          <div className="live-card">
            <b>{artisanName}</b>
            <span className="badge" style={{ ['--c' as string]: 'var(--mint)', float: 'right' }}>
              {isActive ? 'Active' : 'Idle'}
            </span>
            <p className="muted">Workpiece: {workpieceName}</p>
            <div style={{ position: 'absolute', bottom: 18, left: 16 }} className="quiet">
              Next: token cleanup
            </div>
          </div>
          <div>
            <p className="muted">Status Badges</p>
            <div className="status">
              {LAB_BADGES.map((badge) => (
                <span
                  key={badge.label}
                  className="badge"
                  style={{ ['--c' as string]: `var(${badge.colorVar})` }}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    const color = getComputedStyle(e.currentTarget).getPropertyValue('--c').trim();
                    burst(e.clientX, e.clientY, color || '#ff8a2a', 18);
                    toast(`${badge.label} selected`);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toast(`${badge.label} selected`);
                    }
                  }}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
          <LivingControls addEvent={addEvent} />
        </div>
      </section>
    </>
  );
};

const LivingControls: React.FC<{ addEvent: (icon: string, message: string, tag: string) => void }> = ({
  addEvent
}) => {
  const { toast } = useLivingForge();
  const [toggles, setToggles] = React.useState([true, false]);

  return (
    <div className="controls">
      <p className="muted">Artifact Controls</p>
      <button type="button" className="primary">
        Primary
      </button>
      <button type="button">Secondary</button>
      <br />
      {toggles.map((on, i) => (
        <span
          key={i}
          className={`toggle ${on ? 'on' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => {
            setToggles((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
            toast('Control toggled');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setToggles((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
              toast('Control toggled');
            }
          }}
        />
      ))}
      <div className="progress">
        <div className="bar" style={{ width: '54%' }} />
      </div>
    </div>
  );
};

export default LivingMetricsSection;

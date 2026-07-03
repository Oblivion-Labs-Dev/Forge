import React from 'react';
import MetricOrb from '../forge-ui/MetricOrb';

export const SystemStatusPanel: React.FC = () => {
  return (
    <div className="molten-border system-status-panel" style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <h4
        style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        System Status
      </h4>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flex: 1 }}>
        <MetricOrb value={42} label="CPU" sublabel="Forge" />
        <MetricOrb value={68} label="Memory" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>28</div>
            <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>Events/Min</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>3</div>
            <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>Queue Depth</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusPanel;

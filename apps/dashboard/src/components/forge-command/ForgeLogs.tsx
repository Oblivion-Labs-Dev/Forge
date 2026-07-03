import React from 'react';
import { STATIC_FORGE_LOGS } from '../../data/commandCenterFixtures';

interface LogsProps {
  logs?: string[];
}

export const ForgeLogs: React.FC<LogsProps> = ({ logs }) => {
  const entries = logs
    ? logs.map((message, i) => ({ time: `10:24:${30 - i}`, icon: '>', message }))
    : STATIC_FORGE_LOGS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <h4
        style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        Forge Logs
      </h4>
      <div
        style={{
          background: '#050507',
          border: '1px solid var(--border-glass)',
          borderRadius: '6px',
          padding: '8px 10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          color: '#10b981',
          minHeight: '72px',
          maxHeight: '72px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}
      >
        {entries.map((entry, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', minWidth: '52px' }}>{entry.time}</span>
            <span>{entry.icon}</span>
            <span style={{ color: 'var(--text-primary)' }}>{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForgeLogs;

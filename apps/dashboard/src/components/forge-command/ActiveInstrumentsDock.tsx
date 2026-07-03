import React from 'react';
import ForgeIcon from '../forge-ui/ForgeIcon';

interface DockProps {
  activeTool?: string;
}

const TOOL_COLORS: Record<string, string> = {
  bellows: '#ff7a18',
  anvil: '#a855f7',
  tsup: '#3b82f6',
  eslint: '#10b981',
  gateway: '#ec4899',
  inspector: '#f59e0b'
};

export const ActiveInstrumentsDock: React.FC<DockProps> = ({ activeTool }) => {
  const tools = [
    { id: 'bellows', label: 'Bellows' },
    { id: 'anvil', label: 'Anvil' },
    { id: 'tsup', label: 'Tsup' },
    { id: 'eslint', label: 'Eslint' },
    { id: 'gateway', label: 'Gateway' },
    { id: 'inspector', label: 'Inspector' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <h4
        style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        Active Instruments
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        {tools.map((t) => {
          const isActive = activeTool?.toLowerCase() === t.id;
          const color = TOOL_COLORS[t.id] || 'var(--text-secondary)';
          return (
            <div
              key={t.id}
              className="molten-border"
              style={{
                height: '46px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                background: isActive ? 'rgba(255, 61, 0, 0.08)' : 'var(--bg-iron)',
                borderColor: isActive ? color : 'var(--border-glass)',
                boxShadow: isActive ? `0 0 8px ${color}55` : 'none'
              }}
            >
              <ForgeIcon name={t.id} color={color} size={16} />
              <span style={{ fontSize: '0.52rem', color: isActive ? color : 'var(--text-muted)' }}>{t.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveInstrumentsDock;

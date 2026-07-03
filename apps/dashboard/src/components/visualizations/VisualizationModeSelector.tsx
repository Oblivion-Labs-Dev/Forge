import React from 'react';

interface SelectorProps {
  mode: string;
  onChange: (mode: string) => void;
}

export const VisualizationModeSelector: React.FC<SelectorProps> = ({ mode, onChange }) => {
  const modes = [
    { id: 'command-center', label: 'Command Center' },
    { id: 'forge-floor', label: 'Forge Floor' },
    { id: 'dependency-galaxy', label: 'Dependency Galaxy' },
    { id: 'timeline-replay', label: 'Timeline Replay' },
    { id: 'rule-compiler', label: 'Rule Compiler' },
    { id: 'arsenal-explorer', label: 'Arsenal Explorer' }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
      <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
        VISUALIZATION MODE:
      </label>
      <select
        value={mode}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--border-glass)',
          borderRadius: '6px',
          color: '#fff',
          padding: '6px 12px',
          fontSize: '0.85rem',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        {modes.map((m) => (
          <option key={m.id} value={m.id} style={{ background: '#121216', color: '#fff' }}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
};
export default VisualizationModeSelector;

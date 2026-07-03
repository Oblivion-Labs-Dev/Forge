import React from 'react';
import GlassPanel from '../GlassPanel';

interface ViewProps {
  events: any[];
  activeStep?: string;
  activeArtisan?: string;
}

export const ForgeFloorView: React.FC<ViewProps> = ({ events, activeStep }) => {
  const stations = [
    { id: 'blueprint', name: 'Blueprint Table', icon: '📜', desc: 'Planning & Objective drafting', trigger: 'blueprint.created' },
    { id: 'workshop', name: 'Workshop Anvil', icon: '📐', desc: 'Execution context setup', trigger: 'workshop.created' },
    { id: 'builder', name: 'Fire & Hammer', icon: '🔥', desc: 'Builder Artisan compiling code', trigger: 'builder' },
    { id: 'reviewer', name: 'Inspection Bench', icon: '🔍', desc: 'Assayer checking code sections', trigger: 'reviewer' },
    { id: 'completed', name: 'Artifact Rack', icon: '🛡️', desc: 'Final products generated', trigger: 'forge.completed' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
      {stations.map((st) => {
        const isCompleted = events.some(e => e.type === st.trigger || e.type.includes(st.id) || (st.id === 'completed' && e.type === 'forge.completed'));
        const isActive = activeStep === st.id || (activeStep === 'artisan.started' && st.id === 'builder');

        return (
          <GlassPanel
            key={st.id}
            glow={isActive}
            style={{
              borderColor: isActive ? 'var(--accent-amber)' : isCompleted ? '#10b981' : 'var(--border-glass)',
              background: isActive ? 'rgba(255,159,28,0.05)' : 'rgba(18,18,22,0.4)',
              textAlign: 'center',
              padding: '25px 15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              animation: isActive ? 'pulse-animation 2s infinite' : 'none'
            }}
          >
            <div style={{ fontSize: '3rem', filter: isActive ? 'drop-shadow(0 0 10px rgba(255,159,28,0.5))' : 'none' }}>
              {st.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{st.name}</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{st.desc}</p>
            </div>
            {isActive && (
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-amber)', fontWeight: 600, background: 'rgba(255,159,28,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                ACTIVE OPERATOR
              </span>
            )}
            {!isActive && isCompleted && (
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                PASSED/COMPLETED
              </span>
            )}
          </GlassPanel>
        );
      })}
    </div>
  );
};
export default ForgeFloorView;

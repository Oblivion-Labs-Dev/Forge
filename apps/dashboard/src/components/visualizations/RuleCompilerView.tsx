import React from 'react';
import GlassPanel from '../GlassPanel';

interface ViewProps {
  events: any[];
}

export const RuleCompilerView: React.FC<ViewProps> = () => {
  const steps = [
    { label: 'Rule Files', desc: 'AGENTS.md, common.md, naming.md, etc.', status: 'loaded' },
    { label: 'Parser', desc: 'Eject markdown headers and AST blocks', status: 'compiled' },
    { label: 'Rule Manifest', desc: 'Compile JSON constraint structures', status: 'compiled' },
    { label: 'Agent Guardrails', desc: 'Inject constraints into Artisan contexts', status: 'active' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <GlassPanel>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px', color: 'var(--accent-gold)' }}>
          Rule Compilation Pipeline
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
          {steps.map((st, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '15px',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📜</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{st.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{st.desc}</div>
              
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  marginTop: '8px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}
              >
                {st.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
};
export default RuleCompilerView;

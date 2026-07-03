import React from 'react';
import MotionCard from '../MotionCard';

interface ViewProps {
  events: any[];
}

export const ArsenalExplorerView: React.FC<ViewProps> = () => {
  const packages = [
    { name: 'contracts', desc: 'Domain types and interface blueprints', exports: ['Blueprint', 'Workpiece'] },
    { name: 'events', desc: 'Foundry HammerStrike event bus system', exports: ['HammerStrike', 'EventBus'] },
    { name: 'filesystem', desc: 'Secure repository directory connector', exports: ['FilesystemGateway'] },
    { name: 'logging', desc: 'Thematic chronicle and logger output', exports: ['Logger'] },
    { name: 'testing', desc: 'Foundry verification check orchestrator', exports: ['Assayer', 'mockWorkspace'] }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
      {packages.map((pkg, i) => (
        <MotionCard key={pkg.name} delay={i * 0.05}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🛡️</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>@{pkg.name}</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{pkg.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {pkg.exports.map(exp => (
              <span
                key={exp}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-glass)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}
              >
                {exp}
              </span>
            ))}
          </div>
        </MotionCard>
      ))}
    </div>
  );
};
export default ArsenalExplorerView;

import React from 'react';
import { Hammer } from 'lucide-react';

export const HammerstrikeBanner: React.FC = () => {
  return (
    <div
      className="molten-border hammerstrike-banner"
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 5,
        padding: '6px 10px',
        background: 'rgba(18, 18, 22, 0.92)',
        borderColor: 'rgba(255, 122, 24, 0.45)',
        boxShadow: '0 0 16px rgba(255, 122, 24, 0.15)',
        maxWidth: '210px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <Hammer size={14} color="var(--accent-ember)" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
            Hammerstrike Event
          </div>
          <div style={{ fontSize: '0.62rem', color: '#fff', marginTop: '2px', lineHeight: 1.3 }}>
            BuilderArtisan compiled forge/engine/core.ts
          </div>
          <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '2px' }}>2.4s ago</div>
        </div>
      </div>
    </div>
  );
};

export default HammerstrikeBanner;

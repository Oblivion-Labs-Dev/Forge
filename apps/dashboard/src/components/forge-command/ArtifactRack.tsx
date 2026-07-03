import React from 'react';
import ArtifactPlate from '../forge-ui/ArtifactPlate';

interface RackProps {
  artifacts: Array<{ name: string; runId: string; isHot?: boolean }>;
}

export const ArtifactRack: React.FC<RackProps> = ({ artifacts }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Artifact Rack
      </h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
        {artifacts.length === 0 ? (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            No artifacts cooling on the rack.
          </div>
        ) : (
          artifacts.map((art, idx) => (
            <ArtifactPlate key={idx} name={art.name} runId={art.runId} isHot={art.isHot} />
          ))
        )}
      </div>
    </div>
  );
};
export default ArtifactRack;

import React from 'react';

interface PlateProps {
  name: string;
  runId: string;
  isHot?: boolean;
}

export const ArtifactPlate: React.FC<PlateProps> = ({ name, runId, isHot = false }) => {
  return (
    <div
      className="molten-border"
      style={{
        padding: '12px 16px',
        background: 'linear-gradient(135deg, var(--bg-iron), #1d1d24)',
        borderColor: isHot ? 'var(--accent-ember)' : 'var(--accent-gold)',
        boxShadow: isHot ? '0 0 12px rgba(255, 122, 24, 0.2)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isHot && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, rgba(255, 61, 0, 0.08), transparent)',
            pointerEvents: 'none'
          }}
        />
      )}
      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: isHot ? 'var(--accent-ember)' : 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>
        {name}
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
        Forged in run: {runId}
      </div>
    </div>
  );
};
export default ArtifactPlate;

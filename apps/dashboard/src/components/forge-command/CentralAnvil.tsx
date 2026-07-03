import React, { useState } from 'react';
import SparkBurst from '../forge-ui/SparkBurst';

interface AnvilProps {
  blueprintTitle: string;
  activeWorkpiece?: string;
  progress: number;
}

export const CentralAnvil: React.FC<AnvilProps> = ({ blueprintTitle: _blueprintTitle, activeWorkpiece, progress }) => {
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [strike, setStrike] = useState(false);

  const handleAnvilStrike = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setStrike(true);
    setTimeout(() => setStrike(false), 300);
  };

  return (
    <div
      onClick={handleAnvilStrike}
      style={{
        position: 'relative',
        height: '240px',
        background: 'radial-gradient(circle at center, #1b1311 0%, #0a0a0c 70%)',
        border: '1px solid rgba(255, 61, 0, 0.25)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: '0 0 32px rgba(255, 61, 0, 0.05)'
      }}
    >
      {/* Molten Glow Core */}
      <div
        style={{
          position: 'absolute',
          width: '120px',
          height: '60px',
          background: 'radial-gradient(ellipse, var(--accent-molten), transparent 60%)',
          bottom: '20px',
          opacity: strike ? 1 : 0.4,
          filter: 'blur(10px)',
          transition: 'all 0.1s ease',
          pointerEvents: 'none'
        }}
      />

      {/* SVG Anvil Silhouette */}
      <svg
        width="160"
        height="90"
        viewBox="0 0 160 90"
        style={{
          zIndex: 2,
          filter: strike ? 'drop-shadow(0 0 12px var(--accent-molten))' : 'drop-shadow(0 0 6px rgba(255,122,24,0.3))',
          transform: strike ? 'scale(0.98)' : 'scale(1)',
          transition: 'transform 0.1s ease'
        }}
      >
        <path
          d="M 30,10 H 130 C 130,10 145,25 155,40 H 115 C 105,40 100,55 100,70 H 120 V 85 H 40 V 70 H 60 C 60,55 55,40 45,40 H 5 C 15,25 30,10 30,10 Z"
          fill="#171717"
          stroke={strike ? 'var(--accent-molten)' : 'var(--accent-ember)'}
          strokeWidth="2.5"
        />
        {/* Fire emblem overlay on Anvil */}
        <path
          d="M 80,30 C 75,37 72,43 72,50 C 72,55 76,59 80,59 C 84,59 88,55 88,50 C 88,43 85,37 80,30 Z"
          fill="var(--accent-molten)"
          opacity="0.8"
        />
      </svg>

      <div style={{ zIndex: 3, textAlign: 'center', marginTop: '15px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Central Anvil Core
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
          {activeWorkpiece || 'Idle - Awaiting Workpiece'}
        </div>
        {progress > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
            <div style={{ width: '100px', height: '4px', background: 'var(--bg-steel)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-ember)' }} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {progress}%
            </span>
          </div>
        )}
      </div>

      {clickPos && (
        <SparkBurst x={clickPos.x} y={clickPos.y} onComplete={() => setClickPos(null)} />
      )}
    </div>
  );
};
export default CentralAnvil;

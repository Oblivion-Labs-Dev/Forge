import React from 'react';
import GlassPanel from '../GlassPanel';

interface ViewProps {
  events: any[];
}

export const DependencyGalaxyView: React.FC<ViewProps> = () => {
  const systems = [
    { name: 'contracts', angle: 0, radius: 100, color: 'var(--accent-gold)' },
    { name: 'events', angle: 72, radius: 110, color: '#3b82f6' },
    { name: 'filesystem', angle: 144, radius: 90, color: '#10b981' },
    { name: 'logging', angle: 216, radius: 120, color: '#ec4899' },
    { name: 'testing', angle: 288, radius: 100, color: '#a855f7' }
  ];

  return (
    <GlassPanel style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '420px', background: '#070709', border: '1px solid var(--border-glass)' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '20px' }}>Dependency Galaxy Map</h3>
      <svg width="400" height="300" viewBox="0 0 400 300">
        {/* Orbits */}
        <circle cx="200" cy="150" r="100" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <circle cx="200" cy="150" r="120" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
        <circle cx="200" cy="150" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />

        {/* Gravity Lines */}
        {systems.map((sys, i) => {
          const x = 200 + sys.radius * Math.cos((sys.angle * Math.PI) / 180);
          const y = 150 + sys.radius * Math.sin((sys.angle * Math.PI) / 180);
          return (
            <line
              key={i}
              x1="200"
              y1="150"
              x2={x}
              y2={y}
              stroke="rgba(212, 175, 55, 0.15)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Center Node (Forge Core) */}
        <circle cx="200" cy="150" r="22" fill="#121216" stroke="var(--accent-gold)" strokeWidth="2" />
        <text x="200" y="154" textAnchor="middle" fill="var(--accent-gold)" fontSize="10" fontWeight="700" fontFamily="var(--font-sans)">
          FORGE
        </text>

        {/* Orbiting Systems */}
        {systems.map((sys, i) => {
          const x = 200 + sys.radius * Math.cos((sys.angle * Math.PI) / 180);
          const y = 150 + sys.radius * Math.sin((sys.angle * Math.PI) / 180);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="12" fill="#121216" stroke={sys.color} strokeWidth="1.5" />
              <text x={x} y={y + 4} textAnchor="middle" fill="#fff" fontSize="8" fontFamily="var(--font-mono)">
                {sys.name[0].toUpperCase()}
              </text>
              <text x={x} y={y + 22} textAnchor="middle" fill="var(--text-secondary)" fontSize="7" fontFamily="var(--font-sans)">
                @{sys.name}
              </text>
            </g>
          );
        })}
      </svg>
    </GlassPanel>
  );
};
export default DependencyGalaxyView;

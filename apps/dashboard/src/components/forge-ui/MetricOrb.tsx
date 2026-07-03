import React from 'react';

interface OrbProps {
  value: number;
  label: string;
  sublabel?: string;
}

export const MetricOrb: React.FC<OrbProps> = ({ value, label, sublabel }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="var(--bg-steel)"
            strokeWidth="5"
          />
          {/* Progress */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="var(--accent-ember)"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 4px var(--accent-ember))',
              transition: 'stroke-dashoffset 0.5s ease'
            }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.95rem',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: '#fff'
          }}
        >
          {value}%
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</div>
        {sublabel && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{sublabel}</div>}
      </div>
    </div>
  );
};
export default MetricOrb;

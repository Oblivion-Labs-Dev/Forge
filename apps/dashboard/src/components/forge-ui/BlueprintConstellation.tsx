import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface BlueprintConstellationProps {
  activeStep?: string | null;
}

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  blueprint: { x: 8, y: 52 },
  planner: { x: 28, y: 52 },
  builder: { x: 48, y: 52 },
  reviewer: { x: 68, y: 52 },
  ship: { x: 88, y: 52 }
};

const PATH_ORDER = ['blueprint', 'planner', 'builder', 'reviewer', 'ship'];

export const BlueprintConstellation: React.FC<BlueprintConstellationProps> = ({ activeStep }) => {
  const path = useMemo(() => {
    return PATH_ORDER.map((id) => {
      const point = NODE_POSITIONS[id];
      return `${point.x},${point.y}`;
    }).join(' ');
  }, []);

  return (
    <svg
      className="blueprint-constellation"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      data-testid="blueprint-constellation"
    >
      <defs>
        <linearGradient id="blueprint-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(120, 180, 255, 0.05)" />
          <stop offset="50%" stopColor="rgba(120, 180, 255, 0.35)" />
          <stop offset="100%" stopColor="rgba(120, 180, 255, 0.08)" />
        </linearGradient>
      </defs>

      <motion.polyline
        points={path}
        fill="none"
        stroke="url(#blueprint-line)"
        strokeWidth="0.6"
        strokeDasharray="2 2"
        initial={{ pathLength: 0, opacity: 0.3 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={{ duration: 2.4, ease: 'easeInOut' }}
      />

      {PATH_ORDER.map((id, index) => {
        const point = NODE_POSITIONS[id];
        const isActive = activeStep === id;

        return (
          <g key={id}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r={isActive ? 2.2 : 1.2}
              fill={isActive ? 'rgba(240, 201, 106, 0.95)' : 'rgba(120, 180, 255, 0.55)'}
              animate={isActive ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={isActive ? { duration: 1.4, repeat: Infinity } : undefined}
            />
            {index < PATH_ORDER.length - 1 && (
              <motion.line
                x1={point.x}
                y1={point.y}
                x2={NODE_POSITIONS[PATH_ORDER[index + 1]].x}
                y2={NODE_POSITIONS[PATH_ORDER[index + 1]].y}
                stroke="rgba(120, 180, 255, 0.12)"
                strokeWidth="0.35"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2 + index * 0.15, duration: 0.8 }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default BlueprintConstellation;

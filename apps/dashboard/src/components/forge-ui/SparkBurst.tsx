import React, { useEffect, useMemo } from 'react';

interface SparkParticle {
  id: number;
  angle: number;
  velocity: number;
  length: number;
  thickness: number;
  duration: number;
  delay: number;
  drift: number;
  variant: 'bright' | 'ember' | 'ash';
}

interface SparkBurstProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

function createSparks(count: number): SparkParticle[] {
  return Array.from({ length: count }, (_, id) => {
    const upward = Math.random() < 0.75;
    const angle = upward
      ? -Math.PI + Math.random() * Math.PI
      : Math.random() * Math.PI * 2;

    return {
      id,
      angle,
      velocity: 28 + Math.random() * 52,
      length: 4 + Math.random() * 10,
      thickness: 0.8 + Math.random() * 1.4,
      duration: 0.35 + Math.random() * 0.35,
      delay: Math.random() * 0.04,
      drift: (Math.random() - 0.5) * 18,
      variant: Math.random() < 0.35 ? 'bright' : Math.random() < 0.7 ? 'ember' : 'ash'
    };
  });
}

function sparkEnd(p: SparkParticle): { x: number; y: number } {
  const gravity = 22 + Math.random() * 28;
  const x = Math.cos(p.angle) * p.velocity + p.drift;
  const y = Math.sin(p.angle) * p.velocity * 0.55 + gravity;
  return { x, y };
}

export const SparkBurst: React.FC<SparkBurstProps> = ({ x, y, onComplete }) => {
  const sparks = useMemo(() => createSparks(22), []);

  useEffect(() => {
    const maxDuration = Math.max(...sparks.map((s) => (s.duration + s.delay) * 1000));
    const timer = window.setTimeout(() => onComplete?.(), maxDuration + 80);
    return () => window.clearTimeout(timer);
  }, [onComplete, sparks]);

  return (
    <div
      className="spark-burst"
      style={{ left: x, top: y }}
      aria-hidden
    >
      <span className="spark-flash" />
      {sparks.map((spark) => {
        const end = sparkEnd(spark);
        const deg = (spark.angle * 180) / Math.PI;

        return (
          <span
            key={spark.id}
            className={`spark-streak spark-streak-${spark.variant}`}
            style={{
              '--spark-angle': `${deg}deg`,
              '--spark-len': `${spark.length}px`,
              '--spark-thick': `${spark.thickness}px`,
              '--spark-x': `${end.x}px`,
              '--spark-y': `${end.y}px`,
              '--spark-dur': `${spark.duration}s`,
              '--spark-delay': `${spark.delay}s`
            }}
          />
        );
      })}
    </div>
  );
};

export default SparkBurst;

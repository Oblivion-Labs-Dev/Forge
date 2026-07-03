import React from 'react';
import type { ForgeToast, SparkParticle } from './useForgeSparks';

interface Props {
  particles: SparkParticle[];
  toasts: ForgeToast[];
}

export const SparkLayer: React.FC<Props> = ({ particles, toasts }) => (
  <>
    <div className="spark-layer" aria-hidden>
      {particles.map((p) => (
        <i
          key={p.id}
          className="particle"
          style={{
            left: p.x,
            top: p.y,
            background: p.color,
            ['--x' as string]: `${p.dx}px`,
            ['--y' as string]: `${p.dy}px`,
            ['--orange' as string]: p.color
          }}
        />
      ))}
    </div>
    {toasts.map((t) => (
      <div key={t.id} className="toast">
        {t.message}
      </div>
    ))}
  </>
);

export default SparkLayer;

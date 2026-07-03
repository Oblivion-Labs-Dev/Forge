import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePointerParallax } from '../../hooks/usePointerParallax';

interface Particle {
  id: number;
  left: string;
  size: number;
  duration: string;
  drift: string;
}

export const ForgeAtmosphere: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const pointer = usePointerParallax(0.6);

  useEffect(() => {
    const count = 14;
    const tempParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 1.5,
      duration: `${Math.random() * 10 + 8}s`,
      drift: `${Math.random() * 60 - 30}px`
    }));
    setParticles(tempParticles);
  }, []);

  return (
    <div className="atmosphere">
      <motion.div
        className="atmosphere-vignette"
        animate={{ x: pointer.x * 20, y: pointer.y * 14 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      />
      <motion.div
        className="atmosphere-glow atmosphere-glow-animated"
        animate={{ x: pointer.x * -30, y: pointer.y * -20 }}
        transition={{ type: 'spring', stiffness: 45, damping: 18 }}
      />
      <motion.div
        className="atmosphere-orb atmosphere-orb-left"
        animate={{ x: pointer.x * 40, y: pointer.y * 28 }}
        transition={{ type: 'spring', stiffness: 40, damping: 16 }}
      />
      <motion.div
        className="atmosphere-orb atmosphere-orb-right"
        animate={{ x: pointer.x * -35, y: pointer.y * -22 }}
        transition={{ type: 'spring', stiffness: 40, damping: 16 }}
      />
      {particles.map((p) => (
        <div
          key={p.id}
          className="ember-particle"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            // @ts-expect-error CSS custom properties
            '--duration': p.duration,
            // @ts-expect-error CSS custom properties
            '--drift': p.drift,
            bottom: '-10px'
          }}
        />
      ))}
    </div>
  );
};

export default ForgeAtmosphere;

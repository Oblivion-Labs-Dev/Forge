import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const CursorGlow: React.FC = () => {
  const reduced = useReducedMotion();
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const glowX = useSpring(cursorX, { stiffness: 120, damping: 22, mass: 0.4 });
  const glowY = useSpring(cursorY, { stiffness: 120, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (reduced) return;

    const handleMove = (event: MouseEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [cursorX, cursorY, reduced]);

  if (reduced) return null;

  return (
    <motion.div
      className="cursor-glow"
      style={{ left: glowX, top: glowY }}
      aria-hidden
    />
  );
};

export default CursorGlow;

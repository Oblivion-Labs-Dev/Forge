import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface PointerOffset {
  x: number;
  y: number;
}

export function usePointerParallax(strength = 1): PointerOffset {
  const reduced = useReducedMotion();
  const [offset, setOffset] = useState<PointerOffset>({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    const handleMove = (event: MouseEvent) => {
      setOffset({
        x: (event.clientX / window.innerWidth - 0.5) * 2 * strength,
        y: (event.clientY / window.innerHeight - 0.5) * 2 * strength
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [reduced, strength]);

  return offset;
}

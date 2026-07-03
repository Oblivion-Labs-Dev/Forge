import { useCallback, useState } from 'react';

export interface SparkParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  dx: number;
  dy: number;
}

export interface ForgeToast {
  id: number;
  message: string;
}

let sparkId = 0;
let toastId = 0;

export function useForgeSparks() {
  const [particles, setParticles] = useState<SparkParticle[]>([]);
  const [toasts, setToasts] = useState<ForgeToast[]>([]);

  const burst = useCallback((x: number, y: number, color = '#ff7a18', count = 34) => {
    const batch: SparkParticle[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 40 + Math.random() * 140;
      return {
        id: ++sparkId,
        x,
        y,
        color,
        dx: Math.cos(angle) * radius,
        dy: Math.sin(angle) * radius
      };
    });
    setParticles((prev) => [...prev, ...batch]);
    window.setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !batch.some((b) => b.id === p.id)));
    }, 800);
  }, []);

  const toast = useCallback((message: string) => {
    const entry = { id: ++toastId, message };
    setToasts((prev) => [...prev, entry]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== entry.id));
    }, 2100);
  }, []);

  return { particles, toasts, burst, toast };
}

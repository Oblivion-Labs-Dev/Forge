import { useEffect, useRef } from 'react';
import { useForgeExperience } from '../../context/ForgeExperienceContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function drawStrike(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  intensity: number,
  alpha = 1
) {
  const radius = 36 + intensity * 48;
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

  gradient.addColorStop(0, `rgba(255, 230, 160, ${0.22 * alpha})`);
  gradient.addColorStop(0.35, `rgba(232, 106, 44, ${0.14 * alpha})`);
  gradient.addColorStop(0.7, `rgba(212, 168, 67, ${0.06 * alpha})`);
  gradient.addColorStop(1, 'rgba(232, 106, 44, 0)');

  context.globalCompositeOperation = 'lighter';
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = `rgba(255, 248, 210, ${0.12 * alpha})`;
  context.lineWidth = 1.2;
  context.beginPath();
  context.arc(x, y, radius * 0.35, 0, Math.PI * 2);
  context.stroke();
  context.globalCompositeOperation = 'source-over';
}

export const AnvilMemoryCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { strikes, replayIndex } = useForgeExperience();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    let fadeLoop: number | undefined;
    if (replayIndex == null) {
      fadeLoop = window.setInterval(() => {
        context.fillStyle = 'rgba(7, 7, 8, 0.035)';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }, 120);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (fadeLoop) window.clearInterval(fadeLoop);
    };
  }, [reduced, replayIndex]);

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    if (replayIndex != null) {
      context.fillStyle = 'rgba(7, 7, 8, 0.92)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      strikes.slice(0, replayIndex + 1).forEach((strike, index) => {
        drawStrike(context, strike.x, strike.y, strike.intensity, index === replayIndex ? 1.2 : 0.75);
      });
      return;
    }

    if (strikes.length === 0) return;
    const latest = strikes[strikes.length - 1];
    drawStrike(context, latest.x, latest.y, latest.intensity);
  }, [reduced, replayIndex, strikes]);

  if (reduced) return null;

  return (
    <canvas ref={canvasRef} className="anvil-memory-canvas" aria-hidden data-testid="anvil-memory" />
  );
};

export default AnvilMemoryCanvas;

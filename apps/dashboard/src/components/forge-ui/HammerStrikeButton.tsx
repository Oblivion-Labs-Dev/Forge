import React, { useState } from 'react';
import SparkBurst from './SparkBurst';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const HammerStrikeButton: React.FC<ButtonProps> = ({ children, onClick, ...props }) => {
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [isStriking, setIsStriking] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 350);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`molten-border ${isStriking ? 'hammer-impact-shake' : ''}`}
      style={{
        background: isStriking ? 'rgba(255, 61, 0, 0.15)' : 'var(--bg-iron)',
        borderColor: isStriking ? 'var(--accent-molten)' : 'rgba(255, 122, 24, 0.2)',
        color: '#fff',
        padding: '8px 16px',
        fontWeight: 600,
        fontSize: '0.85rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.1s ease',
        ...props.style
      }}
    >
      {isStriking && <span style={{ animation: 'rotateHammer 0.2s ease-out' }}>🔨</span>}
      {children}
      {clickPos && (
        <SparkBurst x={clickPos.x} y={clickPos.y} onComplete={() => setClickPos(null)} />
      )}
    </button>
  );
};
export default HammerStrikeButton;

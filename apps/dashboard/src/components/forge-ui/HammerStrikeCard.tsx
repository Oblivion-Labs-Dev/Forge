import React, { useState } from 'react';
import SparkBurst from './SparkBurst';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const HammerStrikeCard: React.FC<CardProps> = ({ children, onClick, ...props }) => {
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [isStriking, setIsStriking] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 350);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div
      {...props}
      onClick={handleClick}
      className={`molten-border ${isStriking ? 'hammer-impact-shake' : ''} ${props.className || ''}`}
      style={{
        position: 'relative',
        background: isStriking ? 'rgba(255, 61, 0, 0.05)' : 'var(--bg-secondary)',
        borderColor: isStriking ? 'var(--accent-molten)' : 'rgba(255, 122, 24, 0.15)',
        cursor: 'pointer',
        padding: '16px',
        ...props.style
      }}
    >
      {children}
      {clickPos && (
        <SparkBurst x={clickPos.x} y={clickPos.y} onComplete={() => setClickPos(null)} />
      )}
    </div>
  );
};
export default HammerStrikeCard;

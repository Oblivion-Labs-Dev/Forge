import React from 'react';

export const FireFlicker: React.FC<{ size?: number }> = ({ size = 60 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible', pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="fireGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff3d00" />
          <stop offset="50%" stopColor="#ff7a18" />
          <stop offset="100%" stopColor="#f5b942" />
        </linearGradient>
        <filter id="fireBlur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {/* Outer flame */}
      <path
        d="M 50,15 C 30,45 25,65 30,85 C 38,98 62,98 70,85 C 75,65 70,45 50,15 Z"
        fill="url(#fireGrad)"
        filter="url(#fireBlur)"
      >
        <animate
          attributeName="d"
          values="
            M 50,15 C 30,45 25,65 30,85 C 38,98 62,98 70,85 C 75,65 70,45 50,15 Z;
            M 50,12 C 28,48 22,62 28,88 C 36,99 64,99 72,88 C 78,62 72,48 50,12 Z;
            M 50,15 C 30,45 25,65 30,85 C 38,98 62,98 70,85 C 75,65 70,45 50,15 Z
          "
          dur="0.8s"
          repeatCount="indefinite"
        />
      </path>
      {/* Inner core flame */}
      <path
        d="M 50,35 C 38,55 35,70 38,82 C 43,90 57,90 62,82 C 65,70 62,55 50,35 Z"
        fill="#ffb000"
        filter="url(#fireBlur)"
      >
        <animate
          attributeName="d"
          values="
            M 50,35 C 38,55 35,70 38,82 C 43,90 57,90 62,82 C 65,70 62,55 50,35 Z;
            M 50,32 C 36,58 32,68 36,84 C 41,92 59,92 64,84 C 68,68 64,58 50,32 Z;
            M 50,35 C 38,55 35,70 38,82 C 43,90 57,90 62,82 C 65,70 62,55 50,35 Z
          "
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};
export default FireFlicker;

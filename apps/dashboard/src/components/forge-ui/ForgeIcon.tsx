import React from 'react';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export const ForgeIcon: React.FC<IconProps> = ({ name, size = 24, color = 'var(--accent-ember)' }) => {
  const getSvgContent = () => {
    switch (name) {
      case 'bellows':
        return (
          <path
            d="M4 12v4l8 4 8-4v-4l-8-4-8 4zm0 4l8 4 8-4M12 4v4"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'anvil':
        return (
          <path
            d="M4 6h16v3c-2 1-4 2-4 5v4H8v-4c0-3-2-4-4-5V6zm2 14h12"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'tsup':
      case 'builder':
      case 'fire':
        return (
          <path
            d="M12 2C9 6 7 9 7 12c0 2.8 2.2 5 5 5s5-2.2 5-5c0-3-2-6-5-10zM9 14.5c.5.5 1.5 1 3 1s2.5-.5 3-1"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'eslint':
      case 'inspector':
      case 'lens':
        return (
          <circle
            cx="12"
            cy="12"
            r="8"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        );
      case 'gateway':
      case 'beacon':
        return (
          <path
            d="M12 2v6m0 8v6M2 12h6m8 0h6"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      default:
        return (
          <path
            d="M12 2v20M2 12h20"
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        );
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {getSvgContent()}
    </svg>
  );
};
export default ForgeIcon;

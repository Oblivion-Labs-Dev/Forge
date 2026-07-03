import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', glow = false, ...props }) => {
  return (
    <div
      className={`backdrop-blur-md bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 shadow-xl transition-all duration-300 ${
        glow ? 'shadow-amber-500/10 border-amber-500/30' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
export default GlassPanel;

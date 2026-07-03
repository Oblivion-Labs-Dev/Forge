import React, { type CSSProperties, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  testId?: string;
}

export const LivingPanel: React.FC<Props> = ({ children, className = '', style, testId }) => (
  <section
    className={`panel ${className}`.trim()}
    style={style}
    data-testid={testId}
    onPointerMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
    }}
  >
    {children}
  </section>
);

export default LivingPanel;

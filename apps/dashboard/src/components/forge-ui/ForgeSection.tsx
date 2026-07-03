import React from 'react';

interface ForgeSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'hero';
  className?: string;
  testId?: string;
}

export const ForgeSection: React.FC<ForgeSectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  variant = 'default',
  className = '',
  testId
}) => {
  const isHero = variant === 'hero';

  return (
    <section
      data-testid={testId}
      className={`forge-section ${isHero ? 'forge-section-hero' : ''} ${className}`.trim()}
    >
      <header className="forge-section-header">
        <div className="forge-section-heading">
          {icon && <span className="forge-section-icon">{icon}</span>}
          <div>
            <h2 className="forge-section-title">{title}</h2>
            {subtitle && <p className="forge-section-subtitle">{subtitle}</p>}
          </div>
        </div>
      </header>
      <div className="forge-section-body">{children}</div>
    </section>
  );
};

export default ForgeSection;

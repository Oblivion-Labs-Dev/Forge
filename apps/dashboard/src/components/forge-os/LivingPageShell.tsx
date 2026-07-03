import React, { type ReactNode } from 'react';
import LivingPanel from './LivingPanel';

interface Props {
  title: string;
  subtitle: string;
  testId: string;
  children: ReactNode;
  layout?: 'single' | 'split' | 'grid';
  badge?: string;
  badgeColor?: string;
}

export const LivingPageShell: React.FC<Props> = ({
  title,
  subtitle,
  testId,
  children,
  layout = 'single',
  badge,
  badgeColor = 'var(--green)'
}) => (
  <div className={`living-page living-page-${layout}`} data-testid={testId}>
    <LivingPanel className="living-page-header">
      <div className="topbar">
        <div>
          <div className="title">{title}</div>
          <div className="sub">{subtitle}</div>
        </div>
        {badge && (
          <span className="badge" style={{ ['--c' as string]: badgeColor }}>
            {badge}
          </span>
        )}
      </div>
    </LivingPanel>
    <div className="living-page-body">{children}</div>
  </div>
);

export default LivingPageShell;

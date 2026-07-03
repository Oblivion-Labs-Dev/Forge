import type { ReactNode } from 'react';
import ParallaxPanel from './ParallaxPanel';
import { SECTION_STATUS, type SectionStatus } from '../../lib/sectionStatus';

interface StatusPageShellProps {
  title: string;
  subtitle: string;
  status: SectionStatus;
  testId: string;
  children: ReactNode;
}

export const StatusPageShell: React.FC<StatusPageShellProps> = ({
  title,
  subtitle,
  status,
  testId,
  children
}) => {
  return (
    <div className="status-page" data-testid={testId}>
      <ParallaxPanel
        className="live-panel status-page-hero"
        status={status}
        sectionTitle={title}
        sectionSubtitle={subtitle}
        tilt={false}
        lift={false}
        spotlight={false}
      >
        <span className={`status-page-badge ${SECTION_STATUS[status].className}`}>
          <span className="section-status-swatch" />
          {SECTION_STATUS[status].label}
        </span>
      </ParallaxPanel>
      <div className="status-page-body">{children}</div>
    </div>
  );
};

export default StatusPageShell;

import { SECTION_STATUS, type SectionStatus } from '../../lib/sectionStatus';

interface SectionCardHeaderProps {
  title: string;
  subtitle?: string;
  status: SectionStatus;
}

export const SectionCardHeader: React.FC<SectionCardHeaderProps> = ({ title, subtitle, status }) => {
  const meta = SECTION_STATUS[status];

  return (
    <div className="section-card-header">
      <div className="section-card-header-copy">
        <p className="live-panel-label">{title}</p>
        {subtitle && <p className="section-card-subtitle">{subtitle}</p>}
      </div>
      <span
        className={`section-status-badge ${meta.className}`}
        data-testid={`section-status-${status}`}
        title={meta.hint}
      >
        <span className="section-status-swatch" />
        {meta.label}
      </span>
    </div>
  );
};

export default SectionCardHeader;

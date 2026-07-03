import { SECTION_STATUS, type SectionStatus } from '../../lib/sectionStatus';

interface SectionStatusLegendProps {
  compact?: boolean;
}

export const SectionStatusLegend: React.FC<SectionStatusLegendProps> = ({ compact = false }) => {
  const items: SectionStatus[] = ['done', 'active', 'queued', 'idle'];

  return (
    <div
      className={`section-status-legend ${compact ? 'section-status-legend-compact' : ''}`}
      data-testid="section-status-legend"
      aria-label="Section status color guide"
    >
      {!compact && <span className="section-status-legend-title">Status guide</span>}
      <div className="section-status-legend-items">
        {items.map((status) => (
          <span key={status} className={`section-status-legend-item ${SECTION_STATUS[status].className}`}>
            <span className="section-status-swatch" />
            <span className="section-status-legend-copy">
              <strong>{SECTION_STATUS[status].label}</strong>
              {!compact && <span>{SECTION_STATUS[status].hint}</span>}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SectionStatusLegend;

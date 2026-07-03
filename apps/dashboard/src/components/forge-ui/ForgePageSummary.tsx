import { SECTION_STATUS, summarizeStatuses, type SectionStatus } from '../../lib/sectionStatus';

interface ForgePageSummaryProps {
  statuses: Array<{ name: string; status: SectionStatus }>;
}

export const ForgePageSummary: React.FC<ForgePageSummaryProps> = ({ statuses }) => {
  const summary = summarizeStatuses(statuses.map((entry) => entry.status));

  return (
    <div className="forge-page-summary" data-testid="forge-page-summary">
      <div className="forge-page-summary-line">{summary.line}</div>
      <div className="forge-page-summary-chips">
        {(['queued', 'active', 'done', 'idle'] as SectionStatus[]).map((status) =>
          summary[status] > 0 ? (
            <span key={status} className={`forge-page-summary-chip ${SECTION_STATUS[status].className}`}>
              <span className="section-status-swatch" />
              {summary[status]} {SECTION_STATUS[status].label.toLowerCase()}
            </span>
          ) : null
        )}
      </div>
    </div>
  );
};

export default ForgePageSummary;

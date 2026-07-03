import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useForgeExperience } from '../../context/ForgeExperienceContext';
import type { SectionStatus } from '../../lib/sectionStatus';

interface ExportSessionButtonProps {
  progress: number;
  successRate: number;
  summaryLine: string;
  sectionStatuses: Array<{ name: string; status: SectionStatus }>;
}

export const ExportSessionButton: React.FC<ExportSessionButtonProps> = ({
  progress,
  successRate,
  summaryLine,
  sectionStatuses
}) => {
  const { copySessionReport, sessionSig } = useForgeExperience();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copySessionReport({ progress, successRate, summaryLine, sectionStatuses });
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      className="forge-export-btn"
      data-testid="export-session-btn"
      onClick={handleCopy}
      title={`Copy shift report (${sessionSig})`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied shift report' : 'Export shift report'}
    </button>
  );
};

export default ExportSessionButton;

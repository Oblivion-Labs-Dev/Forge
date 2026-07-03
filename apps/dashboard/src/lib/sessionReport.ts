import type { ForgeTemper } from '../context/ForgeExperienceContext';
import type { SectionStatus } from './sectionStatus';
import { SECTION_STATUS } from './sectionStatus';

export interface SessionReportInput {
  heat: number;
  temper: ForgeTemper;
  strikeCount: number;
  sessionSig: string;
  progress: number;
  successRate: number;
  summaryLine: string;
  sectionStatuses: Array<{ name: string; status: SectionStatus }>;
}

export function buildSessionSig(strikes: Array<{ x: number; y: number }>): string {
  if (strikes.length === 0) return 'cold-anvil';
  const code = strikes.slice(-8).reduce((acc, strike) => acc + Math.round(strike.x + strike.y), 0);
  return `#${(code % 4096).toString(16).padStart(3, '0')}`;
}

export function buildSessionReport(input: SessionReportInput): string {
  const lines = [
    'Forge Shift Report',
    '==================',
    `Temper: ${input.temper} (${Math.round(input.heat)}°)`,
    `Signature: ${input.sessionSig}`,
    `Strikes on anvil: ${input.strikeCount}`,
    `Workpiece progress: ${input.progress}%`,
    `Success rate: ${(input.successRate * 100).toFixed(1)}%`,
    '',
    input.summaryLine,
    '',
    'Section status:',
    ...input.sectionStatuses.map(
      (section) => `- ${section.name}: ${SECTION_STATUS[section.status].label}`
    ),
    '',
    `Generated ${new Date().toLocaleString()}`
  ];

  return lines.join('\n');
}

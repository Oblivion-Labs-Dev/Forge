export type SectionStatus = 'done' | 'active' | 'queued' | 'idle';

export interface SectionStatusMeta {
  label: string;
  hint: string;
  className: string;
}

export const SECTION_STATUS: Record<SectionStatus, SectionStatusMeta> = {
  done: {
    label: 'Complete',
    hint: 'No action needed',
    className: 'section-status-done'
  },
  active: {
    label: 'In progress',
    hint: 'Work happening now',
    className: 'section-status-active'
  },
  queued: {
    label: 'Needs work',
    hint: 'Up next or waiting',
    className: 'section-status-queued'
  },
  idle: {
    label: 'Idle',
    hint: 'Not started yet',
    className: 'section-status-idle'
  }
};

export type CardStatus = SectionStatus;

export interface StatusSummary {
  done: number;
  active: number;
  queued: number;
  idle: number;
  line: string;
}

const STALE_PULSE_MS = 5 * 60 * 1000;

export function resolveBlueprintStatus(progress: number): SectionStatus {
  if (progress >= 100) return 'done';
  if (progress >= 35) return 'active';
  return 'queued';
}

export function resolvePipelineStatus(progress: number, activeArtisans: number): SectionStatus {
  if (progress >= 100) return 'done';
  if (activeArtisans > 0) return 'active';
  if (progress > 0) return 'queued';
  return 'idle';
}

export function resolveTeamStatus(activeCount: number, total: number): SectionStatus {
  if (activeCount === 0) return 'queued';
  if (activeCount >= total - 1) return 'done';
  return 'active';
}

export function resolveHealthStatus(successRate: number): SectionStatus {
  if (successRate >= 0.92) return 'done';
  if (successRate >= 0.85) return 'active';
  return 'queued';
}

export function resolveActivityStatus(
  eventCount: number,
  latestTimestamp?: string,
  staleMs = STALE_PULSE_MS
): SectionStatus {
  if (eventCount === 0) return 'queued';
  if (!latestTimestamp) return 'done';

  const age = Date.now() - new Date(latestTimestamp).getTime();
  if (Number.isNaN(age) || age > staleMs) return 'queued';
  return 'done';
}

export function resolveArtisanCardStatus(
  artisanStatus: 'active' | 'idle',
  stepState: 'idle' | 'active' | 'done' | 'queued'
): CardStatus {
  if (stepState === 'done') return 'done';
  if (artisanStatus === 'active' || stepState === 'active') return 'active';
  if (stepState === 'queued') return 'queued';
  return 'idle';
}

export function resolveMetricStatus(
  metric: 'active' | 'success' | 'strikes',
  values: { activeCount: number; successRate: number; strikeCount: number }
): CardStatus {
  if (metric === 'active') {
    if (values.activeCount >= 3) return 'done';
    if (values.activeCount >= 1) return 'active';
    return 'queued';
  }

  if (metric === 'success') {
    if (values.successRate >= 0.92) return 'done';
    if (values.successRate >= 0.85) return 'active';
    return 'queued';
  }

  if (values.strikeCount >= 100) return 'done';
  if (values.strikeCount >= 40) return 'active';
  return 'idle';
}

export function summarizeStatuses(statuses: SectionStatus[]): StatusSummary {
  const counts: StatusSummary = { done: 0, active: 0, queued: 0, idle: 0, line: '' };

  for (const status of statuses) {
    counts[status] += 1;
  }

  const parts: string[] = [];
  if (counts.queued) parts.push(`${counts.queued} need work`);
  if (counts.active) parts.push(`${counts.active} in progress`);
  if (counts.done) parts.push(`${counts.done} complete`);
  if (counts.idle) parts.push(`${counts.idle} idle`);

  counts.line = parts.length ? parts.join(' · ') : 'All sections steady';
  return counts;
}

export function shouldShowSection(status: SectionStatus, showOnlyNeedsWork: boolean): boolean {
  if (!showOnlyNeedsWork) return true;
  return status === 'queued' || status === 'active';
}

export function mapPackageStatus(status: string): SectionStatus {
  if (['stable', 'compiled', 'success', 'complete', 'passed'].includes(status)) return 'done';
  if (['beta', 'pending', 'active', 'running', 'info'].includes(status)) return 'active';
  if (['failed', 'error', 'warn'].includes(status)) return 'queued';
  return 'idle';
}

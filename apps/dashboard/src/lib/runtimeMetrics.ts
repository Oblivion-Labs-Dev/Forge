import type { ForgeRuntimeSnapshot, HammerStrikeEvent } from './forge-client/types';

const WORKPIECE_PROGRESS: Record<string, number> = {
  idle: 8,
  queued: 18,
  active: 42,
  thinking: 48,
  'running-tool': 58,
  waiting: 52,
  reviewing: 72,
  passed: 88,
  failed: 38,
  retrying: 28,
  complete: 100
};

export interface RuntimeMetrics {
  progress: number;
  successRate: number;
  strikeCount: number;
  activeArtisanCount: number;
  artisans: Array<{ name: string; status: 'active' | 'idle' }>;
}

export function deriveProgress(snapshot: ForgeRuntimeSnapshot | null): number {
  if (!snapshot?.workpieces.length) return 0;

  const active =
    snapshot.workpieces.find((w) => w.id === snapshot.activeWorkpieceId) ??
    snapshot.workpieces.find((w) => w.status === 'active' || w.status === 'running-tool');

  if (active) {
    return WORKPIECE_PROGRESS[active.status] ?? 35;
  }

  const finished = snapshot.workpieces.filter((w) =>
    ['complete', 'passed'].includes(w.status)
  ).length;

  return Math.round((finished / snapshot.workpieces.length) * 100);
}

export function deriveSuccessRate(snapshot: ForgeRuntimeSnapshot | null, fallback = 0.94): number {
  if (!snapshot?.artisans.length) return fallback;
  const total = snapshot.artisans.reduce((sum, artisan) => sum + artisan.successRate, 0);
  return total / snapshot.artisans.length;
}

export function buildArtisanRows(snapshot: ForgeRuntimeSnapshot | null) {
  const roster = ['PlannerArtisan', 'BuilderArtisan', 'ReviewerArtisan', 'ResearchArtisan'];

  return roster.map((name) => {
    const artisan = snapshot?.artisans.find((a) => a.name === name);
    return {
      name,
      status: (artisan?.status === 'active' ? 'active' : 'idle') as 'active' | 'idle'
    };
  });
}

export function deriveRuntimeMetrics(
  snapshot: ForgeRuntimeSnapshot | null,
  events: HammerStrikeEvent[],
  sessionStrikeCount = 0
): RuntimeMetrics {
  const artisans = buildArtisanRows(snapshot);

  return {
    progress: deriveProgress(snapshot),
    successRate: deriveSuccessRate(snapshot),
    strikeCount: Math.max(events.length, sessionStrikeCount),
    activeArtisanCount: artisans.filter((a) => a.status === 'active').length,
    artisans
  };
}

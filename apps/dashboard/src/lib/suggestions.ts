import { ARTISAN_TO_STEP, STEP_LABELS, SECTION_IDS, type PipelineStepId } from './forgeMappings';
import {
  resolveActivityStatus,
  resolveBlueprintStatus,
  resolveHealthStatus,
  resolvePipelineStatus,
  resolveTeamStatus,
  type SectionStatus
} from './sectionStatus';

export type SuggestionTarget =
  | { type: 'section'; id: string }
  | { type: 'step'; id: PipelineStepId }
  | { type: 'artisan'; name: string };

export interface ForgeSuggestion {
  id: string;
  status: SectionStatus;
  title: string;
  action: string;
  area: string;
  target: SuggestionTarget;
}

export interface SuggestionInput {
  progress: number;
  successRate: number;
  eventCount: number;
  latestEventTimestamp?: string;
  artisans: Array<{ name: string; status: 'active' | 'idle' }>;
  focusedStep: string | null;
}

export function buildForgeSuggestions(input: SuggestionInput): ForgeSuggestion[] {
  const suggestions: ForgeSuggestion[] = [];
  const activeCount = input.artisans.filter((a) => a.status === 'active').length;

  const blueprintStatus = resolveBlueprintStatus(input.progress);
  const pipelineStatus = resolvePipelineStatus(input.progress, activeCount);
  const teamStatus = resolveTeamStatus(activeCount, input.artisans.length);
  const healthStatus = resolveHealthStatus(input.successRate);
  const activityStatus = resolveActivityStatus(input.eventCount, input.latestEventTimestamp);

  if (blueprintStatus === 'active') {
    suggestions.push({
      id: 'blueprint-push',
      status: 'active',
      area: 'Workpiece',
      title: 'Keep momentum on the current plan',
      action: `You're at ${input.progress}%. Stay on the active pipeline stage until the next gate opens.`,
      target: { type: 'section', id: SECTION_IDS.blueprint }
    });
  } else if (blueprintStatus === 'queued') {
    suggestions.push({
      id: 'blueprint-start',
      status: 'queued',
      area: 'Workpiece',
      title: 'Kick off the blueprint',
      action: 'Progress is still low. Activate PlannerArtisan and define the first workpiece.',
      target: { type: 'step', id: 'planner' }
    });
  }

  const idleWhileWorkQueued = input.artisans.filter(
    (a) => a.status === 'idle' && ['ReviewerArtisan', 'ResearchArtisan'].includes(a.name)
  );

  if (pipelineStatus === 'active' && idleWhileWorkQueued.length > 0) {
    const next = idleWhileWorkQueued[0];
    suggestions.push({
      id: 'pipeline-handoff',
      status: 'queued',
      area: 'Pipeline',
      title: 'Prepare the next handoff',
      action: `${next.name.replace('Artisan', '')} is idle while downstream stages may need coverage soon.`,
      target: { type: 'artisan', name: next.name }
    });
  }

  if (teamStatus === 'active' && activeCount < input.artisans.length) {
    suggestions.push({
      id: 'team-balance',
      status: 'active',
      area: 'Team',
      title: 'Balance artisan load',
      action: `${activeCount} of ${input.artisans.length} artisans are active. Consider waking idle roles if work is queued.`,
      target: { type: 'section', id: SECTION_IDS.artisans }
    });
  } else if (teamStatus === 'queued') {
    suggestions.push({
      id: 'team-wake',
      status: 'queued',
      area: 'Team',
      title: 'No artisans are striking',
      action: 'Assign at least one artisan to move the forge out of idle.',
      target: { type: 'section', id: SECTION_IDS.artisans }
    });
  }

  if (healthStatus === 'queued') {
    suggestions.push({
      id: 'health-fix',
      status: 'queued',
      area: 'Health',
      title: 'Success rate needs attention',
      action: `Success is ${(input.successRate * 100).toFixed(0)}%. Review recent failures before shipping.`,
      target: { type: 'section', id: SECTION_IDS.health }
    });
  } else if (healthStatus === 'done') {
    suggestions.push({
      id: 'health-good',
      status: 'done',
      area: 'Health',
      title: 'System health is solid',
      action: 'Metrics look good. No corrective action needed right now.',
      target: { type: 'section', id: SECTION_IDS.health }
    });
  }

  if (activityStatus === 'queued') {
    suggestions.push({
      id: 'activity-stale',
      status: 'queued',
      area: 'Pulse',
      title: input.latestEventTimestamp ? 'Pulse feed looks stale' : 'No recent hammer strikes',
      action: 'Trigger a run or inspect the runtime connection — the feed looks quiet.',
      target: { type: 'section', id: SECTION_IDS.activity }
    });
  }

  if (input.focusedStep) {
    suggestions.push({
      id: 'focus-hint',
      status: 'active',
      area: 'Focus',
      title: `You're focused on ${STEP_LABELS[input.focusedStep] ?? input.focusedStep}`,
      action: 'Use this view to inspect one stage without losing sight of the full pipeline.',
      target: { type: 'step', id: input.focusedStep as PipelineStepId }
    });
  }

  const queuedArtisan = input.artisans.find((artisan) => {
    if (artisan.status === 'active') return false;
    const step = ARTISAN_TO_STEP[artisan.name];
    return step === 'reviewer' || step === 'ship';
  });

  if (queuedArtisan && suggestions.length < 4) {
    suggestions.push({
      id: `queue-${queuedArtisan.name}`,
      status: 'queued',
      area: 'Pipeline',
      title: `${queuedArtisan.name.replace('Artisan', '')} may need work next`,
      action: 'Gold markers show queued stages — click this card to jump there.',
      target: { type: 'artisan', name: queuedArtisan.name }
    });
  }

  const priority: Record<SectionStatus, number> = {
    queued: 0,
    active: 1,
    idle: 2,
    done: 3
  };

  return suggestions.sort((a, b) => priority[a.status] - priority[b.status]).slice(0, 4);
}

export function resolveSuggestionPanelStatus(suggestions: ForgeSuggestion[]): SectionStatus {
  if (suggestions.some((s) => s.status === 'queued')) return 'queued';
  if (suggestions.some((s) => s.status === 'active')) return 'active';
  if (suggestions.every((s) => s.status === 'done')) return 'done';
  return 'idle';
}

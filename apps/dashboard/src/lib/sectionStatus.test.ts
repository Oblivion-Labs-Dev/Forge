import { describe, expect, it } from 'vitest';
import {
  resolveActivityStatus,
  resolveBlueprintStatus,
  resolveHealthStatus,
  shouldShowSection,
  summarizeStatuses
} from './sectionStatus';
import { buildForgeSuggestions } from './suggestions';
import { deriveProgress, deriveSuccessRate } from './runtimeMetrics';
import type { ForgeRuntimeSnapshot } from './forge-client/types';

describe('sectionStatus', () => {
  it('marks blueprint as active when progress is mid-range', () => {
    expect(resolveBlueprintStatus(68)).toBe('active');
    expect(resolveBlueprintStatus(100)).toBe('done');
    expect(resolveBlueprintStatus(10)).toBe('queued');
  });

  it('marks stale activity as queued', () => {
    const stale = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    expect(resolveActivityStatus(3, stale)).toBe('queued');
    expect(resolveActivityStatus(3, new Date().toISOString())).toBe('done');
  });

  it('summarizes section counts into a readable line', () => {
    const summary = summarizeStatuses(['queued', 'active', 'done', 'done', 'idle']);
    expect(summary.queued).toBe(1);
    expect(summary.active).toBe(1);
    expect(summary.done).toBe(2);
    expect(summary.line).toContain('need work');
  });

  it('filters done sections when needs-work mode is enabled', () => {
    expect(shouldShowSection('done', true)).toBe(false);
    expect(shouldShowSection('queued', true)).toBe(true);
  });

  it('flags low success rates as queued health', () => {
    expect(resolveHealthStatus(0.95)).toBe('done');
    expect(resolveHealthStatus(0.8)).toBe('queued');
  });
});

describe('runtimeMetrics', () => {
  it('derives progress from active workpiece status', () => {
    const snapshot: ForgeRuntimeSnapshot = {
      status: 'running',
      activeWorkpieceId: 'wp-1',
      artisans: [],
      workpieces: [
        {
          id: 'wp-1',
          name: 'Plan',
          artisanName: 'PlannerArtisan',
          status: 'running-tool'
        }
      ]
    };

    expect(deriveProgress(snapshot)).toBe(58);
  });

  it('derives average artisan success rate', () => {
    const snapshot: ForgeRuntimeSnapshot = {
      status: 'running',
      artisans: [
        {
          name: 'PlannerArtisan',
          craft: 'Planning',
          purpose: 'Plan',
          status: 'active',
          successRate: 0.9,
          tools: [],
          rulesLoaded: []
        },
        {
          name: 'BuilderArtisan',
          craft: 'Build',
          purpose: 'Build',
          status: 'idle',
          successRate: 0.8,
          tools: [],
          rulesLoaded: []
        }
      ],
      workpieces: []
    };

    expect(deriveSuccessRate(snapshot)).toBeCloseTo(0.85);
  });
});

describe('suggestions', () => {
  it('prioritizes queued suggestions first', () => {
    const suggestions = buildForgeSuggestions({
      progress: 12,
      successRate: 0.7,
      eventCount: 0,
      artisans: [
        { name: 'PlannerArtisan', status: 'idle' },
        { name: 'BuilderArtisan', status: 'idle' },
        { name: 'ReviewerArtisan', status: 'idle' },
        { name: 'ResearchArtisan', status: 'idle' }
      ],
      focusedStep: null
    });

    expect(suggestions[0].status).toBe('queued');
    expect(suggestions[0].target.type).toBeDefined();
  });
});

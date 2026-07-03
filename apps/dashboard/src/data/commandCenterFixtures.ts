import type { ForgeRuntimeSnapshot, HammerStrikeEvent } from '../lib/forge-client/types';

export const STATIC_CLOCK = '10:24:38 PM';
export const STATIC_DATE = 'May 22, 2025';

export const STATIC_TIMELINE_EVENTS: HammerStrikeEvent[] = [
  {
    id: 'evt-1',
    timestamp: '2025-05-22T22:24:15.000Z',
    type: 'blueprint.plan.generated',
    source: 'PlannerArtisan',
    target: 'forge/plan',
    status: 'success',
    summary: 'Generated 4-step implementation plan'
  },
  {
    id: 'evt-2',
    timestamp: '2025-05-22T22:23:45.000Z',
    type: 'instrument.used',
    source: 'BuilderArtisan',
    target: 'forge/engine/core.ts',
    status: 'info',
    summary: 'Compiled forge/engine/core.ts'
  },
  {
    id: 'evt-3',
    timestamp: '2025-05-22T22:23:12.000Z',
    type: 'instrument.research',
    source: 'ResearchArtisan',
    target: 'docs/external',
    status: 'info',
    summary: 'Fetched 12 documentation sources'
  },
  {
    id: 'evt-4',
    timestamp: '2025-05-22T22:22:58.000Z',
    type: 'inspection.passed',
    source: 'ReviewerArtisan',
    target: 'TODO.md',
    status: 'success',
    summary: 'Verified TODO.md structure'
  },
  {
    id: 'evt-5',
    timestamp: '2025-05-22T22:22:30.000Z',
    type: 'chronicle.updated',
    source: 'Chronicle',
    target: 'archive/run',
    status: 'info',
    summary: 'Run snapshot archived'
  }
];

export function getStaticTimelineEvents(): HammerStrikeEvent[] {
  return STATIC_TIMELINE_EVENTS.map((event, index) => ({
    ...event,
    timestamp: new Date(Date.now() - index * 45000).toISOString()
  }));
}

export const STATIC_FORGE_LOGS = [
  { time: '10:24:32', icon: '🔨', message: 'BuilderArtisan used instrument: tsup' },
  { time: '10:24:28', icon: '📄', message: 'File written: forge/engine/core.ts (142 lines)' },
  { time: '10:24:15', icon: '📋', message: 'PlannerArtisan created 4 workpieces' },
  { time: '10:23:58', icon: '✅', message: 'ReviewerArtisan verified TODO.md structure' },
  { time: '10:23:42', icon: '🔍', message: 'ResearchArtisan fetched 12 documentation sources' }
];

export const STATIC_SNAPSHOT: ForgeRuntimeSnapshot = {
  status: 'running',
  activeWorkpieceId: 'wp-1',
  artisans: [
    {
      name: 'PlannerArtisan',
      craft: 'Planning',
      purpose: 'Design goals and objectives',
      status: 'active',
      successRate: 0.95,
      tools: ['bellows', 'chronicle'],
      rulesLoaded: ['naming.md', 'common.md']
    },
    {
      name: 'BuilderArtisan',
      craft: 'Building',
      purpose: 'Compile code and bundle assets',
      status: 'active',
      successRate: 0.92,
      tools: ['anvil', 'tsup'],
      rulesLoaded: ['common.md', 'forge.md']
    },
    {
      name: 'ReviewerArtisan',
      craft: 'Reviewing',
      purpose: 'Scan syntax and formatting',
      status: 'idle',
      successRate: 0.98,
      tools: ['inspector', 'eslint'],
      rulesLoaded: ['architecture.md']
    },
    {
      name: 'ResearchArtisan',
      craft: 'Researching',
      purpose: 'Gather web documents',
      status: 'idle',
      successRate: 0.9,
      tools: ['gateway'],
      rulesLoaded: ['common.md']
    }
  ],
  workpieces: [
    {
      id: 'wp-1',
      name: 'Implement Dark Mode',
      artisanName: 'PlannerArtisan',
      status: 'active',
      toolUsed: 'bellows',
      duration: 12,
      retryCount: 0,
      input: 'Improve UI with dark theme support',
      output: 'Workspace layout designed',
      log: STATIC_FORGE_LOGS.map((l) => l.message)
    }
  ]
};

export function isStaticDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('static') === '1';
}

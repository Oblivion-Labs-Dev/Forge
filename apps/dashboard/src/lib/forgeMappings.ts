export const PIPELINE_STEPS = [
  { id: 'blueprint', label: 'Blueprint', match: null },
  { id: 'planner', label: 'Plan', match: 'PlannerArtisan' },
  { id: 'builder', label: 'Build', match: 'BuilderArtisan' },
  { id: 'reviewer', label: 'Review', match: 'ReviewerArtisan' },
  { id: 'ship', label: 'Ship', match: 'ResearchArtisan' }
] as const;

export type PipelineStepId = (typeof PIPELINE_STEPS)[number]['id'];

export const ARTISAN_TO_STEP: Record<string, PipelineStepId> = {
  PlannerArtisan: 'planner',
  BuilderArtisan: 'builder',
  ReviewerArtisan: 'reviewer',
  ResearchArtisan: 'ship'
};

export const STEP_TO_ARTISAN: Record<PipelineStepId, string> = {
  blueprint: 'PlannerArtisan',
  planner: 'PlannerArtisan',
  builder: 'BuilderArtisan',
  reviewer: 'ReviewerArtisan',
  ship: 'ResearchArtisan'
};

export const STEP_LABELS: Record<string, string> = Object.fromEntries(
  PIPELINE_STEPS.map((step) => [step.id, step.label])
);

export const SECTION_IDS = {
  blueprint: 'section-blueprint',
  flow: 'section-flow',
  suggestions: 'section-suggestions',
  artisans: 'section-artisans',
  health: 'section-health',
  activity: 'section-activity'
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export const KEYBOARD_STEP_IDS: PipelineStepId[] = ['blueprint', 'planner', 'builder', 'reviewer', 'ship'];

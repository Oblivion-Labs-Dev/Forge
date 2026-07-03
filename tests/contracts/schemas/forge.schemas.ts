import { z } from 'zod';

export const HammerStrikeEventSchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().datetime(),
  type: z.string().min(1),
  source: z.string().min(1),
  target: z.string().optional(),
  status: z.enum(['info', 'success', 'warn', 'error']),
  summary: z.string().min(1),
  details: z.string().optional(),
  relatedArtifact: z.string().optional(),
  message: z.string().optional()
});

export const ArtisanStateSchema = z.object({
  name: z.string().min(1),
  craft: z.string(),
  purpose: z.string(),
  status: z.enum(['idle', 'active']),
  successRate: z.number().min(0).max(1),
  tools: z.array(z.string()),
  rulesLoaded: z.array(z.string()),
  currentTask: z.string().optional()
});

export const WorkpieceStateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  artisanName: z.string().min(1),
  status: z.enum([
    'idle', 'queued', 'active', 'thinking', 'running-tool',
    'waiting', 'reviewing', 'passed', 'failed', 'retrying', 'complete'
  ]),
  toolUsed: z.string().optional(),
  duration: z.number().optional(),
  retryCount: z.number().optional(),
  input: z.string().optional(),
  output: z.string().optional(),
  log: z.array(z.string()).optional()
});

export const ForgeRuntimeSnapshotSchema = z.object({
  status: z.enum(['idle', 'running', 'completed', 'failed']),
  workpieces: z.array(WorkpieceStateSchema),
  artisans: z.array(ArtisanStateSchema),
  activeWorkpieceId: z.string().optional()
});

export type HammerStrikeEventDTO = z.infer<typeof HammerStrikeEventSchema>;
export type ForgeRuntimeSnapshotDTO = z.infer<typeof ForgeRuntimeSnapshotSchema>;

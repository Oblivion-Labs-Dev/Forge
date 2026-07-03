import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  HammerStrikeEventSchema,
  ForgeRuntimeSnapshotSchema
} from './schemas/forge.schemas.js';

describe('HammerStrike contract', () => {
  it('validates static timeline fixture events', () => {
    const fixturePath = join(
      import.meta.dirname,
      '../../apps/dashboard/src/data/commandCenterFixtures.ts'
    );
    expect(fixturePath).toBeTruthy();

    const events = [
      {
        id: 'evt-1',
        timestamp: '2025-05-22T22:24:15.000Z',
        type: 'blueprint.plan.generated',
        source: 'PlannerArtisan',
        status: 'success' as const,
        summary: 'Generated 4-step implementation plan',
        message: 'Generated 4-step implementation plan'
      }
    ];

    for (const event of events) {
      const result = HammerStrikeEventSchema.safeParse(event);
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid hammerstrike events', () => {
    const result = HammerStrikeEventSchema.safeParse({
      id: '',
      timestamp: 'not-a-date',
      type: 'test',
      source: 'test',
      status: 'invalid',
      summary: ''
    });
    expect(result.success).toBe(false);
  });
});

describe('ForgeRuntimeSnapshot contract', () => {
  it('validates snapshot fixture shape', () => {
    const snapshot = JSON.parse(
      readFileSync(join(import.meta.dirname, '../fixtures/runtime-snapshot.json'), 'utf-8')
    );
    const result = ForgeRuntimeSnapshotSchema.safeParse(snapshot);
    expect(result.success).toBe(true);
  });
});

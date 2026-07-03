import { describe, it, expect } from 'vitest';
import { ForgeEngine } from '@forge/engine';

describe('ForgeEngine', () => {
  it('starts inactive', () => {
    const engine = new ForgeEngine();
    expect(engine.isActive()).toBe(false);
  });

  it('ignites and stops', async () => {
    const engine = new ForgeEngine();
    await engine.ignite();
    expect(engine.isActive()).toBe(true);
    await engine.stop();
    expect(engine.isActive()).toBe(false);
  });
});

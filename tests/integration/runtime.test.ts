import { describe, it, expect } from 'vitest';
import { ForgeEngine } from '@forge/engine';

describe('Forge runtime integration', () => {
  it('supports multiple independent engine instances', async () => {
    const primary = new ForgeEngine();
    const secondary = new ForgeEngine();

    await primary.ignite();
    expect(primary.isActive()).toBe(true);
    expect(secondary.isActive()).toBe(false);

    await primary.stop();
    await secondary.ignite();
    expect(primary.isActive()).toBe(false);
    expect(secondary.isActive()).toBe(true);
  });

  it('handles ignite/stop lifecycle repeatedly', async () => {
    const engine = new ForgeEngine();
    for (let i = 0; i < 3; i += 1) {
      await engine.ignite();
      expect(engine.isActive()).toBe(true);
      await engine.stop();
      expect(engine.isActive()).toBe(false);
    }
  });
});

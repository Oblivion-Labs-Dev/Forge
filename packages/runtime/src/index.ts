import { loadBaseConfig } from '@forge/config';
import { ForgeEngine } from '@forge/engine';

export class Forge {
  constructor(private readonly engine: ForgeEngine) {}
  async ignite() {
    const config = loadBaseConfig();
    console.log(`[Forge] Ignited with config:`, config);
    await this.engine.ignite();
  }
}

import { Forge } from '@forge/runtime';
import { ForgeEngine } from '@forge/engine';

console.log('--- Forge OS CLI ---');
const engine = new ForgeEngine();
const forge = new Forge(engine);
forge.ignite();

import { Forge } from '@forge/runtime';
import { ForgeEngine } from '@forge/engine';
import { loadConfig } from '@forge/config';
import { Blueprint } from '@forge/goals';

console.log('=== Hello Forge Example ===');

const config = loadConfig();
const engine = new ForgeEngine();
const forge = new Forge(engine, config);

const blueprint: Blueprint = {
  id: 'hello-bp',
  name: 'Hello Forge Blueprint',
  objectives: [
    {
      id: 'obj-1',
      title: 'Initialize Workspace',
      requirements: [{ id: 'req-1', description: 'Create hello workspace' }],
      criteria: [{ id: 'crit-1', condition: 'Workspace directory exists' }],
    },
  ],
};

console.log('Loaded Blueprint:', blueprint.name);
forge.onIgnite().then(() => {
  console.log('Forge ignited. Processing workpiece...');
  forge.onExtinguish();
});

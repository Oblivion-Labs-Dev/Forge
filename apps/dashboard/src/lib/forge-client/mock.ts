import type {
  ForgeClient,
  ForgeRuntimeSnapshot,
  ArsenalInventory,
  ForgeInventory,
  RuleManifest,
  SkillManifest,
  HammerStrikeEvent
} from './types';

export class MockForgeClient implements ForgeClient {
  private strikeListeners: Set<(event: HammerStrikeEvent) => void> = new Set();
  
  private snapshot: ForgeRuntimeSnapshot = {
    status: 'running',
    activeWorkpieceId: 'wp-1',
    artisans: [
      { name: 'PlannerArtisan', craft: 'Planning', purpose: 'Design goals and objectives', status: 'active', successRate: 0.95, tools: ['bellows', 'chronicle'], rulesLoaded: ['naming.md', 'common.md'] },
      { name: 'BuilderArtisan', craft: 'Building', purpose: 'Compile code and bundle assets', status: 'idle', successRate: 0.92, tools: ['anvil', 'tsup'], rulesLoaded: ['common.md', 'forge.md'] },
      { name: 'ReviewerArtisan', craft: 'Reviewing', purpose: 'Scan syntax and formatting', status: 'idle', successRate: 0.98, tools: ['inspector', 'eslint'], rulesLoaded: ['architecture.md'] },
      { name: 'ResearchArtisan', craft: 'Researching', purpose: 'Gather web documents', status: 'idle', successRate: 0.90, tools: ['gateway'], rulesLoaded: ['common.md'] },
      { name: 'TesterArtisan', craft: 'Testing', purpose: 'Execute vitest suite', status: 'idle', successRate: 0.94, tools: ['assayer', 'vitest'], rulesLoaded: ['common.md'] }
    ],
    workpieces: [
      { id: 'wp-1', name: 'Draft System Plan', artisanName: 'PlannerArtisan', status: 'active', toolUsed: 'chronicle', duration: 12, retryCount: 0, input: 'Build OS bootstrap blueprint', output: 'Workspace layout designed', log: ['Reading rules/ naming.md...', 'Analyzing workspace dependencies...', 'Writing blueprint output.'] },
      { id: 'wp-2', name: 'Generate Core Primitives', artisanName: 'BuilderArtisan', status: 'queued', duration: 0, retryCount: 0, input: 'Compile core workspace models', output: '', log: [] },
      { id: 'wp-3', name: 'Lint and Verify Code', artisanName: 'ReviewerArtisan', status: 'idle', duration: 0, retryCount: 0, input: 'Verify core build syntax', output: '', log: [] }
    ]
  };

  constructor() {
    this.startSimulation();
  }

  async getRuntimeSnapshot(): Promise<ForgeRuntimeSnapshot> {
    return { ...this.snapshot };
  }

  async getArsenalInventory(): Promise<ArsenalInventory> {
    return {
      packages: [
        { name: 'core', purpose: 'Base interface types and lifecycles', version: '0.1.0', status: 'stable', exports: ['HammerStrike', 'Anvil'], dependencies: [] },
        { name: 'config', purpose: 'Environment configuration resolver', version: '0.1.0', status: 'stable', exports: ['loadConfig'], dependencies: [] },
        { name: 'telemetry', purpose: 'Foundry metrics emitter', version: '0.1.0', status: 'stable', exports: ['FoundryMetrics'], dependencies: [] },
        { name: 'tools', purpose: 'Execution instrument registry', version: '0.1.0', status: 'stable', exports: ['Toolbox', 'Instrument'], dependencies: [] },
        { name: 'memory', purpose: 'Decision log and archive manager', version: '0.1.0', status: 'stable', exports: ['Chronicle', 'Archive'], dependencies: [] }
      ]
    };
  }

  async getForgeInventory(): Promise<ForgeInventory> {
    return {
      packages: [
        { name: 'runtime', purpose: 'Compose core and engine primitives', exports: ['Forge'], composes: ['core', 'config'], dependencies: ['@forge/core', '@forge/engine'] },
        { name: 'engine', purpose: 'Maintain main execution loop', exports: ['ForgeEngine'], composes: ['goals', 'memory'], dependencies: ['@forge/core', '@forge/goals'] }
      ]
    };
  }

  async getRuleManifest(): Promise<RuleManifest> {
    return {
      files: [
        { name: 'AGENTS.md', status: 'compiled', lastLoaded: new Date().toISOString(), hash: 'a1b2c3d4', sections: ['Workspace Layout', 'Startup Rules'], affectedArtisans: ['PlannerArtisan', 'BuilderArtisan'], constraints: ['Always read rules before code edits'] },
        { name: 'rules/naming.md', status: 'compiled', lastLoaded: new Date().toISOString(), hash: 'e5f6g7h8', sections: ['Thematic vocabulary'], affectedArtisans: ['PlannerArtisan'], constraints: ['Use Bellows, Anvil, Artisan naming conventions'] },
        { name: 'rules/common.md', status: 'compiled', lastLoaded: new Date().toISOString(), hash: '9i0j1k2l', sections: ['Strict mode typings'], affectedArtisans: ['BuilderArtisan', 'ReviewerArtisan'], constraints: ['Strict TypeScript, no implicit any'] }
      ]
    };
  }

  async getSkillManifest(): Promise<SkillManifest> {
    return {
      skills: [
        { name: 'Compile Blueprint', description: 'Transform raw prompt blueprint into structured workspace layout', trigger: 'blueprint.created', tools: ['bellows'], ownerPackage: 'goals', compatibleArtisans: ['PlannerArtisan'] },
        { name: 'Forge Core Module', description: 'Initialize core workspace files using workspace context', trigger: 'workpiece.started', tools: ['anvil'], ownerPackage: 'engine', compatibleArtisans: ['BuilderArtisan'] }
      ]
    };
  }

  subscribeToHammerStrikes(callback: (event: HammerStrikeEvent) => void): () => void {
    this.strikeListeners.add(callback);
    return () => {
      this.strikeListeners.delete(callback);
    };
  }

  private startSimulation() {
    let step = 0;
    setInterval(() => {
      if (this.strikeListeners.size === 0) return;

      const events: HammerStrikeEvent[] = [
        { id: `evt-${step}`, timestamp: new Date().toISOString(), type: 'blueprint.created', source: 'ForgeClient', target: 'ForgeEngine', status: 'info', summary: 'Blueprint plan successfully initialized' },
        { id: `evt-${step + 1}`, timestamp: new Date().toISOString(), type: 'artisan.assigned', source: 'Guild', target: 'PlannerArtisan', status: 'success', summary: 'PlannerArtisan assigned to task: Draft System Plan' },
        { id: `evt-${step + 2}`, timestamp: new Date().toISOString(), type: 'instrument.used', source: 'PlannerArtisan', target: 'bellows', status: 'info', summary: 'Bellows scheduler pulsed' }
      ];

      // Randomly cycle workpiece states to simulate live dashboard
      const activeWp = this.snapshot.workpieces.find(w => w.status === 'active');
      if (activeWp) {
        if (Math.random() > 0.6) {
          activeWp.status = 'complete';
          activeWp.output = 'Workspace layout finalized and cached.';
          activeWp.duration = (activeWp.duration || 0) + 5;
          const nextWp = this.snapshot.workpieces.find(w => w.status === 'queued');
          if (nextWp) {
            nextWp.status = 'active';
            this.snapshot.activeWorkpieceId = nextWp.id;
            
            // Toggle artisans
            this.snapshot.artisans.forEach(a => {
              if (a.name === activeWp.artisanName) a.status = 'idle';
              if (a.name === nextWp.artisanName) a.status = 'active';
            });

            const strike: HammerStrikeEvent = {
              id: `evt-wp-${step}`,
              timestamp: new Date().toISOString(),
              type: 'workpiece.started',
              source: nextWp.artisanName,
              target: nextWp.name,
              status: 'info',
              summary: `Started workpiece execution: ${nextWp.name}`
            };
            this.strikeListeners.forEach(cb => cb(strike));
          }
        } else {
          activeWp.duration = (activeWp.duration || 0) + 1;
        }
      }

      const selectedEvent = events[Math.floor(Math.random() * events.length)];
      this.strikeListeners.forEach(cb => cb(selectedEvent));
      step += 3;
    }, 4000);
  }
}

export interface WorkpieceState {
  id: string;
  name: string;
  artisanName: string;
  status: 'idle' | 'queued' | 'active' | 'thinking' | 'running-tool' | 'waiting' | 'reviewing' | 'passed' | 'failed' | 'retrying' | 'complete';
  toolUsed?: string;
  duration?: number;
  retryCount?: number;
  input?: string;
  output?: string;
  log?: string[];
}

export interface ArtisanState {
  name: string;
  craft: string;
  purpose: string;
  status: 'idle' | 'active';
  successRate: number;
  tools: string[];
  rulesLoaded: string[];
  currentTask?: string;
}

export interface HammerStrikeEvent {
  id: string;
  timestamp: string;
  type: string;
  source: string;
  target: string;
  status: 'info' | 'success' | 'warn' | 'error';
  summary: string;
  details?: string;
  relatedArtifact?: string;
}

export interface RuleManifest {
  files: Array<{
    name: string;
    status: 'compiled' | 'pending' | 'failed';
    lastLoaded: string;
    hash: string;
    sections: string[];
    affectedArtisans: string[];
    constraints: string[];
  }>;
}

export interface SkillManifest {
  skills: Array<{
    name: string;
    description: string;
    trigger: string;
    tools: string[];
    ownerPackage: string;
    compatibleArtisans: string[];
  }>;
}

export interface ArsenalInventory {
  packages: Array<{
    name: string;
    purpose: string;
    version: string;
    status: 'stable' | 'beta';
    exports: string[];
    dependencies: string[];
  }>;
}

export interface ForgeInventory {
  packages: Array<{
    name: string;
    purpose: string;
    exports: string[];
    composes: string[];
    dependencies: string[];
  }>;
}

export interface ForgeRuntimeSnapshot {
  status: 'idle' | 'running' | 'completed' | 'failed';
  workpieces: WorkpieceState[];
  artisans: ArtisanState[];
  activeWorkpieceId?: string;
}

export interface ForgeClient {
  getRuntimeSnapshot(): Promise<ForgeRuntimeSnapshot>;
  getArsenalInventory(): Promise<ArsenalInventory>;
  getForgeInventory(): Promise<ForgeInventory>;
  getRuleManifest(): Promise<RuleManifest>;
  getSkillManifest(): Promise<SkillManifest>;
  subscribeToHammerStrikes(
    callback: (event: HammerStrikeEvent) => void
  ): () => void;
}

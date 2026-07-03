export const NAV_ITEMS = [
  { id: 'dashboard', icon: '⌂', label: 'Command Center' },
  { id: 'dashboard-poc', icon: '◴', label: 'POC Dashboard' },
  { id: 'timeline', icon: '◉', label: 'Live Timeline' },
  { id: 'artisans', icon: '⚒', label: 'Artisan Guild' },
  { id: 'arsenal', icon: '⬡', label: 'Arsenal Inventory' },
  { id: 'scripts', icon: '⚡', label: 'Script Terminal' },
  { id: 'campaign-history', icon: '🕰', label: 'Campaign History' },
  { id: 'forge', icon: '🛠', label: 'Forge Composer' },
  { id: 'rules', icon: '▤', label: 'Rule Compiler' },
  { id: 'skills', icon: '⌘', label: 'Skills Matrix' },
  { id: 'archive', icon: '▣', label: 'Memory Archive' },
  { id: 'metrics', icon: '♧', label: 'System Metrics' },
  { id: 'settings', icon: '⚙', label: 'Settings' }
] as const;

export const ARTISAN_POSITIONS = [
  { name: 'PlannerArtisan', short: 'Planner', stage: 'Planning', colorVar: '--violet', left: 26, top: 23 },
  { name: 'BuilderArtisan', short: 'Builder', stage: 'Building', colorVar: '--ember', left: 74, top: 25 },
  { name: 'ReviewerArtisan', short: 'Reviewer', stage: 'Reviewing', colorVar: '--aqua', left: 18, top: 61 },
  { name: 'TesterArtisan', short: 'Tester', stage: 'Testing', colorVar: '--aqua', left: 82, top: 62 },
  { name: 'ResearchArtisan', short: 'Research', stage: 'Researching', colorVar: '--mint', left: 35, top: 80 },
  { name: 'DocumenterArtisan', short: 'Documenter', stage: 'Documenting', colorVar: '--gold', left: 65, top: 80 }
] as const;

export const TOOLS = [
  { icon: '♨', label: 'Bellows', colorVar: '--aqua' },
  { icon: '⚒', label: 'Anvil', colorVar: '--ember' },
  { icon: '♜', label: 'tsup', colorVar: '--violet' },
  { icon: '⚙', label: 'eslint', colorVar: '--mint' },
  { icon: '◇', label: 'gateway', colorVar: '--aqua' }
] as const;

export const INITIAL_EVENTS = [
  { icon: '⚒', message: 'BuilderArtisan started work on dark-mode.css', tag: 'BUILDING', colorVar: '--ember' },
  { icon: '♜', message: 'PlannerArtisan created task: Add theme toggle', tag: 'PLANNING', colorVar: '--violet' },
  { icon: '▣', message: 'ResearchArtisan fetched 12 references', tag: 'RESEARCH', colorVar: '--aqua' },
  { icon: '✓', message: 'ReviewerArtisan approved architecture', tag: 'REVIEW', colorVar: '--mint' },
  { icon: '▤', message: 'Blueprint "Implement Dark Mode" created', tag: 'SYSTEM', colorVar: '--aqua' }
] as const;

export const LAB_BADGES = [
  { label: 'Planning', colorVar: '--violet' },
  { label: 'Building', colorVar: '--ember' },
  { label: 'Testing', colorVar: '--aqua' },
  { label: 'Review', colorVar: '--aqua' },
  { label: 'Success', colorVar: '--mint' },
  { label: 'Warning', colorVar: '--gold' }
] as const;

export function navIndexForPage(pageId: string): number {
  const idx = NAV_ITEMS.findIndex((item) => item.id === pageId);
  return idx >= 0 ? idx : 0;
}

export function pageIdForNavIndex(index: number): string {
  return NAV_ITEMS[index]?.id ?? 'dashboard';
}

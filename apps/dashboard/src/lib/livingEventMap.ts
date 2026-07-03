import type { HammerStrikeEvent } from './forge-client/types';
import type { LivingEvent } from '../components/forge-os/LivingRightColumn';

const TAG_MAP: Record<string, string> = {
  'blueprint.plan.generated': 'PLANNING',
  'instrument.used': 'BUILDING',
  'instrument.research': 'RESEARCH',
  'inspection.passed': 'REVIEW',
  'chronicle.updated': 'SYSTEM'
};

const COLOR_MAP: Record<string, string> = {
  PLANNING: '--violet',
  BUILDING: '--ember',
  RESEARCH: '--aqua',
  REVIEW: '--mint',
  DOCUMENTING: '--gold',
  SYSTEM: '--aqua'
};

const ICON_MAP: Record<string, string> = {
  'blueprint.plan.generated': '♜',
  'instrument.used': '⚒',
  'instrument.research': '▣',
  'inspection.passed': '✓',
  'chronicle.updated': '▤'
};

export function hammerEventToLiving(event: HammerStrikeEvent, id: number): LivingEvent {
  const tag = TAG_MAP[event.type] ?? event.status.toUpperCase();
  return {
    id,
    icon: ICON_MAP[event.type] ?? '⚒',
    message: event.summary,
    tag,
    colorVar: COLOR_MAP[tag] ?? '--ember',
    time: new Date(event.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };
}

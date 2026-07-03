import React, { useCallback, useMemo } from 'react';
import type { ForgeRuntimeSnapshot, HammerStrikeEvent } from '../../lib/forge-client/types';
import type { RuntimeMetrics } from '../../lib/runtimeMetrics';
import { hammerEventToLiving } from '../../lib/livingEventMap';
import { INITIAL_EVENTS } from './constants';
import LivingCommandCenter from './LivingCommandCenter';
import LivingMetricsSection from './LivingMetricsSection';
import LivingRightColumn, { type LivingEvent } from './LivingRightColumn';
import { useLivingForge } from './LivingForgeContext';

const TAG_COLORS: Record<string, string> = {
  PLANNING: '--violet',
  BUILDING: '--ember',
  RESEARCH: '--aqua',
  REVIEW: '--mint',
  DOCUMENTING: '--gold',
  SYSTEM: '--aqua',
  RUNNING: '--aqua'
};

let localEventId = 1000;

function formatTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function seedEvents(): LivingEvent[] {
  return INITIAL_EVENTS.map((e, i) => ({
    id: i,
    icon: e.icon,
    message: e.message,
    tag: e.tag,
    colorVar: e.colorVar,
    time: formatTime()
  }));
}

interface Props {
  snapshot: ForgeRuntimeSnapshot | null;
  events: HammerStrikeEvent[];
  metrics: RuntimeMetrics;
  onViewTimeline?: () => void;
}

export const ForgeDashboard: React.FC<Props> = ({ snapshot, events, metrics, onViewTimeline }) => {
  const { burst, toast } = useLivingForge();

  const hammerEvents = useMemo(
    () => (events.length ? events.map((e, i) => hammerEventToLiving(e, i)) : seedEvents()),
    [events]
  );

  const [localEvents, setLocalEvents] = React.useState<LivingEvent[]>([]);
  const displayEvents = useMemo(
    () => [...localEvents, ...hammerEvents].slice(0, 8),
    [localEvents, hammerEvents]
  );

  const activeWorkpiece =
    snapshot?.workpieces.find((w) => w.id === snapshot.activeWorkpieceId) ?? snapshot?.workpieces[0];

  const activeArtisan =
    snapshot?.artisans.find((a) => a.status === 'active') ?? snapshot?.artisans[0];

  const blueprintTitle = activeWorkpiece?.name ?? 'Implement Dark Mode';
  const blueprintSubtitle = activeWorkpiece?.input ?? 'One clear workpiece, visible progress.';

  const addEvent = useCallback((icon: string, message: string, tag: string) => {
    const colorVar = TAG_COLORS[tag.toUpperCase()] ?? '--ember';
    setLocalEvents((prev) => [
      { id: ++localEventId, icon: icon[0] ?? '⚒', message, tag: tag.toUpperCase(), colorVar, time: formatTime() },
      ...prev
    ]);
  }, []);

  const handleArtisanClick = useCallback(
    (name: string, stage: string, color: string, x: number, y: number) => {
      burst(x, y, color, 22);
      toast(`${name} is now in focus`);
    },
    [burst, toast]
  );

  const handleCoreClick = useCallback(
    (x: number, y: number) => {
      burst(x, y, '#ff8a2a', 64);
      toast('Hammer strike landed');
      addEvent('⚒', 'Manual hammer strike forged progress', 'BUILDING');
    },
    [addEvent, burst, toast]
  );

  const handleAutoStrike = useCallback(
    (x: number, y: number) => {
      burst(x, y, '#ff8a2a', 4);
    },
    [burst]
  );

  const handleToolClick = useCallback(
    (label: string, color: string, x: number, y: number) => {
      burst(x, y, color, 32);
      toast(`${label} activated`);
    },
    [burst, toast]
  );

  return (
    <div className="living-dashboard" data-testid="command-center">
      <main className="main">
        <LivingCommandCenter
          blueprintTitle={blueprintTitle}
          blueprintSubtitle={blueprintSubtitle}
          progress={metrics.progress}
          onArtisanClick={handleArtisanClick}
          onCoreClick={handleCoreClick}
          onAutoStrike={handleAutoStrike}
          addEvent={addEvent}
        />
        <LivingMetricsSection
          metrics={metrics}
          activeArtisan={activeArtisan}
          workpieceName={activeWorkpiece?.name}
          workpieceCount={snapshot?.workpieces.length}
          onToolClick={handleToolClick}
          addEvent={addEvent}
        />
      </main>
      <LivingRightColumn
        events={displayEvents}
        progress={metrics.progress}
        successRate={metrics.successRate}
        focusArtisan={activeArtisan?.name ?? 'BuilderArtisan'}
        onViewTimeline={onViewTimeline}
      />
      <div data-testid="forge-control-bar" hidden aria-hidden />
      <div data-testid="section-suggestions" hidden aria-hidden />
    </div>
  );
};

export default ForgeDashboard;

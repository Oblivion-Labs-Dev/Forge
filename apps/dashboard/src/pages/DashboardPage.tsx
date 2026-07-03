import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { client } from '../lib/forge-client';
import type { ForgeRuntimeSnapshot, HammerStrikeEvent } from '../lib/forge-client/types';
import ForgeDashboard from '../components/forge-os/ForgeDashboard';
import { useForgeExperience } from '../context/ForgeExperienceContext';
import { deriveRuntimeMetrics } from '../lib/runtimeMetrics';
import {
  STATIC_SNAPSHOT,
  getStaticTimelineEvents,
  isStaticDemoMode
} from '../data/commandCenterFixtures';

interface Props {
  onViewTimeline?: () => void;
}

export const DashboardPage: React.FC<Props> = ({ onViewTimeline }) => {
  const staticMode = isStaticDemoMode();
  const { recordHammerEvent, strikeCount } = useForgeExperience();
  const [snapshot, setSnapshot] = useState<ForgeRuntimeSnapshot | null>(
    staticMode ? STATIC_SNAPSHOT : null
  );
  const [events, setEvents] = useState<HammerStrikeEvent[]>(
    staticMode ? getStaticTimelineEvents() : []
  );

  const timelineEvents = events.length ? events : staticMode ? getStaticTimelineEvents() : events;
  const metrics = deriveRuntimeMetrics(snapshot, timelineEvents, strikeCount);

  useEffect(() => {
    if (timelineEvents[0]) recordHammerEvent();
  }, [timelineEvents[0]?.id, recordHammerEvent]);

  useEffect(() => {
    if (staticMode) return;

    const updateSnapshot = async () => {
      setSnapshot(await client.getRuntimeSnapshot());
    };

    updateSnapshot();
    const snapInterval = setInterval(updateSnapshot, 2000);
    const unsubscribe = client.subscribeToHammerStrikes((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 10));
    });

    return () => {
      clearInterval(snapInterval);
      unsubscribe();
    };
  }, [staticMode]);

  return (
    <div data-testid="dashboard-page" className="dashboard-page">
      <ForgeDashboard
        snapshot={snapshot}
        events={timelineEvents}
        metrics={metrics}
        onViewTimeline={onViewTimeline}
      />
    </div>
  );
};

export default DashboardPage;

export function useDashboardStatlets() {
  const staticMode = isStaticDemoMode();
  const [snapshot, setSnapshot] = useState<ForgeRuntimeSnapshot | null>(
    staticMode ? STATIC_SNAPSHOT : null
  );
  const [events, setEvents] = useState<HammerStrikeEvent[]>(
    staticMode ? getStaticTimelineEvents() : []
  );

  useEffect(() => {
    if (staticMode) return;
    client.getRuntimeSnapshot().then(setSnapshot);
    const interval = setInterval(() => client.getRuntimeSnapshot().then(setSnapshot), 4000);
    const unsubscribe = client.subscribeToHammerStrikes((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 10));
    });
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [staticMode]);

  return useMemo(() => {
    const metrics = deriveRuntimeMetrics(snapshot, events, 0);
    const totalArtisans = snapshot?.artisans.length ?? 12;
    return {
      activeArtisans: String(metrics.activeArtisanCount),
      workpieces: String(snapshot?.workpieces.length ?? 18),
      successRate: `${Math.round(metrics.successRate * 100)}%`,
      hammerstrikes: metrics.strikeCount.toLocaleString()
    };
  }, [snapshot, events]);
}

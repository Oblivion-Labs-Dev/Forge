import React, { useEffect, useMemo, useState } from 'react';
import { client } from '../lib/forge-client';
import type { HammerStrikeEvent } from '../lib/forge-client/types';
import LivingPageShell from '../components/forge-os/LivingPageShell';
import LivingPanel from '../components/forge-os/LivingPanel';
import { getStaticTimelineEvents, isStaticDemoMode } from '../data/commandCenterFixtures';
import { hammerEventToLiving } from '../lib/livingEventMap';
import { mapPackageStatus, resolveActivityStatus } from '../lib/sectionStatus';

const STATUS_COLORS: Record<string, string> = {
  success: 'var(--green)',
  info: 'var(--blue)',
  warning: 'var(--gold)',
  error: 'var(--red)'
};

export const TimelinePage: React.FC = () => {
  const [events, setEvents] = useState<HammerStrikeEvent[]>(
    isStaticDemoMode() ? getStaticTimelineEvents() : []
  );

  useEffect(() => {
    if (isStaticDemoMode()) return;
    const unsubscribe = client.subscribeToHammerStrikes((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 50));
    });
    return unsubscribe;
  }, []);

  const pageStatus = useMemo(
    () => resolveActivityStatus(events.length, events[0]?.timestamp),
    [events]
  );

  const badge =
    pageStatus === 'active' ? '● LIVE' : pageStatus === 'done' ? '✓ SYNCED' : '◌ IDLE';

  return (
    <LivingPageShell
      testId="timeline-page"
      title="Live Forge Chronicle"
      subtitle="HammerStrike events streaming from the forge floor"
      badge={badge}
      badgeColor={pageStatus === 'active' ? 'var(--orange)' : 'var(--soft)'}
    >
      <LivingPanel>
        {events.length === 0 ? (
          <p className="living-empty">Waiting for the first HammerStrike event to resonate...</p>
        ) : (
          <div className="living-event-list">
            {events.map((event, index) => {
              const living = hammerEventToLiving(event, index);
              const cardStatus = mapPackageStatus(event.status);
              return (
                <article key={event.id || index} className="living-event-card">
                  <div className="eicon" style={{ ['--c' as string]: `var(${living.colorVar})` }}>
                    {living.icon}
                  </div>
                  <div>
                    <div className="living-card-head" style={{ marginBottom: 4 }}>
                      <strong style={{ color: '#dbe4fb', fontSize: 13 }}>{event.type}</strong>
                      <span className="small">{living.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: '#e8eeff' }}>{event.summary}</p>
                    <div className="living-meta-row">
                      <span>Source: {event.source}</span>
                      <span>Target: {event.target}</span>
                    </div>
                  </div>
                  <span
                    className="badge"
                    style={{
                      ['--c' as string]: STATUS_COLORS[event.status] ?? `var(${living.colorVar})`
                    }}
                  >
                    {cardStatus.toUpperCase()}
                  </span>
                </article>
              );
            })}
          </div>
        )}
      </LivingPanel>
    </LivingPageShell>
  );
};

export default TimelinePage;

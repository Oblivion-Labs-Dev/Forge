import React from 'react';

export interface LivingEvent {
  id: number;
  icon: string;
  message: string;
  tag: string;
  colorVar: string;
  time: string;
}

interface Props {
  events: LivingEvent[];
  progress?: number;
  successRate?: number;
  focusArtisan?: string;
  onViewTimeline?: () => void;
}

export const LivingRightColumn: React.FC<Props> = ({
  events,
  progress = 72,
  successRate = 0.94,
  focusArtisan = 'BuilderArtisan',
  onViewTimeline
}) => {
  const ringDeg = Math.round((progress / 100) * 360);

  return (
    <aside className="right">
      <section className="panel events" data-testid="section-activity">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p className="kicker">Hammerstrike Events</p>
          <span className="pill pill-ember">● LIVE</span>
        </div>
        <div className="event-list">
          {events.slice(0, 6).map((event) => (
            <div key={event.id} className="event">
              <div className="eicon" style={{ ['--c' as string]: `var(${event.colorVar})` }}>
                {event.icon}
              </div>
              <div>
                <p className="quiet">{event.time}</p>
                <p>{event.message}</p>
              </div>
              <span className="badge" style={{ ['--c' as string]: `var(${event.colorVar})` }}>
                {event.tag}
              </span>
            </div>
          ))}
        </div>
        {onViewTimeline && (
          <button type="button" className="timeline-link" onClick={onViewTimeline}>
            View Full Timeline
          </button>
        )}
      </section>
      <section className="panel focus">
        <p className="kicker">Focus</p>
        <div className="focus-box">
          <p className="muted">Current attention</p>
          <h3>{focusArtisan}</h3>
          <div className="ring" style={{ background: `conic-gradient(var(--ember) 0 ${ringDeg}deg, rgba(255,255,255,.08) 0)` }}>
            <b>{progress}%</b>
          </div>
          <p className="quiet">Less noise. More signal.</p>
        </div>
      </section>
      <section className="panel viz">
        <p className="kicker">Data Elements</p>
        <div className="viz-row">
          <div className="donut" style={{ ['--p' as string]: progress, ['--c' as string]: 'var(--aqua)' }}>
            <b>{progress}%</b>
          </div>
          <div
            className="donut"
            style={{ ['--p' as string]: Math.round(successRate * 100), ['--c' as string]: 'var(--ember)' }}
          >
            <b>{Math.round(successRate * 100)}%</b>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default LivingRightColumn;

import React, { useState } from 'react';
import GlassPanel from '../GlassPanel';
import StatusPill from '../StatusPill';

interface ViewProps {
  events: any[];
}

export const TimelineReplayView: React.FC<ViewProps> = ({ events }) => {
  const [sliderVal, setSliderVal] = useState(events.length);
  
  const visibleEvents = events.slice(0, Math.max(1, sliderVal));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <GlassPanel style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>TIMELINE REPLAY SCRUBBER</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
            Showing {visibleEvents.length} / {events.length} Events
          </span>
        </div>
        <input
          type="range"
          min="1"
          max={events.length}
          value={sliderVal}
          onChange={(e) => setSliderVal(parseInt(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--accent-amber)',
            background: 'var(--border-glass)',
            height: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            outline: 'none'
          }}
        />
      </GlassPanel>

      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {visibleEvents.map((evt, i) => (
          <div
            key={evt.id || i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '10px',
              borderLeft: '2.5px solid var(--accent-amber)',
              background: 'rgba(255,255,255,0.01)',
              borderRadius: '0 8px 8px 0'
            }}
          >
            <div style={{ fontSize: '1.2rem' }}>🔨</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{evt.type}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{evt.message || evt.summary}</p>
            </div>
            <StatusPill status={evt.status} />
          </div>
        ))}
      </GlassPanel>
    </div>
  );
};
export default TimelineReplayView;

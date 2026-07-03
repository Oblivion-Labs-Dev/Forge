import React, { useEffect, useRef, useState } from 'react';
import { ARTISAN_POSITIONS } from './constants';

interface Props {
  blueprintTitle: string;
  blueprintSubtitle: string;
  progress: number;
  onArtisanClick: (name: string, stage: string, color: string, x: number, y: number) => void;
  onCoreClick: (x: number, y: number) => void;
  onAutoStrike: (x: number, y: number) => void;
  addEvent: (icon: string, message: string, tag: string) => void;
}

export const LivingCommandCenter: React.FC<Props> = ({
  blueprintTitle,
  blueprintSubtitle,
  progress,
  onArtisanClick,
  onCoreClick,
  onAutoStrike,
  addEvent
}) => {
  const coreRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState('Calm Forge');

  useEffect(() => {
    const filter =
      mode === 'Focus Map'
        ? 'saturate(0.85) brightness(1.08)'
        : mode === 'Timeline'
          ? 'hue-rotate(18deg)'
          : 'none';
    document.body.style.filter = filter;
    return () => {
      document.body.style.filter = 'none';
    };
  }, [mode]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const core = coreRef.current;
      if (!core) return;
      const rect = core.getBoundingClientRect();
      onAutoStrike(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }, 2600);
    return () => window.clearInterval(interval);
  }, [onAutoStrike]);

  return (
    <section className="panel hero" data-testid="section-blueprint">
      <div className="hero-head">
        <div>
          <p className="kicker">Command Center</p>
          <h2>Quiet forge floor for building one task well.</h2>
          <p className="muted">Click the forge, artisans, tools, badges, and controls.</p>
        </div>
        <label className="select">
          <span className="quiet">Mode</span>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option>Calm Forge</option>
            <option>Focus Map</option>
            <option>Timeline</option>
          </select>
        </label>
      </div>
      <div className="stage">
        <div className="floor" aria-hidden />
        <div className="blueprint">
          <p className="kicker">Current Blueprint</p>
          <h3>{blueprintTitle}</h3>
          <p className="muted">{blueprintSubtitle || 'One clear workpiece, visible progress.'}</p>
          <div className="progress">
            <div className="bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="quiet">
            <span>{progress}</span>% forged
          </p>
        </div>
        <div
          ref={coreRef}
          className="core"
          id="core"
          title="Click to hammer strike"
          role="button"
          tabIndex={0}
          onClick={(e) => onCoreClick(e.clientX, e.clientY)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              const rect = coreRef.current?.getBoundingClientRect();
              if (rect) onCoreClick(rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
          }}
        />
        {ARTISAN_POSITIONS.map((artisan) => (
          <button
            key={artisan.name}
            type="button"
            className="artisan"
            style={{
              ['--c' as string]: `var(${artisan.colorVar})`,
              left: `${artisan.left}%`,
              top: `${artisan.top}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => {
              const color = getComputedStyle(e.currentTarget).getPropertyValue('--c').trim() || '#ff8a2a';
              onArtisanClick(artisan.name, artisan.stage, color, e.clientX, e.clientY);
              addEvent('⚒', `${artisan.short}Artisan selected`, artisan.stage);
            }}
          >
            <div className="row">
              <div>
                <b>{artisan.short}Artisan</b>
                <div className="stageTxt">{artisan.stage}</div>
              </div>
              <div className="orb" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default LivingCommandCenter;

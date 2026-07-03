import React, { useEffect, useState } from 'react';
import { client } from '../lib/forge-client';
import type { ForgeRuntimeSnapshot } from '../lib/forge-client/types';
import LivingPageShell from '../components/forge-os/LivingPageShell';
import LivingPanel from '../components/forge-os/LivingPanel';
import { isStaticDemoMode, STATIC_SNAPSHOT } from '../data/commandCenterFixtures';

export const ArtisansPage: React.FC = () => {
  const [snapshot, setSnapshot] = useState<ForgeRuntimeSnapshot | null>(
    isStaticDemoMode() ? STATIC_SNAPSHOT : null
  );

  useEffect(() => {
    if (isStaticDemoMode()) return;
    client.getRuntimeSnapshot().then(setSnapshot);
    const interval = setInterval(() => client.getRuntimeSnapshot().then(setSnapshot), 4000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = snapshot?.artisans.filter((a) => a.status === 'active').length ?? 0;

  return (
    <LivingPageShell
      testId="artisans-page"
      title="Artisan Guild"
      subtitle="Specialized AI workers executing planning, building, and review tasks"
      layout="grid"
      badge={`${activeCount} ACTIVE`}
      badgeColor="var(--orange)"
    >
      {snapshot?.artisans.map((artisan) => {
        const isActive = artisan.status === 'active';
        return (
          <LivingPanel key={artisan.name} className="living-card">
            <div className="living-card-head">
              <div>
                <div className="living-card-title">{artisan.name}</div>
                <div className="living-card-sub">{artisan.craft} Craft</div>
              </div>
              <span className="badge" style={{ ['--c' as string]: isActive ? 'var(--green)' : 'var(--soft)' }}>
                {artisan.status.toUpperCase()}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#91a0bb', margin: '0 0 12px' }}>{artisan.purpose}</p>
            <div className="living-meta-row">
              <span>Success Rate</span>
              <strong style={{ color: 'var(--green)' }}>{(artisan.successRate * 100).toFixed(0)}%</strong>
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="small" style={{ marginBottom: 6 }}>
                Instruments
              </div>
              <div className="living-tag-row" style={{ marginTop: 0 }}>
                {artisan.tools.map((t) => (
                  <span key={t} className="living-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <div className="small" style={{ marginBottom: 6 }}>
                Guardrails
              </div>
              <div className="living-tag-row" style={{ marginTop: 0 }}>
                {artisan.rulesLoaded.map((r) => (
                  <span key={r} className="living-tag" style={{ color: 'var(--gold)' }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </LivingPanel>
        );
      })}
    </LivingPageShell>
  );
};

export default ArtisansPage;

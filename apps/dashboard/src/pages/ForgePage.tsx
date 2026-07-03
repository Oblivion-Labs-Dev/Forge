import React, { useEffect, useState } from 'react';
import { client } from '../lib/forge-client';
import type { ForgeInventory } from '../lib/forge-client/types';
import LivingPageShell from '../components/forge-os/LivingPageShell';
import LivingPanel from '../components/forge-os/LivingPanel';

export const ForgePage: React.FC = () => {
  const [inventory, setInventory] = useState<ForgeInventory | null>(null);

  useEffect(() => {
    client.getForgeInventory().then(setInventory);
  }, []);

  return (
    <LivingPageShell
      testId="forge-page"
      title="Forge Composer"
      subtitle="How Forge product modules consume and coordinate Arsenal primitives"
      layout="grid"
      badge="⬡ COMPOSE"
      badgeColor="var(--gold)"
    >
      {inventory?.packages.map((pkg) => (
        <LivingPanel key={pkg.name} className="living-card">
          <div className="living-card-title">{pkg.name.toUpperCase()}</div>
          <div className="living-card-sub">{pkg.purpose}</div>
          <div style={{ marginTop: 14 }}>
            <div className="small" style={{ marginBottom: 6 }}>
              Composes Arsenal
            </div>
            <div className="living-tag-row" style={{ marginTop: 0 }}>
              {pkg.composes.map((item) => (
                <span key={item} className="living-tag" style={{ color: 'var(--gold)' }}>
                  @{item}
                </span>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="small" style={{ marginBottom: 6 }}>
              Dependencies
            </div>
            <div className="living-tag-row" style={{ marginTop: 0 }}>
              {pkg.dependencies.map((dep) => (
                <span key={dep} className="living-tag">
                  {dep}
                </span>
              ))}
            </div>
          </div>
        </LivingPanel>
      ))}
    </LivingPageShell>
  );
};

export default ForgePage;

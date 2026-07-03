import React, { useEffect, useMemo, useState } from 'react';
import { client } from '../lib/forge-client';
import type { ArsenalInventory } from '../lib/forge-client/types';
import LivingPageShell from '../components/forge-os/LivingPageShell';
import LivingPanel from '../components/forge-os/LivingPanel';
import { mapPackageStatus } from '../lib/sectionStatus';

export const ArsenalPage: React.FC = () => {
  const [inventory, setInventory] = useState<ArsenalInventory | null>(null);

  useEffect(() => {
    client.getArsenalInventory().then(setInventory);
  }, []);

  const pageStatus = useMemo(() => {
    if (!inventory?.packages.length) return 'idle' as const;
    const statuses = inventory.packages.map((pkg) => mapPackageStatus(pkg.status));
    if (statuses.includes('queued')) return 'queued';
    if (statuses.includes('active')) return 'active';
    return 'done';
  }, [inventory]);

  const badge =
    pageStatus === 'active' ? '● ACTIVE' : pageStatus === 'queued' ? '◌ QUEUED' : '✓ READY';

  return (
    <LivingPageShell
      testId="arsenal-page"
      title="Arsenal Inventory"
      subtitle="Reusable primitives with package health color coding"
      layout="grid"
      badge={badge}
      badgeColor={pageStatus === 'active' ? 'var(--orange)' : 'var(--green)'}
    >
      {inventory?.packages.map((pkg) => {
        const cardStatus = mapPackageStatus(pkg.status);
        const colorVar =
          cardStatus === 'active'
            ? 'var(--orange)'
            : cardStatus === 'queued'
              ? 'var(--soft)'
              : 'var(--green)';
        return (
          <LivingPanel key={pkg.name} className="living-card">
            <div className="living-card-head">
              <div>
                <div className="living-card-title">@{pkg.name}</div>
                <div className="living-card-sub">{pkg.purpose}</div>
              </div>
              <span className="badge" style={{ ['--c' as string]: colorVar }}>
                v{pkg.version}
              </span>
            </div>
            <div className="living-tag-row">
              {pkg.exports.slice(0, 6).map((exp) => (
                <span key={exp} className="living-tag">
                  {exp}
                </span>
              ))}
            </div>
          </LivingPanel>
        );
      })}
    </LivingPageShell>
  );
};

export default ArsenalPage;

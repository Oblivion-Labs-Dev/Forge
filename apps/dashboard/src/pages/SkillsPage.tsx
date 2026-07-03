import React, { useEffect, useState } from 'react';
import { client } from '../lib/forge-client';
import type { SkillManifest } from '../lib/forge-client/types';
import LivingPageShell from '../components/forge-os/LivingPageShell';
import LivingPanel from '../components/forge-os/LivingPanel';

export const SkillsPage: React.FC = () => {
  const [manifest, setManifest] = useState<SkillManifest | null>(null);

  useEffect(() => {
    client.getSkillManifest().then(setManifest);
  }, []);

  return (
    <LivingPageShell
      testId="skills-page"
      title="Skills Matrix"
      subtitle="Operational skill sets loaded for artisan crafting loops"
      layout="grid"
      badge="⌘ RUNES"
      badgeColor="var(--purple)"
    >
      {manifest?.skills.map((skill) => (
        <LivingPanel key={skill.name} className="living-card">
          <div className="living-card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.4rem' }}>⚡</span>
              <div className="living-card-title">{skill.name}</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#91a0bb', margin: '0 0 12px', minHeight: 40 }}>{skill.description}</p>
          <div className="living-meta-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
            <div>
              <span className="small">Trigger: </span>
              <span className="living-tag">{skill.trigger}</span>
            </div>
            <div>
              <span className="small">Instruments: </span>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12 }}>{skill.tools.join(', ')}</span>
            </div>
            <div>
              <span className="small">Owner: </span>
              <strong style={{ fontSize: 12 }}>{skill.ownerPackage}</strong>
            </div>
          </div>
        </LivingPanel>
      ))}
    </LivingPageShell>
  );
};

export default SkillsPage;

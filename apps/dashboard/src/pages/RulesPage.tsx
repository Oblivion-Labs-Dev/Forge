import React, { useEffect, useMemo, useState } from 'react';
import { client } from '../lib/forge-client';
import type { RuleManifest } from '../lib/forge-client/types';
import LivingPageShell from '../components/forge-os/LivingPageShell';
import LivingPanel from '../components/forge-os/LivingPanel';
import { mapPackageStatus } from '../lib/sectionStatus';

export const RulesPage: React.FC = () => {
  const [manifest, setManifest] = useState<RuleManifest | null>(null);
  const [selectedFile, setSelectedFile] = useState<RuleManifest['files'][number] | null>(null);

  useEffect(() => {
    client.getRuleManifest().then((manifestData) => {
      setManifest(manifestData);
      if (manifestData.files.length > 0) setSelectedFile(manifestData.files[0]);
    });
  }, []);

  const pageStatus = useMemo(() => {
    if (!manifest?.files.length) return 'idle' as const;
    const statuses = manifest.files.map((file) => mapPackageStatus(file.status));
    if (statuses.includes('queued')) return 'queued';
    if (statuses.includes('active')) return 'active';
    return 'done';
  }, [manifest]);

  return (
    <LivingPageShell
      testId="rules-page"
      title="Rule Compiler"
      subtitle="Compiled guardrails with status-colored source cards"
      layout="split"
      badge={pageStatus === 'active' ? '● COMPILING' : '✓ LOADED'}
      badgeColor="var(--purple)"
    >
      <LivingPanel>
        <div className="title" style={{ fontSize: 14, marginBottom: 12 }}>
          Compiled Sources
        </div>
        <div className="living-source-list">
          {manifest?.files.map((file) => {
            const cardStatus = mapPackageStatus(file.status);
            const colorVar =
              cardStatus === 'active'
                ? 'var(--orange)'
                : cardStatus === 'queued'
                  ? 'var(--soft)'
                  : 'var(--green)';
            const selected = selectedFile?.name === file.name;
            return (
              <button
                key={file.name}
                type="button"
                className={`living-source-btn ${selected ? 'selected' : ''}`}
                onClick={() => setSelectedFile(file)}
              >
                <span className="eicon" style={{ ['--c' as string]: colorVar, width: 32, height: 32 }}>
                  ▤
                </span>
                <div>
                  <strong>{file.name}</strong>
                  <div className="small">Hash: {file.hash.slice(0, 12)}…</div>
                </div>
                <span className="badge" style={{ ['--c' as string]: colorVar }}>
                  {cardStatus.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </LivingPanel>

      <LivingPanel className="living-card">
        <div className="living-card-head">
          <div>
            <div className="living-card-title">{selectedFile?.name ?? 'Select a rule file'}</div>
            {selectedFile && (
              <div className="living-card-sub">
                Last compiled {new Date(selectedFile.lastLoaded).toLocaleString()}
              </div>
            )}
          </div>
        </div>
        {selectedFile ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <div className="small" style={{ marginBottom: 8 }}>
                Detected sections
              </div>
              <div className="living-tag-row" style={{ marginTop: 0 }}>
                {selectedFile.sections.map((section) => (
                  <span key={section} className="living-tag">
                    {section}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div className="small" style={{ marginBottom: 8 }}>
                Constraints
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#91a0bb', fontSize: 13 }}>
                {selectedFile.constraints.map((constraint) => (
                  <li key={constraint}>{constraint}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="small" style={{ marginBottom: 8 }}>
                Affected artisans
              </div>
              <div className="living-tag-row" style={{ marginTop: 0 }}>
                {selectedFile.affectedArtisans.map((artisan) => (
                  <span key={artisan} className="living-tag">
                    {artisan}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="living-empty">Select a rule file to explore compilation guardrails.</p>
        )}
      </LivingPanel>
    </LivingPageShell>
  );
};

export default RulesPage;

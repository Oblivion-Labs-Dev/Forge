import React, { useEffect, useState } from 'react';
import ForgeAtmosphere from './ForgeAtmosphere';
import SparkBurst from './SparkBurst';
import CursorGlow from './CursorGlow';
import AnvilMemoryCanvas from './AnvilMemoryCanvas';
import StrikeEcho from './StrikeEcho';
import { ForgeExperienceProvider, useForgeExperience } from '../../context/ForgeExperienceContext';
import { client } from '../../lib/forge-client';
import type { HammerStrikeEvent } from '../../lib/forge-client/types';

interface ShellProps {
  children: React.ReactNode;
  livingMode?: boolean;
}

interface ClickSpark {
  id: number;
  x: number;
  y: number;
}

const ForgeShellInner: React.FC<ShellProps> = ({ children, livingMode = false }) => {
  const [toast, setToast] = useState<HammerStrikeEvent | null>(null);
  const [sparks, setSparks] = useState<ClickSpark[]>([]);
  const { recordStrike } = useForgeExperience();

  useEffect(() => {
    if (livingMode) return;
    const unsubscribe = client.subscribeToHammerStrikes((event) => {
      setToast(event);
      setTimeout(() => setToast(null), 3000);
    });
    return unsubscribe;
  }, [livingMode]);

  const handleGlobalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (livingMode) return;

    const target = e.target as HTMLElement;
    const isInteractive = Boolean(
      target.closest('button, a, input, textarea, select, [role="button"]')
    );

    recordStrike(e.clientX, e.clientY, isInteractive ? 0.55 : 1);

    if (isInteractive) return;

    const newSpark = {
      id: Math.random() + Date.now(),
      x: e.clientX,
      y: e.clientY
    };
    setSparks((prev) => [...prev, newSpark]);
  };

  return (
    <div onClick={handleGlobalClick} className={`forge-shell ${livingMode ? 'forge-shell-living' : ''}`}>
      {!livingMode && (
        <>
          <AnvilMemoryCanvas />
          <ForgeAtmosphere />
          <CursorGlow />
          <StrikeEcho />
        </>
      )}
      <div className="forge-shell-content">{children}</div>

      {!livingMode &&
        sparks.map((spark) => (
          <SparkBurst
            key={spark.id}
            x={spark.x}
            y={spark.y}
            onComplete={() => setSparks((prev) => prev.filter((s) => s.id !== spark.id))}
          />
        ))}

      {!livingMode && toast && <div className="forge-toast molten-border">{toast.summary}</div>}
    </div>
  );
};

export const ForgeShell: React.FC<ShellProps> = ({ children, livingMode = false }) => {
  return (
    <ForgeExperienceProvider baseHeat={30} simulate={livingMode}>
      <ForgeShellInner livingMode={livingMode}>{children}</ForgeShellInner>
    </ForgeExperienceProvider>
  );
};

export default ForgeShell;

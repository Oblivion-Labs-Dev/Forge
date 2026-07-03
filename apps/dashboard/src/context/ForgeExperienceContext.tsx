import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { buildSessionReport, buildSessionSig } from '../lib/sessionReport';
import type { SectionStatus } from '../lib/sectionStatus';

export interface ForgeStrike {
  id: number;
  x: number;
  y: number;
  intensity: number;
  timestamp: number;
}

export type ForgeTemper = 'embers' | 'kindling' | 'working' | 'white-hot';

interface ForgeExperienceValue {
  heat: number;
  temper: ForgeTemper;
  temperLabel: string;
  strikeCount: number;
  strikes: ForgeStrike[];
  replayIndex: number | null;
  sessionSig: string;
  recordStrike: (x: number, y: number, intensity?: number) => void;
  recordHammerEvent: () => void;
  syncActivity: (activity: { activeArtisans: number; progress: number }) => void;
  setReplayIndex: (index: number | null) => void;
  copySessionReport: (payload: {
    progress: number;
    successRate: number;
    summaryLine: string;
    sectionStatuses: Array<{ name: string; status: SectionStatus }>;
  }) => Promise<boolean>;
}

const TEMPER_LABELS: Record<ForgeTemper, string> = {
  embers: 'Embers — resting forge',
  kindling: 'Kindling — warming up',
  working: 'Working heat — artisans striking',
  'white-hot': 'White-hot — peak forge'
};

function resolveTemper(heat: number): ForgeTemper {
  if (heat >= 76) return 'white-hot';
  if (heat >= 51) return 'working';
  if (heat >= 26) return 'kindling';
  return 'embers';
}

const ForgeExperienceContext = createContext<ForgeExperienceValue | null>(null);

interface ProviderProps {
  children: ReactNode;
  baseHeat?: number;
  simulate?: boolean;
}

export function ForgeExperienceProvider({ children, baseHeat = 28, simulate = false }: ProviderProps) {
  const [heat, setHeat] = useState(baseHeat);
  const [strikeCount, setStrikeCount] = useState(0);
  const [strikes, setStrikes] = useState<ForgeStrike[]>([]);
  const [replayIndex, setReplayIndex] = useState<number | null>(null);

  const recordStrike = useCallback((x: number, y: number, intensity = 1) => {
    const strike: ForgeStrike = {
      id: Date.now() + Math.random(),
      x,
      y,
      intensity,
      timestamp: Date.now()
    };

    setReplayIndex(null);
    setStrikes((prev) => [...prev.slice(-80), strike]);
    setStrikeCount((count) => count + 1);
    setHeat((current) => Math.min(100, current + 4 * intensity));
  }, []);

  const recordHammerEvent = useCallback(() => {
    setHeat((current) => Math.min(100, current + 8));
  }, []);

  const syncActivity = useCallback(
    ({ activeArtisans, progress }: { activeArtisans: number; progress: number }) => {
      const floor = Math.min(88, progress * 0.38 + activeArtisans * 11);
      setHeat((current) => Math.max(current, floor));
    },
    []
  );

  const copySessionReport = useCallback(
    async (payload: {
      progress: number;
      successRate: number;
      summaryLine: string;
      sectionStatuses: Array<{ name: string; status: SectionStatus }>;
    }) => {
      const report = buildSessionReport({
        heat,
        temper: resolveTemper(heat),
        strikeCount,
        sessionSig: buildSessionSig(strikes),
        progress: payload.progress,
        successRate: payload.successRate,
        summaryLine: payload.summaryLine,
        sectionStatuses: payload.sectionStatuses
      });

      try {
        await navigator.clipboard.writeText(report);
        return true;
      } catch {
        return false;
      }
    },
    [heat, strikeCount, strikes]
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeat((current) => Math.max(baseHeat * 0.35, current - 0.35));
    }, 1200);
    return () => window.clearInterval(interval);
  }, [baseHeat]);

  useEffect(() => {
    if (!simulate) return;

    const interval = window.setInterval(() => {
      recordHammerEvent();
      recordStrike(
        window.innerWidth * (0.25 + Math.random() * 0.5),
        window.innerHeight * (0.35 + Math.random() * 0.35),
        0.7 + Math.random() * 0.5
      );
    }, 9000);

    return () => window.clearInterval(interval);
  }, [recordHammerEvent, recordStrike, simulate]);

  const temper = resolveTemper(heat);
  const sessionSig = buildSessionSig(strikes);

  useEffect(() => {
    document.documentElement.style.setProperty('--forge-heat', String(Math.round(heat)));
    document.documentElement.dataset.forgeTemper = temper;
  }, [heat, temper]);

  const value = useMemo(
    () => ({
      heat,
      temper,
      temperLabel: TEMPER_LABELS[temper],
      strikeCount,
      strikes,
      replayIndex,
      sessionSig,
      recordStrike,
      recordHammerEvent,
      syncActivity,
      setReplayIndex,
      copySessionReport
    }),
    [
      copySessionReport,
      heat,
      recordHammerEvent,
      recordStrike,
      replayIndex,
      sessionSig,
      strikeCount,
      strikes,
      syncActivity,
      temper
    ]
  );

  return <ForgeExperienceContext.Provider value={value}>{children}</ForgeExperienceContext.Provider>;
}

export function useForgeExperience(): ForgeExperienceValue {
  const context = useContext(ForgeExperienceContext);
  if (!context) {
    throw new Error('useForgeExperience must be used within ForgeExperienceProvider');
  }
  return context;
}

export function useForgeExperienceOptional(): ForgeExperienceValue | null {
  return useContext(ForgeExperienceContext);
}

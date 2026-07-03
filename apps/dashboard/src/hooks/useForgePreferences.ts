import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'forge-dashboard-preferences';

interface ForgePreferences {
  legendCollapsed: boolean;
  showOnlyNeedsWork: boolean;
  soundEnabled: boolean;
  keyboardHintsSeen: boolean;
}

const DEFAULTS: ForgePreferences = {
  legendCollapsed: false,
  showOnlyNeedsWork: false,
  soundEnabled: false,
  keyboardHintsSeen: false
};

function readPreferences(): ForgePreferences {
  if (typeof window === 'undefined') return DEFAULTS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function writePreferences(next: ForgePreferences) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function useForgePreferences() {
  const [prefs, setPrefs] = useState<ForgePreferences>(() => readPreferences());

  useEffect(() => {
    if (prefs.keyboardHintsSeen) return;
    const timer = window.setTimeout(() => {
      setPrefs((current) => {
        const next = { ...current, legendCollapsed: true, keyboardHintsSeen: true };
        writePreferences(next);
        return next;
      });
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [prefs.keyboardHintsSeen]);

  const update = useCallback((patch: Partial<ForgePreferences>) => {
    setPrefs((current) => {
      const next = { ...current, ...patch };
      writePreferences(next);
      return next;
    });
  }, []);

  return {
    ...prefs,
    setLegendCollapsed: (legendCollapsed: boolean) => update({ legendCollapsed }),
    setShowOnlyNeedsWork: (showOnlyNeedsWork: boolean) => update({ showOnlyNeedsWork }),
    setSoundEnabled: (soundEnabled: boolean) => update({ soundEnabled }),
    toggleLegend: () => update({ legendCollapsed: !prefs.legendCollapsed }),
    toggleNeedsWorkFilter: () => update({ showOnlyNeedsWork: !prefs.showOnlyNeedsWork }),
    toggleSound: () => update({ soundEnabled: !prefs.soundEnabled })
  };
}

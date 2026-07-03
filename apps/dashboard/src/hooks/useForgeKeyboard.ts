import { useEffect } from 'react';
import { KEYBOARD_STEP_IDS } from '../lib/forgeMappings';

interface ForgeKeyboardOptions {
  onFocusStep: (stepId: string) => void;
  onClearFocus: () => void;
  enabled?: boolean;
}

export function useForgeKeyboard({ onFocusStep, onClearFocus, enabled = true }: ForgeKeyboardOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;

      if (event.key === 'Escape') {
        onClearFocus();
        return;
      }

      const stepIndex = Number(event.key) - 1;
      if (stepIndex >= 0 && stepIndex < KEYBOARD_STEP_IDS.length) {
        onFocusStep(KEYBOARD_STEP_IDS[stepIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onClearFocus, onFocusStep]);
}

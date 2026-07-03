import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForgeExperience } from '../../context/ForgeExperienceContext';
import { useForgePreferences } from '../../hooks/useForgePreferences';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { playAnvilRing } from '../../hooks/useForgeSound';

export const StrikeEcho: React.FC = () => {
  const { strikeCount, temper } = useForgeExperience();
  const { soundEnabled } = useForgePreferences();
  const reduced = useReducedMotion();
  const lastStrike = useRef(strikeCount);

  useEffect(() => {
    if (strikeCount === lastStrike.current) return;
    lastStrike.current = strikeCount;
    if (soundEnabled && !reduced) {
      playAnvilRing(temper === 'white-hot' ? 1 : 0.75);
    }
  }, [reduced, soundEnabled, strikeCount, temper]);

  if (reduced) return null;

  const intensity = temper === 'white-hot' ? 0.75 : temper === 'working' ? 0.55 : 0.35;

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={strikeCount}
        className="strike-echo"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: [0, intensity, 0], scale: [1.02, 1, 1.01] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />
    </AnimatePresence>
  );
};

export default StrikeEcho;

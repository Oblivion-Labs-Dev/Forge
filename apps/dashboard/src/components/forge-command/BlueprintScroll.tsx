import { motion } from 'framer-motion';
import { usePointerParallax } from '../../hooks/usePointerParallax';
import { springSoft } from '../forge-ui/motionPresets';

interface BlueprintProps {
  title: string;
  progress: number;
  activeArtisans: number;
}

export const BlueprintScroll: React.FC<BlueprintProps> = ({ title, progress, activeArtisans }) => {
  const pointer = usePointerParallax(1);

  return (
    <div className="blueprint-content">
      <motion.div
        className="hero-parallax-bg"
        aria-hidden
        animate={{ x: pointer.x * 18, y: pointer.y * 12, scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 80, damping: 22, mass: 0.6 }}
      />
      <motion.div
        className="hero-parallax-ember"
        aria-hidden
        animate={{ x: pointer.x * -24, y: pointer.y * -16 }}
        transition={{ type: 'spring', stiffness: 60, damping: 20, mass: 0.8 }}
      />
      <motion.div
        className="blueprint-live-tag"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...springSoft, delay: 0.05 }}
      >
        <span className="blueprint-live-dot" />
        Forging now
      </motion.div>
      <motion.h2
        className="blueprint-title"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, x: pointer.x * 4, y: 8 + pointer.y * 2 }}
        transition={{ ...springSoft, delay: 0.08 }}
      >
        {title}
      </motion.h2>
      <div className="blueprint-progress-track blueprint-progress-molten">
        <motion.div
          className="blueprint-progress-fill blueprint-progress-fill-molten"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ...springSoft, delay: 0.12 }}
        >
          <span className="blueprint-progress-shimmer" />
          <span className="blueprint-progress-meniscus" />
        </motion.div>
      </div>
      <motion.div
        className="blueprint-meta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        <span className="blueprint-progress-value">{progress}% complete</span>
        <span className="blueprint-meta-divider">·</span>
        <span>{activeArtisans} artisans at work</span>
      </motion.div>
    </div>
  );
};

export default BlueprintScroll;

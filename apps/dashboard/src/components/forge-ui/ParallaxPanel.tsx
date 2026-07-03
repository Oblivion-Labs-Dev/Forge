import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type HTMLMotionProps
} from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { springSoft } from './motionPresets';
import { SECTION_STATUS, type SectionStatus } from '../../lib/sectionStatus';
import SectionCardHeader from './SectionCardHeader';

interface ParallaxPanelProps extends Omit<HTMLMotionProps<'section'>, 'children'> {
  children: ReactNode;
  tilt?: boolean;
  spotlight?: boolean;
  lift?: boolean;
  status?: SectionStatus;
  sectionTitle?: string;
  sectionSubtitle?: string;
  hideHeader?: boolean;
}

export const ParallaxPanel: React.FC<ParallaxPanelProps> = ({
  children,
  className = '',
  tilt = true,
  spotlight = true,
  lift = true,
  status,
  sectionTitle,
  sectionSubtitle,
  hideHeader = false,
  ...rest
}) => {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 280, damping: 28 });
  const rotateY = useSpring(0, { stiffness: 280, damping: 28 });
  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);
  const spotlightBg = useMotionTemplate`radial-gradient(circle at ${spotlightX}% ${spotlightY}%, rgba(232, 106, 44, 0.16) 0%, rgba(212, 168, 67, 0.06) 28%, transparent 58%)`;

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reduced || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    if (tilt) {
      rotateY.set((x - 0.5) * 10);
      rotateX.set((0.5 - y) * 7);
    }

    if (spotlight) {
      spotlightX.set(x * 100);
      spotlightY.set(y * 100);
    }
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.section
      ref={ref}
      className={`parallax-panel ${status ? SECTION_STATUS[status].className : ''} ${className}`}
      data-section-status={status}
      style={
        tilt && !reduced
          ? {
              rotateX,
              rotateY,
              transformPerspective: 900,
              transformStyle: 'preserve-3d'
            }
          : undefined
      }
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={lift && !reduced ? { y: -2, scale: 1.008 } : undefined}
      transition={springSoft}
      {...rest}
    >
      {spotlight && !reduced && (
        <motion.div className="parallax-panel-spotlight" style={{ background: spotlightBg }} />
      )}
      {status && <span className="section-status-accent" aria-hidden />}
      <div className="parallax-panel-content">
        {status && sectionTitle && !hideHeader && (
          <SectionCardHeader title={sectionTitle} subtitle={sectionSubtitle} status={status} />
        )}
        {children}
      </div>
    </motion.section>
  );
};

export default ParallaxPanel;

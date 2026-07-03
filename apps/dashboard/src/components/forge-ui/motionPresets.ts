export const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 }
  }
};

export const springSnappy = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 32
};

export const springSoft = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 26
};

export const pageTransition = {
  initial: { opacity: 0, y: 10, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)' },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
};

import React from 'react';
import { motion } from 'framer-motion';

interface MotionCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  onClick?: () => void;
}

export const MotionCard: React.FC<MotionCardProps> = ({ children, delay = 0, className = '', onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`backdrop-blur-md bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 shadow-lg cursor-pointer hover:border-amber-500/40 transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
export default MotionCard;

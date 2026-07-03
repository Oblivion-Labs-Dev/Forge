import { motion } from 'framer-motion';
import type { HammerStrikeEvent } from '../../lib/forge-client/types';
import { springSoft } from '../forge-ui/motionPresets';

interface TimelineProps {
  events: HammerStrikeEvent[];
  stale?: boolean;
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const LiveHammerTimeline: React.FC<TimelineProps> = ({ events, stale = false }) => {
  const latest = events[0];
  if (!latest) return null;

  const message = (latest as HammerStrikeEvent & { message?: string }).message || latest.summary;

  return (
    <motion.div
      key={latest.id}
      className={`pulse-latest ${stale ? 'pulse-latest-stale' : ''}`}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={springSoft}
    >
      <motion.span
        className="pulse-latest-icon"
        animate={{ scale: stale ? [1, 1.08, 1] : [1, 1.15, 1], opacity: [1, 0.85, 1] }}
        transition={{ duration: stale ? 2 : 1.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {stale ? '⏳' : '⚡'}
      </motion.span>
      <div className="pulse-latest-body">
        {stale && <span className="pulse-stale-badge">Needs attention</span>}
        <p className="pulse-latest-text">
          <strong>{latest.source.replace('Artisan', '')}</strong> — {message}
        </p>
        <span className="pulse-latest-time">{formatTime(latest.timestamp)}</span>
      </div>
    </motion.div>
  );
};

export default LiveHammerTimeline;

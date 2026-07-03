import { motion } from 'framer-motion';
import { Volume2, VolumeX, Filter, Keyboard, HelpCircle } from 'lucide-react';
import { useForgePreferences } from '../../hooks/useForgePreferences';
import SectionStatusLegend from './SectionStatusLegend';

export const ForgeControlBar: React.FC = () => {
  const {
    legendCollapsed,
    showOnlyNeedsWork,
    soundEnabled,
    toggleLegend,
    toggleNeedsWorkFilter,
    toggleSound
  } = useForgePreferences();

  return (
    <div className="forge-control-bar" data-testid="forge-control-bar">
      <div className="forge-control-bar-actions">
        <button
          type="button"
          className={`forge-control-btn ${showOnlyNeedsWork ? 'forge-control-btn-active' : ''}`}
          onClick={toggleNeedsWorkFilter}
          aria-pressed={showOnlyNeedsWork}
        >
          <Filter size={14} />
          Needs work only
        </button>
        <button
          type="button"
          className={`forge-control-btn ${soundEnabled ? 'forge-control-btn-active' : ''}`}
          onClick={toggleSound}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          Anvil sound
        </button>
        <button type="button" className="forge-control-btn" onClick={toggleLegend}>
          <HelpCircle size={14} />
          {legendCollapsed ? 'Status guide' : 'Hide guide'}
        </button>
      </div>

      <div className="forge-keyboard-hint" aria-label="Keyboard shortcuts">
        <Keyboard size={13} />
        <span>1–5 focus stages · Esc clear</span>
      </div>

      {!legendCollapsed && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <SectionStatusLegend />
        </motion.div>
      )}
    </div>
  );
};

export default ForgeControlBar;

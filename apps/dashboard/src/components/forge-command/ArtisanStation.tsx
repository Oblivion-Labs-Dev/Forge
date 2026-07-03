import { motion } from 'framer-motion';
import ArtisanCraftAura from '../forge-ui/ArtisanCraftAura';
import { resolveArtisanCardStatus, SECTION_STATUS } from '../../lib/sectionStatus';
import type { ForgeFlowNodeState } from '../forge-flow/ForgeFlowNode.types';
import { springSoft } from '../forge-ui/motionPresets';

interface StationProps {
  name: string;
  status: 'idle' | 'active' | 'thinking' | 'tooling' | 'reviewing' | 'failed' | 'complete';
  stepState?: ForgeFlowNodeState;
  focused?: boolean;
  onSelect?: () => void;
}

const SHORT_NAMES: Record<string, string> = {
  PlannerArtisan: 'Planner',
  BuilderArtisan: 'Builder',
  ReviewerArtisan: 'Reviewer',
  ResearchArtisan: 'Research'
};

export const ArtisanStation: React.FC<StationProps> = ({
  name,
  status,
  stepState = 'idle',
  focused = false,
  onSelect
}) => {
  const isActive = status === 'active' || status === 'thinking' || status === 'tooling';
  const label = SHORT_NAMES[name] ?? name.replace('Artisan', '');
  const cardStatus = resolveArtisanCardStatus(isActive ? 'active' : 'idle', stepState);
  const statusMeta = SECTION_STATUS[cardStatus];

  return (
    <motion.button
      type="button"
      className={`artisan-chip card-status-${cardStatus} ${isActive ? 'artisan-chip-active' : ''} ${focused ? 'artisan-chip-focused' : ''}`}
      title={`${name} · ${statusMeta.label}`}
      onClick={onSelect}
      layout
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={springSoft}
    >
      <span className="card-status-rail" aria-hidden />
      <ArtisanCraftAura name={name} active={isActive} />
      <span className={`artisan-chip-dot ${isActive ? 'artisan-chip-dot-live' : ''}`} />
      <span className="artisan-chip-name">{label}</span>
      <span className={`card-status-badge ${statusMeta.className}`}>{statusMeta.label}</span>
    </motion.button>
  );
};

export default ArtisanStation;

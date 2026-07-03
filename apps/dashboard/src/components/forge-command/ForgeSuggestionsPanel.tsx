import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { SECTION_STATUS } from '../../lib/sectionStatus';
import {
  buildForgeSuggestions,
  resolveSuggestionPanelStatus,
  type ForgeSuggestion,
  type SuggestionTarget
} from '../../lib/suggestions';
import { fadeUp, springSoft } from '../forge-ui/motionPresets';
import ParallaxPanel from '../forge-ui/ParallaxPanel';

interface ArtisanStatus {
  name: string;
  status: 'active' | 'idle';
}

interface ForgeSuggestionsPanelProps {
  progress: number;
  successRate: number;
  eventCount: number;
  latestEventTimestamp?: string;
  artisans: ArtisanStatus[];
  focusedStep: string | null;
  onNavigate: (target: SuggestionTarget) => void;
}

export const ForgeSuggestionsPanel: React.FC<ForgeSuggestionsPanelProps> = ({
  onNavigate,
  ...input
}) => {
  const suggestions = useMemo(() => buildForgeSuggestions(input), [input]);
  const status = resolveSuggestionPanelStatus(suggestions);

  return (
    <ParallaxPanel
      data-testid="section-suggestions"
      className="live-panel live-suggestions"
      variants={fadeUp}
      tilt={false}
      lift={false}
      status={status}
      sectionTitle="Suggested improvements"
      sectionSubtitle="Click a card to jump · prioritized by urgency"
    >
      <ul className="forge-suggestions-list">
        {suggestions.map((item, index) => (
          <SuggestionCard key={item.id} item={item} index={index} onNavigate={onNavigate} />
        ))}
      </ul>
    </ParallaxPanel>
  );
};

function SuggestionCard({
  item,
  index,
  onNavigate
}: {
  item: ForgeSuggestion;
  index: number;
  onNavigate: (target: SuggestionTarget) => void;
}) {
  const meta = SECTION_STATUS[item.status];

  return (
    <motion.li
      className={`forge-suggestion-item forge-suggestion-item-clickable ${meta.className}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...springSoft, delay: index * 0.05 }}
    >
      <button
        type="button"
        className="forge-suggestion-button"
        data-testid={`suggestion-${item.id}`}
        onClick={() => onNavigate(item.target)}
      >
        <span className="card-status-rail" aria-hidden />
        <div className="forge-suggestion-copy">
          <div className="forge-suggestion-topline">
            <span className="forge-suggestion-area">{item.area}</span>
            <span className={`card-status-badge card-status-badge-mini ${meta.className}`}>{meta.label}</span>
          </div>
          <strong className="forge-suggestion-title">{item.title}</strong>
          <p className="forge-suggestion-action">{item.action}</p>
        </div>
      </button>
    </motion.li>
  );
}

export default ForgeSuggestionsPanel;

import { motion } from 'framer-motion';

const CRAFT_PATTERNS: Record<string, { className: string; glyph: string }> = {
  PlannerArtisan: { className: 'craft-aura-planner', glyph: '⌗' },
  BuilderArtisan: { className: 'craft-aura-builder', glyph: '⚒' },
  ReviewerArtisan: { className: 'craft-aura-reviewer', glyph: '◎' },
  ResearchArtisan: { className: 'craft-aura-research', glyph: '✦' }
};

interface ArtisanCraftAuraProps {
  name: string;
  active: boolean;
}

export const ArtisanCraftAura: React.FC<ArtisanCraftAuraProps> = ({ name, active }) => {
  const craft = CRAFT_PATTERNS[name];
  if (!craft || !active) return null;

  return (
    <motion.span
      className={`artisan-craft-aura ${craft.className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      aria-hidden
    >
      <span className="artisan-craft-glyph">{craft.glyph}</span>
    </motion.span>
  );
};

export default ArtisanCraftAura;

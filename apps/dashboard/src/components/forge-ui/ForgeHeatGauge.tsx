import { motion } from 'framer-motion';
import { useForgeExperience } from '../../context/ForgeExperienceContext';

const TEMPER_COLORS: Record<string, string> = {
  embers: '#8a7a62',
  kindling: '#c47a38',
  working: '#e86a2c',
  'white-hot': '#ffd080'
};

export const ForgeHeatGauge: React.FC = () => {
  const { heat, temper, temperLabel, strikeCount, sessionSig } = useForgeExperience();
  const fillColor = TEMPER_COLORS[temper] ?? TEMPER_COLORS.working;

  return (
    <div className="forge-heat-gauge" data-testid="forge-heat-gauge" title={temperLabel}>
      <div className="forge-heat-gauge-head">
        <span className="forge-heat-gauge-label">Forge heat</span>
        <span className="forge-heat-gauge-temper">{temper.replace('-', ' ')}</span>
      </div>

      <div className="forge-heat-gauge-track">
        <motion.div
          className="forge-heat-gauge-fill"
          animate={{
            width: `${heat}%`,
            boxShadow:
              heat > 70
                ? '0 0 18px rgba(255, 180, 80, 0.55), 0 0 32px rgba(232, 106, 44, 0.35)'
                : '0 0 10px rgba(232, 106, 44, 0.25)'
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          style={{ background: `linear-gradient(90deg, #8a3b18, ${fillColor}, #fff2cc)` }}
        >
          <span className="forge-heat-gauge-shimmer" />
        </motion.div>
      </div>

      <div className="forge-heat-gauge-meta">
        <span>{Math.round(heat)}°</span>
        <span className="forge-heat-gauge-divider">·</span>
        <span>{strikeCount} strikes</span>
        <span className="forge-heat-gauge-divider">·</span>
        <span className="forge-heat-gauge-sig">sig {sessionSig}</span>
      </div>
    </div>
  );
};

export default ForgeHeatGauge;

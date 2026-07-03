import React from 'react';
import { motion } from 'framer-motion';
import { resolveMetricStatus, SECTION_STATUS } from '../../lib/sectionStatus';
import { springSoft } from '../forge-ui/motionPresets';

interface MetricsProps {
  activeArtisans: number;
  successRate: number;
  strikeCount: number;
}

export const ForgeMetricsPanel: React.FC<MetricsProps> = ({
  activeArtisans,
  successRate,
  strikeCount
}) => {
  const values = { activeCount: activeArtisans, successRate, strikeCount };

  const stats = [
    {
      key: 'active' as const,
      label: 'Active',
      value: `${activeArtisans}/4`,
      className: 'metrics-strip-value'
    },
    {
      key: 'success' as const,
      label: 'Success',
      value: `${(successRate * 100).toFixed(0)}%`,
      className: 'metrics-strip-value metrics-strip-value-success'
    },
    {
      key: 'strikes' as const,
      label: 'Strikes',
      value: String(strikeCount),
      className: 'metrics-strip-value metrics-strip-value-gold'
    }
  ];

  return (
    <div className="metrics-strip">
      {stats.map((stat, index) => {
        const cardStatus = resolveMetricStatus(stat.key, values);
        const statusMeta = SECTION_STATUS[cardStatus];

        return (
          <React.Fragment key={stat.label}>
            {index > 0 && <span className="metrics-strip-divider" />}
            <motion.div
              className={`metrics-strip-item metrics-strip-item-interactive card-status-${cardStatus}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springSoft, delay: 0.05 * index }}
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="card-status-rail" aria-hidden />
              <span className={`card-status-badge card-status-badge-mini ${statusMeta.className}`}>
                {statusMeta.label}
              </span>
              <motion.span
                className={stat.className}
                key={stat.value}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springSoft}
              >
                {stat.value}
              </motion.span>
              <span className="metrics-strip-label">{stat.label}</span>
            </motion.div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ForgeMetricsPanel;

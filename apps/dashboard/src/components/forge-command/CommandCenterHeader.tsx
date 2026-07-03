import React from 'react';
import { motion } from 'framer-motion';
import ForgeHeatGauge from '../forge-ui/ForgeHeatGauge';
import ExportSessionButton from '../forge-ui/ExportSessionButton';
import { fadeUp, springSoft } from '../forge-ui/motionPresets';
import type { SectionStatus } from '../../lib/sectionStatus';

interface CommandCenterHeaderProps {
  progress: number;
  successRate: number;
  summaryLine: string;
  sectionStatuses: Array<{ name: string; status: SectionStatus }>;
}

export const CommandCenterHeader: React.FC<CommandCenterHeaderProps> = ({
  progress,
  successRate,
  summaryLine,
  sectionStatuses
}) => {
  return (
    <motion.header
      data-testid="command-center-header"
      className="command-center-header"
      initial={fadeUp.initial}
      animate={fadeUp.animate}
      transition={springSoft}
    >
      <div className="command-center-header-text">
        <h1 className="command-center-title">Forge Command Center</h1>
        <p className="command-center-subtitle">
          Every strike leaves a mark on the anvil — color shows what needs work
        </p>
      </div>

      <div className="command-center-header-actions">
        <ForgeHeatGauge />
        <ExportSessionButton
          progress={progress}
          successRate={successRate}
          summaryLine={summaryLine}
          sectionStatuses={sectionStatuses}
        />
        <motion.div
          className="forge-status-badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springSoft, delay: 0.06 }}
        >
          <span className="forge-status-dot" />
          Forge Active
        </motion.div>
      </div>
    </motion.header>
  );
};

export default CommandCenterHeader;

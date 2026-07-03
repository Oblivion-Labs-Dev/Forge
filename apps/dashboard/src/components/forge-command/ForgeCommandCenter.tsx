import { useCallback, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BlueprintScroll from './BlueprintScroll';
import ArtisanStation from './ArtisanStation';
import LiveHammerTimeline from './LiveHammerTimeline';
import ForgeMetricsPanel from './ForgeMetricsPanel';
import ForgeSuggestionsPanel from './ForgeSuggestionsPanel';
import ForgePipelineFlow, { resolveStepState } from '../forge-flow/ForgePipelineFlow';
import ParallaxPanel from '../forge-ui/ParallaxPanel';
import BlueprintConstellation from '../forge-ui/BlueprintConstellation';
import ForgeControlBar from '../forge-ui/ForgeControlBar';
import ForgePageSummary from '../forge-ui/ForgePageSummary';
import AnvilReplayScrubber from '../forge-ui/AnvilReplayScrubber';
import { fadeUp, springSoft, staggerContainer } from '../forge-ui/motionPresets';
import {
  resolveActivityStatus,
  resolveBlueprintStatus,
  resolveHealthStatus,
  resolvePipelineStatus,
  resolveTeamStatus,
  shouldShowSection,
  summarizeStatuses
} from '../../lib/sectionStatus';
import {
  ARTISAN_TO_STEP,
  SECTION_IDS,
  STEP_TO_ARTISAN,
  type PipelineStepId
} from '../../lib/forgeMappings';
import { deriveRuntimeMetrics } from '../../lib/runtimeMetrics';
import type { SuggestionTarget } from '../../lib/suggestions';
import { useForgeExperience } from '../../context/ForgeExperienceContext';
import { useForgeKeyboard } from '../../hooks/useForgeKeyboard';
import { useForgePreferences } from '../../hooks/useForgePreferences';
import type { ForgeRuntimeSnapshot, HammerStrikeEvent } from '../../lib/forge-client/types';

interface CenterProps {
  snapshot: ForgeRuntimeSnapshot | null;
  events: HammerStrikeEvent[];
}

export const ForgeCommandCenter: React.FC<CenterProps> = ({ snapshot, events }) => {
  const [focusedStep, setFocusedStep] = useState<PipelineStepId | null>('builder');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const { strikeCount } = useForgeExperience();
  const { showOnlyNeedsWork } = useForgePreferences();

  const metrics = useMemo(
    () => deriveRuntimeMetrics(snapshot, events, strikeCount),
    [events, snapshot, strikeCount]
  );

  const activeWorkpiece = snapshot?.workpieces.find((w) => w.status === 'active');
  const latestEvent = events[0];
  const latestTimestamp = latestEvent?.timestamp;

  const sectionStatuses = useMemo(
    () => [
      { id: SECTION_IDS.blueprint, name: 'Workpiece', status: resolveBlueprintStatus(metrics.progress) },
      {
        id: SECTION_IDS.flow,
        name: 'Pipeline',
        status: resolvePipelineStatus(metrics.progress, metrics.activeArtisanCount)
      },
      { id: SECTION_IDS.artisans, name: 'Team', status: resolveTeamStatus(metrics.activeArtisanCount, metrics.artisans.length) },
      { id: SECTION_IDS.health, name: 'Health', status: resolveHealthStatus(metrics.successRate) },
      {
        id: SECTION_IDS.activity,
        name: 'Pulse',
        status: resolveActivityStatus(events.length, latestTimestamp)
      }
    ],
    [events.length, latestTimestamp, metrics.activeArtisanCount, metrics.artisans.length, metrics.progress, metrics.successRate]
  );

  const summary = summarizeStatuses(sectionStatuses.map((entry) => entry.status));
  const focusedArtisan = focusedStep ? STEP_TO_ARTISAN[focusedStep] : null;

  const scrollToSection = useCallback((id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleStepFocus = useCallback((stepId: string) => {
    setFocusedStep((current) => (current === stepId ? null : (stepId as PipelineStepId)));
    scrollToSection(SECTION_IDS.flow);
  }, [scrollToSection]);

  const handleArtisanFocus = useCallback(
    (name: string) => {
      const stepId = ARTISAN_TO_STEP[name];
      if (stepId) {
        setFocusedStep((current) => (current === stepId ? null : stepId));
        scrollToSection(SECTION_IDS.artisans);
      }
    },
    [scrollToSection]
  );

  const handleSuggestionNavigate = useCallback(
    (target: SuggestionTarget) => {
      if (target.type === 'section') {
        scrollToSection(target.id);
        return;
      }
      if (target.type === 'step') {
        handleStepFocus(target.id);
        return;
      }
      handleArtisanFocus(target.name);
    },
    [handleArtisanFocus, handleStepFocus, scrollToSection]
  );

  useForgeKeyboard({
    onFocusStep: handleStepFocus,
    onClearFocus: () => setFocusedStep(null)
  });

  const registerSection = useCallback((id: string, node: HTMLElement | null) => {
    sectionRefs.current[id] = node;
  }, []);

  const renderSection = (
    id: string,
    status: (typeof sectionStatuses)[number]['status'],
    node: React.ReactNode
  ) => {
    if (!shouldShowSection(status, showOnlyNeedsWork)) return null;
    return (
      <div ref={(nodeRef) => registerSection(id, nodeRef)} data-section-anchor={id}>
        {node}
      </div>
    );
  };

  return (
    <motion.div
      data-testid="command-center"
      className="command-center-live"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <ForgePageSummary statuses={sectionStatuses} />
      <ForgeControlBar />
      <AnvilReplayScrubber />

      {renderSection(
        SECTION_IDS.blueprint,
        sectionStatuses[0].status,
        <ParallaxPanel
          data-testid="section-blueprint"
          className="live-panel live-hero"
          variants={fadeUp}
          spotlight
          tilt
          status={sectionStatuses[0].status}
          sectionTitle="Current workpiece"
          sectionSubtitle={`${metrics.progress}% forged`}
        >
          <BlueprintConstellation activeStep={focusedStep} />
          <BlueprintScroll
            title={activeWorkpiece?.name || 'Draft System Plan'}
            progress={metrics.progress}
            activeArtisans={metrics.activeArtisanCount}
          />
        </ParallaxPanel>
      )}

      {renderSection(
        SECTION_IDS.flow,
        sectionStatuses[1].status,
        <ForgePipelineFlow
          artisans={metrics.artisans}
          progress={metrics.progress}
          focusedStep={focusedStep}
          onStepFocus={handleStepFocus}
        />
      )}

      <ForgeSuggestionsPanel
        progress={metrics.progress}
        successRate={metrics.successRate}
        eventCount={events.length}
        latestEventTimestamp={latestTimestamp}
        artisans={metrics.artisans}
        focusedStep={focusedStep}
        onNavigate={handleSuggestionNavigate}
      />

      {renderSection(
        SECTION_IDS.artisans,
        sectionStatuses[2].status,
        <ParallaxPanel
          data-testid="section-artisans"
          className="live-panel live-crew"
          variants={fadeUp}
          tilt={false}
          status={sectionStatuses[2].status}
          sectionTitle="Team"
          sectionSubtitle="Tap a chip to focus the pipeline"
        >
          <motion.div className="artisan-row" layout>
            {metrics.artisans.map((artisan, index) => {
              const stepId = ARTISAN_TO_STEP[artisan.name];
              const isFocused = focusedStep === stepId;
              const stepState = resolveStepState(stepId, metrics.progress, metrics.artisans);

              return (
                <motion.div
                  key={artisan.name}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...springSoft, delay: 0.08 + index * 0.04 }}
                >
                  <ArtisanStation
                    name={artisan.name}
                    status={artisan.status}
                    stepState={stepState}
                    focused={isFocused}
                    onSelect={() => handleArtisanFocus(artisan.name)}
                  />
                </motion.div>
              );
            })}
          </motion.div>
          <AnimatePresence>
            {focusedArtisan && (
              <motion.p
                className="live-panel-hint"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={springSoft}
              >
                Focused on {focusedArtisan.replace('Artisan', '')} stage
              </motion.p>
            )}
          </AnimatePresence>
        </ParallaxPanel>
      )}

      {renderSection(
        SECTION_IDS.health,
        sectionStatuses[3].status,
        <ParallaxPanel
          data-testid="section-health"
          className="live-panel live-stats"
          variants={fadeUp}
          lift={false}
          tilt={false}
          status={sectionStatuses[3].status}
          sectionTitle="System health"
          sectionSubtitle="Live forge metrics"
        >
          <ForgeMetricsPanel
            activeArtisans={metrics.activeArtisanCount}
            successRate={metrics.successRate}
            strikeCount={metrics.strikeCount}
          />
        </ParallaxPanel>
      )}

      {renderSection(
        SECTION_IDS.activity,
        sectionStatuses[4].status,
        <ParallaxPanel
          data-testid="section-activity"
          className="live-panel live-pulse"
          variants={fadeUp}
          tilt={false}
          status={sectionStatuses[4].status}
          sectionTitle="Latest pulse"
          sectionSubtitle={
            sectionStatuses[4].status === 'queued' ? 'Feed may be stale — check runtime' : 'Most recent hammer strike'
          }
        >
          <AnimatePresence mode="wait">
            <LiveHammerTimeline events={events} stale={sectionStatuses[4].status === 'queued'} />
          </AnimatePresence>
        </ParallaxPanel>
      )}

      {showOnlyNeedsWork && sectionStatuses.every((entry) => !shouldShowSection(entry.status, true)) && (
        <p className="forge-filter-empty">Nothing needs immediate work — toggle off the filter to see everything.</p>
      )}
    </motion.div>
  );
};

export default ForgeCommandCenter;

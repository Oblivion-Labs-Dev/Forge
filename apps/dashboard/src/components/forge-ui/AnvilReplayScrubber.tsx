import { useForgeExperience } from '../../context/ForgeExperienceContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const AnvilReplayScrubber: React.FC = () => {
  const { strikes, replayIndex, setReplayIndex } = useForgeExperience();
  const reduced = useReducedMotion();

  if (reduced || strikes.length === 0) return null;

  const maxIndex = strikes.length - 1;
  const currentIndex = replayIndex ?? maxIndex;

  return (
    <div className="anvil-replay" data-testid="anvil-replay">
      <div className="anvil-replay-head">
        <span className="anvil-replay-label">Anvil replay</span>
        <button
          type="button"
          className="forge-control-btn forge-control-btn-mini"
          onClick={() => setReplayIndex(replayIndex == null ? maxIndex : null)}
        >
          {replayIndex == null ? 'Replay mode' : 'Live mode'}
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={maxIndex}
        value={currentIndex}
        className="anvil-replay-slider"
        onChange={(event) => setReplayIndex(Number(event.target.value))}
        aria-label="Scrub anvil strike history"
      />
      <div className="anvil-replay-meta">
        Strike {currentIndex + 1} of {strikes.length}
      </div>
    </div>
  );
};

export default AnvilReplayScrubber;

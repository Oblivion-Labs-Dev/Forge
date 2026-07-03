let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function playAnvilRing(intensity = 1): void {
  const context = getAudioContext();
  if (!context) return;

  const now = context.currentTime;
  const gain = context.createGain();
  gain.connect(context.destination);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08 * intensity, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

  const oscillator = context.createOscillator();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(820, now);
  oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.18);
  oscillator.connect(gain);
  oscillator.start(now);
  oscillator.stop(now + 0.3);

  const noiseGain = context.createGain();
  noiseGain.connect(context.destination);
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.035 * intensity, now + 0.005);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  const buffer = context.createBuffer(1, context.sampleRate * 0.08, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const noise = context.createBufferSource();
  noise.buffer = buffer;
  noise.connect(noiseGain);
  noise.start(now);
  noise.stop(now + 0.08);
}

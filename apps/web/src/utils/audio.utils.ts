let sharedContext: AudioContext | null = null;

/**
 * Returns the process-wide `AudioContext`, creating it on first use.
 *
 * A single context is shared across every sound in the app: browsers cap how
 * many can exist, and iOS in particular misbehaves once a page opens several.
 * Resumes the context when it is suspended, which is the state mobile
 * browsers start it in until a user gesture unlocks audio.
 *
 * Returns `null` where Web Audio isn't available, so callers can treat sound
 * as optional rather than guarding every call site with try/catch.
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!sharedContext) {
    try {
      sharedContext = new AudioContext();
    } catch {
      return null;
    }
  }

  if (sharedContext.state === 'suspended') void sharedContext.resume();
  return sharedContext;
}

interface BlipOptions {
  /** Fade-out length in seconds. */
  duration?: number;
  /** Oscillator frequency in Hz. */
  frequency: number;
  /** Peak gain, 0–1. Anything above ~0.5 clips against the metronome click. */
  gain: number;
  /**
   * Absolute time on the `AudioContext` clock to sound at. Omit to play
   * immediately; pass a future value for sample-accurate scheduling.
   */
  when?: number;
}

/**
 * Plays a short percussive blip — the building block for both the metronome
 * click and UI feedback ticks.
 *
 * Uses an exponential gain ramp rather than a hard stop: cutting an
 * oscillator abruptly produces an audible pop.
 */
export function playBlip({ duration = 0.05, frequency, gain, when }: BlipOptions): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const time = when ?? ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(gain, time);
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start(time);
  oscillator.stop(time + duration);
}

'use client';

import { useCallback, useRef } from 'react';

/**
 * Produces a short percussive click via the Web Audio API — a higher-pitched
 * ping (1 400 Hz) for accented beats and a softer one (900 Hz) otherwise.
 *
 * The `AudioContext` is lazily created on the first call and reused for the
 * lifetime of the component. Returns a stable callback that never changes
 * identity.
 */
export function useMetronomeClicker(): (accent: boolean) => void {
  const ctxRef = useRef<AudioContext | null>(null);

  return useCallback((accent: boolean) => {
    try {
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext();
      }
      const ctx = ctxRef.current;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.frequency.value = accent ? 1400 : 900;
      gain.gain.setValueAtTime(accent ? 0.5 : 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.05);
    } catch {
      // Silently ignore — audio is a nice-to-have, not a requirement.
    }
  }, []);
}

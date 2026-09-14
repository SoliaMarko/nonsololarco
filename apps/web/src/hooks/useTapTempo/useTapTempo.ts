'use client';

import { useCallback, useRef } from 'react';

import { clampBpm } from '@/src/utils/metronome.utils';

const TAP_WINDOW_MS = 3000;

/**
 * Tracks the timing of repeated taps and returns the average BPM once at
 * least two taps are recorded within a 3-second window.
 *
 * Taps older than 3 s are discarded automatically so stale taps never
 * pollute the average. Returns `null` when fewer than two taps exist in the
 * window.
 */
export function useTapTempo(): (onBpm: (bpm: number) => void) => void {
  const tapsRef = useRef<number[]>([]);

  return useCallback((onBpm: (bpm: number) => void) => {
    const now = performance.now();
    tapsRef.current = [...tapsRef.current.filter((t) => now - t < TAP_WINDOW_MS), now];

    if (tapsRef.current.length >= 2) {
      const taps = tapsRef.current;
      const last = taps[taps.length - 1]!;
      const first = taps[0]!;
      const avg = (last - first) / (taps.length - 1);
      onBpm(clampBpm(Math.round(60000 / avg)));
    }
  }, []);
}

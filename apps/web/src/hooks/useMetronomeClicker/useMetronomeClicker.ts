'use client';

import { useCallback } from 'react';

import { getAudioContext, playBlip } from '@/src/utils/audio.utils';

export interface MetronomeClicker {
  /**
   * Returns the shared `AudioContext`, or `null` where Web Audio isn't
   * available. Callers need it to read `currentTime` when scheduling ahead.
   */
  getContext: () => AudioContext | null;
  /**
   * Schedules a single click on the audio clock. `accent` selects the
   * downbeat pitch (1 400 Hz) versus the off-beat pitch (900 Hz). `when`
   * is an absolute `AudioContext.currentTime` value; omit it to play now.
   */
  scheduleClick: (accent: boolean, when?: number) => void;
}

/**
 * Audio layer for the metronome: knows what a click sounds like and how to
 * place it on the shared audio clock. The scheduling logic — lookahead,
 * visual sync — lives in `useMetronomeEngine`, which consumes this hook.
 */
export function useMetronomeClicker(): MetronomeClicker {
  const scheduleClick = useCallback((accent: boolean, when?: number) => {
    playBlip({
      frequency: accent ? 1400 : 900,
      gain: accent ? 0.5 : 0.3,
      when,
    });
  }, []);

  return { getContext: getAudioContext, scheduleClick };
}

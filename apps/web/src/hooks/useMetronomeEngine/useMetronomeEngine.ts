'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useMetronomeClicker } from '@/src/hooks/useMetronomeClicker';

interface UseMetronomeEngineOptions {
  /** Number of beats per bar — the first beat of each bar is accented. */
  beats: number;
  /** Tempo in beats per minute. */
  bpm: number;
  /**
   * Called on the animation frame when a scheduled beat becomes audible.
   * Receives the beat index within the bar (0-based; 0 is the downbeat).
   */
  onBeat: (beatInBar: number) => void;
  /** Whether the metronome is currently running. */
  playing: boolean;
}

interface UseMetronomeEngineResult {
  /**
   * Continuous position on the beat timeline, in beats, read straight from
   * the audio clock — `2.5` means halfway between the third and fourth
   * beat. Returns `null` before the first beat sounds or while stopped.
   *
   * Intended for animation loops that must stay locked to the click.
   * Because it is a plain function over `AudioContext.currentTime` rather
   * than React state, callers can sample it every frame without causing a
   * re-render.
   */
  getBeatPosition: () => number | null;
}

interface QueuedNote {
  /** Beat index within the bar, for the visual indicator. */
  beatInBar: number;
  /** Monotonic beat counter since playback started. */
  index: number;
  time: number;
}

/** How often the scheduler wakes to look ahead (ms). */
const LOOKAHEAD_MS = 25;

/** How far ahead audio is scheduled on the audio clock (seconds). */
const SCHEDULE_AHEAD = 0.1;

/**
 * Sample-accurate metronome engine built on the Web Audio "two clocks"
 * pattern (Chris Wilson). Audio is scheduled ahead of time on the
 * `AudioContext` clock, immune to main-thread jank; visuals read that same
 * clock, so nothing drifts out of step with the click.
 *
 * Tempo and time-signature changes are picked up live via refs without
 * restarting playback, so scrubbing BPM doesn't cause a hiccup.
 */
export function useMetronomeEngine({
  beats,
  bpm,
  onBeat,
  playing,
}: UseMetronomeEngineOptions): UseMetronomeEngineResult {
  const { getContext, scheduleClick } = useMetronomeClicker();

  const bpmRef = useRef(bpm);
  const beatsRef = useRef(beats);
  const onBeatRef = useRef(onBeat);

  bpmRef.current = bpm;
  beatsRef.current = beats;
  onBeatRef.current = onBeat;

  /** Last beat that actually sounded, used as the phase anchor. */
  const anchorRef = useRef<{ beats: number; time: number } | null>(null);

  const getBeatPosition = useCallback((): number | null => {
    const anchor = anchorRef.current;
    const ctx = getContext();
    if (!anchor || !ctx) return null;
    return anchor.beats + (ctx.currentTime - anchor.time) / (60 / bpmRef.current);
  }, [getContext]);

  useEffect(() => {
    if (!playing) {
      anchorRef.current = null;
      return;
    }

    const ctx = getContext();
    if (!ctx) return;

    const queue: QueuedNote[] = [];
    let noteIndex = 0;
    let nextNoteTime = ctx.currentTime + 0.05;
    let lastDrawn = -1;

    const scheduler = () => {
      // If the scheduler fell behind (backgrounded tab, GC pause, a big
      // tempo jump), don't machine-gun the missed beats — drop them and
      // resync to "now" so the pulse stays even.
      if (nextNoteTime < ctx.currentTime) {
        nextNoteTime = ctx.currentTime + 0.02;
      }

      while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
        const bars = Math.max(1, beatsRef.current);
        const beatInBar = noteIndex % bars;

        queue.push({ beatInBar, index: noteIndex, time: nextNoteTime });
        scheduleClick(beatInBar === 0, nextNoteTime);

        const secPerBeat = 60 / bpmRef.current;
        nextNoteTime += secPerBeat > 0 ? secPerBeat : 0.5;
        noteIndex++;
      }
    };

    const draw = () => {
      let beatToShow = lastDrawn;
      while (queue.length && queue[0].time <= ctx.currentTime) {
        const note = queue[0];
        beatToShow = note.beatInBar;
        anchorRef.current = { beats: note.index, time: note.time };
        queue.shift();
      }
      if (beatToShow !== lastDrawn) {
        lastDrawn = beatToShow;
        onBeatRef.current(beatToShow);
      }
      rafId = requestAnimationFrame(draw);
    };

    scheduler();
    const intervalId = setInterval(scheduler, LOOKAHEAD_MS);
    let rafId = requestAnimationFrame(draw);

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(rafId);
      anchorRef.current = null;
    };
  }, [playing, getContext, scheduleClick]);

  return { getBeatPosition };
}

'use client';

import { memo, useEffect, useRef } from 'react';

interface PendulumProps {
  /**
   * Reads the continuous beat position (in beats) off the audio clock.
   * Returns `null` while stopped or before the first beat sounds.
   */
  getBeatPosition: () => number | null;
  playing: boolean;
}

/** How far the arm leans from vertical, in degrees. */
const SWING_ANGLE = 14;

/**
 * Classic metronome pendulum with a trapezoid body, swinging arm, movable
 * weight, and a pivot dot at the base.
 *
 * The arm is driven by neither CSS keyframes nor React state. Both restart
 * their motion on every beat, and a restart that lands a frame late reads
 * as a stutter. Instead a `requestAnimationFrame` loop samples the audio
 * clock each frame and writes the transform directly to the node:
 *
 *     angle = -SWING_ANGLE * cos(π · beatPosition)
 *
 * That puts the extremes exactly on the beats (`cos` is ±1 at whole beat
 * numbers) and gives sinusoidal easing for free — slowest at the turns,
 * fastest through the middle, like a real weighted arm. Because it samples
 * the same clock the clicks are scheduled on, it cannot drift, and because
 * it never sets state it costs no re-renders.
 *
 * Memoised: the parent re-renders on every beat to move the dots, and each
 * of those renders would otherwise stomp on the transform the loop writes.
 */
function Pendulum({ getBeatPosition, playing }: PendulumProps) {
  const armRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const arm = armRef.current;
    if (!arm) return;

    if (!playing) {
      arm.style.transform = 'rotate(0deg)';
      return;
    }

    let rafId = 0;

    const frame = () => {
      const position = getBeatPosition();
      // Before the first beat lands, hold at the left extreme so the
      // opening swing covers the same arc as every one after it.
      const angle =
        position === null ? -SWING_ANGLE : -SWING_ANGLE * Math.cos(Math.PI * position);

      arm.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [playing, getBeatPosition]);

  return (
    <div className="relative size-50">
      {/* Trapezoid body */}
      <div
        className="mli-auto border-primary-dark absolute inset-x-0 block-end-0 h-52.5 w-40 border-3 bg-[linear-gradient(180deg,#e7dcc4,#d8c8a8)] shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
        style={{ clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0 100%)' }}
      />

      {/* Swinging arm — `transform` is deliberately absent here: the rAF
          loop owns it, and listing it in JSX would let React reset it to
          its initial value on every parent re-render. */}
      <div
        ref={armRef}
        className="bg-primary-dark absolute block-end-7.5 inset-s-1/2 z-3 h-45 w-1.25 origin-bottom rounded-sm will-change-transform"
        // Half the arm's width, to centre it on the pivot. A `-translate-x-1/2`
        // can't be used here: the rAF loop owns `transform`.
        style={{ marginInlineStart: '-2.5px' }}
      >
        {/* Weight */}
        <div className="border-primary-dark bg-yellow-main absolute block-start-7 inset-s-1/2 h-5 w-7.5 -translate-x-1/2 border-[2.5px]" />
      </div>

      {/* Pivot */}
      <div className="bg-primary-dark absolute block-end-6.5 inset-s-1/2 z-4 size-4 -translate-x-1/2 rounded-full" />
    </div>
  );
}

export default memo(Pendulum);

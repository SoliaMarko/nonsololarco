'use client';

import { useCallback, useRef } from 'react';

import { playBlip } from '@/src/utils/audio.utils';
import { cn } from '@/src/utils/cn';
import { MT_MAX, MT_MIN, MT_TICK_WIDTH, clampBpm } from '@/src/utils/metronome.utils';

interface BpmRulerProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
}

const EDGE_FADE = 'linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)';

/**
 * Horizontally draggable ruler strip that lets the user scrub through the
 * full BPM range. Major ticks appear every 10 BPM with labels every 20.
 * The strip fades at the edges via a CSS mask.
 *
 * Tick geometry stays in `px`: the strip is a ruler, and its marks must
 * align to device pixels rather than rescale with the reader's font size.
 */
export default function BpmRuler({ bpm, onBpmChange }: BpmRulerProps) {
  const dragRef = useRef<{ startBpm: number; startX: number } | null>(null);
  const shift = -((bpm - MT_MIN) * MT_TICK_WIDTH + MT_TICK_WIDTH / 2);

  const ticks: number[] = [];
  for (let v = MT_MIN; v <= MT_MAX; v++) ticks.push(v);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as Element).setPointerCapture(e.pointerId);
      dragRef.current = { startBpm: bpm, startX: e.clientX };

      // Tracked separately from `bpm`: the prop is a render-time snapshot and
      // would be stale inside this listener, making every move re-tick.
      let lastTickedBpm = bpm;

      const move = (ev: PointerEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const next = clampBpm(Math.round(dragRef.current.startBpm - dx / MT_TICK_WIDTH));
        if (next === lastTickedBpm) return;

        // One quiet tick per tick mark passed, like a real detented dial.
        // Quieter and higher than the metronome click so the two never
        // get confused while the metronome is running.
        lastTickedBpm = next;
        playBlip({ duration: 0.02, frequency: 2200, gain: 0.06 });
        onBpmChange(next);
      };

      const up = () => {
        dragRef.current = null;
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        document.removeEventListener('pointercancel', up);
      };

      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
      document.addEventListener('pointercancel', up);
    },
    [bpm, onBpmChange],
  );

  return (
    <div
      className="mli-6 mbs-2 relative h-14 cursor-grab touch-none overflow-hidden select-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
    >
      <div
        className="absolute inset-s-1/2 top-3.5 flex h-7.5 items-start will-change-transform"
        style={{ transform: `translateX(${shift}px)` }}
      >
        {ticks.map((v) => {
          const isMajor = v % 10 === 0;
          return (
            <div key={v} className="flex w-3.5 shrink-0 flex-col items-center">
              <i
                className={cn(
                  'block w-0.5',
                  isMajor ? 'bg-primary-light/70 h-5' : 'bg-primary-light/40 h-2.5',
                )}
              />
              {v % 20 === 0 && (
                <span className="font-label text-primary-light/50 mbs-1 text-[0.5625rem]">
                  {v}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Pointer triangle */}
      <div className="absolute inset-s-1/2 top-1 z-3 -translate-x-1/2">
        <svg width="16" height="12" viewBox="0 0 16 12">
          <path d="M8 12L1 0h14z" fill="var(--yellow-main)" stroke="#1c1a18" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

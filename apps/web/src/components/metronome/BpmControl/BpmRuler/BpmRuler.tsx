'use client';

import { useCallback, useRef } from 'react';

import { MT_MAX, MT_MIN, MT_TICK_WIDTH, clampBpm } from '@/src/utils/metronome.utils';

interface BpmRulerProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
}

/**
 * Horizontally draggable ruler strip that lets the user scrub through the
 * full BPM range. Major ticks appear every 10 BPM with labels every 20.
 * The strip fades at the edges via a CSS mask.
 */
export default function BpmRuler({ bpm, onBpmChange }: BpmRulerProps) {
  const dragRef = useRef<{ startBpm: number; startX: number } | null>(null);
  const shift = -((bpm - MT_MIN) * MT_TICK_WIDTH + MT_TICK_WIDTH / 2);

  const ticks: number[] = [];
  for (let v = MT_MIN; v <= MT_MAX; v++) ticks.push(v);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragRef.current = { startBpm: bpm, startX: e.clientX };

      const move = (ev: PointerEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        onBpmChange(clampBpm(Math.round(dragRef.current.startBpm - dx / MT_TICK_WIDTH)));
      };

      const up = () => {
        dragRef.current = null;
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
      };

      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    },
    [bpm, onBpmChange],
  );

  return (
    <div
      className="relative h-14 cursor-grab overflow-hidden select-none active:cursor-grabbing"
      style={{
        margin: '10px 26px 0',
        maskImage: 'linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)',
      }}
      onPointerDown={onPointerDown}
    >
      <div
        className="absolute flex items-start will-change-transform"
        style={{
          top: '14px',
          left: '50%',
          height: '30px',
          transform: `translateX(${shift}px)`,
        }}
      >
        {ticks.map((v) => {
          const isMajor = v % 10 === 0;
          return (
            <div
              key={v}
              className="flex w-[14px] shrink-0 flex-col items-center"
            >
              <i
                className="block w-0.5"
                style={{
                  height: isMajor ? '20px' : '10px',
                  background: isMajor
                    ? 'rgba(240,232,216,0.7)'
                    : 'rgba(240,232,216,0.4)',
                }}
              />
              {v % 20 === 0 && (
                <span
                  className="font-mono text-[9px] text-primary-light/50"
                  style={{ marginTop: '3px' }}
                >
                  {v}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Pointer triangle */}
      <div className="absolute z-3" style={{ top: '4px', left: '50%', transform: 'translateX(-50%)' }}>
        <svg width="16" height="12" viewBox="0 0 16 12">
          <path
            d="M8 12L1 0h14z"
            fill="var(--yellow-main)"
            stroke="#1c1a18"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}

'use client';

import { cn } from '@/src/utils/cn';

interface PendulumProps {
  bpm: number;
  playing: boolean;
}

/**
 * Classic metronome pendulum with a trapezoid body, swinging arm, movable
 * weight, and a pivot dot at the base.
 *
 * The swing animation duration is derived from BPM via the `--beat` CSS
 * custom property.
 */
export default function Pendulum({ bpm, playing }: PendulumProps) {
  const beat = `${(60 / bpm).toFixed(3)}s`;

  return (
    <div className="relative size-[200px]">
      {/* Trapezoid body */}
      <div
        className="absolute inset-x-0 bottom-0 mli-auto h-[210px] w-[160px] border-3 border-primary-dark"
        style={{
          background: 'linear-gradient(180deg, #e7dcc4, #d8c8a8)',
          clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0 100%)',
          boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
        }}
      />

      {/* Scale line */}
      <div
        className="absolute inset-x-0 mli-auto w-0.5 opacity-25"
        style={{
          top: '18px',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1c1a18',
        }}
      />

      {/* Swinging arm */}
      <div
        className={cn('absolute z-3 w-[5px] rounded-sm', playing && 'animate-[mt-swing_var(--beat)_ease-in-out_infinite_alternate]')}
        style={{
          '--beat': beat,
          left: '50%',
          bottom: '30px',
          height: '180px',
          marginLeft: '-2.5px',
          transformOrigin: 'bottom center',
          background: '#1c1a18',
        } as React.CSSProperties}
      >
        {/* Weight */}
        <div
          className="absolute border-[2.5px] border-primary-dark bg-yellow-main"
          style={{
            left: '50%',
            top: '28px',
            transform: 'translateX(-50%)',
            width: '30px',
            height: '20px',
          }}
        />
      </div>

      {/* Pivot */}
      <div
        className="absolute z-4 size-4 rounded-full"
        style={{
          left: '50%',
          bottom: '26px',
          transform: 'translateX(-50%)',
          background: '#1c1a18',
        }}
      />
    </div>
  );
}

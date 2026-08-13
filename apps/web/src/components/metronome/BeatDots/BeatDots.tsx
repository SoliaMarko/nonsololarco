'use client';

import { TimeSignatureDef } from '@/src/lib/types/metronome.types';
import { cn } from '@/src/utils/cn';

interface BeatDotsProps {
  activeBeat: number;
  signature: TimeSignatureDef;
}

/**
 * Horizontal row of beat indicator dots. The first dot (downbeat) flashes
 * red on its accent; subsequent dots flash yellow.
 */
export default function BeatDots({ activeBeat, signature }: BeatDotsProps) {
  const dotState = (index: number) => {
    if (activeBeat !== index) return 'border-primary-light/40 bg-transparent';
    if (index === 0) return 'border-accent-red bg-accent-red shadow-[0_0_14px_var(--accent-red)]';
    return 'border-yellow-main bg-yellow-main shadow-[0_0_14px_var(--yellow-main)]';
  };

  return (
    <div className="mbe-2 flex flex-wrap justify-center gap-2">
      {Array.from({ length: signature.beats }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'block size-3.25 rounded-full border-2',
            'transition-[background-color,border-color,box-shadow] duration-75',
            dotState(i),
          )}
        />
      ))}
    </div>
  );
}

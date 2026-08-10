'use client';

import { cn } from '@/src/utils/cn';

import { TimeSignature } from '@/src/lib/types/metronome.types';

interface BeatDotsProps {
  activeBeat: number;
  signature: TimeSignature;
}

/**
 * Horizontal row of beat indicator dots. The first dot (downbeat) flashes
 * red on its accent; subsequent dots flash yellow.
 */
export default function BeatDots({ activeBeat, signature }: BeatDotsProps) {
  return (
    <div className="flex justify-center gap-2.5">
      {Array.from({ length: signature }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'block size-[13px] rounded-full border-2 transition-all duration-75',
            activeBeat === i
              ? i === 0
                ? 'border-accent-red bg-accent-red shadow-[0_0_14px_var(--accent-red)]'
                : 'border-yellow-main bg-yellow-main shadow-[0_0_14px_var(--yellow-main)]'
              : 'border-primary-light/40 bg-transparent',
          )}
        />
      ))}
    </div>
  );
}

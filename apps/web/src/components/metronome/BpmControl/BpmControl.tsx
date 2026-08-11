'use client';

import { MinusIcon, PlusSolidIcon } from '@/src/icons/base';
import { clampBpm, tempoName } from '@/src/utils/metronome.utils';

import BpmRuler from './BpmRuler';

interface BpmControlProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  onTap: () => void;
}

const STEP_BUTTON =
  'border-primary-light/35 bg-primary-light/5 text-primary-light hover:bg-primary-light/[.12] flex size-9.5 items-center justify-center border-2 transition-[background-color] duration-100';

/**
 * BPM display with the numeric value, unit label, Italian tempo name,
 * a draggable ruler strip, and +/−/TAP buttons.
 */
export default function BpmControl({ bpm, onBpmChange, onTap }: BpmControlProps) {
  return (
    <div className="relative z-5 pbs-2 text-center">
      <div className="font-display text-primary-light text-[4.5rem] leading-[0.85] tabular-nums">
        {bpm}
      </div>

      <div className="font-label text-yellow-main mbs-1 text-[0.8125rem] tracking-[0.25rem]">
        BPM
      </div>

      <div className="font-prose text-primary-light/55 mbs-1 text-sm italic">{tempoName(bpm)}</div>

      <BpmRuler bpm={bpm} onBpmChange={onBpmChange} />

      <div className="mbs-3 inline-flex gap-2">
        <button
          aria-label="Decrease BPM"
          className={STEP_BUTTON}
          onClick={() => onBpmChange(clampBpm(bpm - 1))}
          type="button"
        >
          <MinusIcon size={16} />
        </button>

        <button
          className="pli-4 font-ui border-yellow-main text-yellow-main hover:bg-yellow-main hover:text-primary-dark h-9.5 border-2 bg-transparent text-[0.8125rem] font-semibold tracking-wider uppercase transition-[background-color,color] duration-100"
          onClick={onTap}
          type="button"
        >
          TAP
        </button>

        <button
          aria-label="Increase BPM"
          className={STEP_BUTTON}
          onClick={() => onBpmChange(clampBpm(bpm + 1))}
          type="button"
        >
          <PlusSolidIcon size={16} />
        </button>
      </div>
    </div>
  );
}

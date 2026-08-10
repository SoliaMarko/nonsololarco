'use client';

import { MinusIcon, PlusSolidIcon } from '@/src/icons/base';
import { clampBpm, tempoName } from '@/src/utils/metronome.utils';

import BpmRuler from './BpmRuler';

interface BpmControlProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  onTap: () => void;
}

/**
 * BPM display with the numeric value, unit label, Italian tempo name,
 * a draggable ruler strip, and +/−/TAP buttons.
 */
export default function BpmControl({ bpm, onBpmChange, onTap }: BpmControlProps) {
  return (
    <div className="relative z-5 text-center" style={{ padding: '6px 0 2px' }}>
      <div
        className="text-primary-light tabular-nums"
        style={{
          fontFamily: "'Alfa Slab One', serif",
          fontSize: '72px',
          lineHeight: 0.85,
        }}
      >
        {bpm}
      </div>

      <div
        className="text-yellow-main"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '13px',
          letterSpacing: '4px',
          marginTop: '2px',
        }}
      >
        BPM
      </div>

      <div
        className="text-primary-light/55"
        style={{
          fontFamily: "'Spectral', serif",
          fontStyle: 'italic',
          fontSize: '14px',
          marginTop: '4px',
        }}
      >
        {tempoName(bpm)}
      </div>

      <BpmRuler bpm={bpm} onBpmChange={onBpmChange} />

      <div className="mbs-2.5 inline-flex gap-2">
        <button
          aria-label="Зменшити BPM"
          className="flex size-[38px] items-center justify-center border-2 border-primary-light/35 bg-primary-light/5 text-primary-light hover:bg-primary-light/[.12]"
          onClick={() => onBpmChange(clampBpm(bpm - 1))}
          type="button"
        >
          <MinusIcon size={16} />
        </button>

        <button
          className="border-2 border-yellow-main bg-transparent text-yellow-main hover:bg-yellow-main hover:text-primary-dark"
          onClick={onTap}
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: '13px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '0 16px',
            height: '38px',
          }}
          type="button"
        >
          TAP
        </button>

        <button
          aria-label="Збільшити BPM"
          className="flex size-[38px] items-center justify-center border-2 border-primary-light/35 bg-primary-light/5 text-primary-light hover:bg-primary-light/[.12]"
          onClick={() => onBpmChange(clampBpm(bpm + 1))}
          type="button"
        >
          <PlusSolidIcon size={16} />
        </button>
      </div>
    </div>
  );
}

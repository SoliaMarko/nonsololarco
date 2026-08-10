'use client';

import { ArrowLeftSolidIcon, MenuIcon } from '@/src/icons/base';
import { cn } from '@/src/utils/cn';

import { TimeSignature } from '@/src/lib/types/metronome.types';

const TIME_SIGNATURES: TimeSignature[] = [4, 3, 6];

interface MetronomeTopBarProps {
  onBack: () => void;
  onMenuOpen: () => void;
  onSignatureChange: (sig: TimeSignature) => void;
  signature: TimeSignature;
}

/**
 * Top navigation bar with back button, burger menu, "МЕТРОНОМ" title,
 * and time signature selector (4/4, 3/4, 6/4).
 */
export default function MetronomeTopBar({
  onBack,
  onMenuOpen,
  onSignatureChange,
  signature,
}: MetronomeTopBarProps) {
  return (
    <div className="relative z-5 flex items-center justify-between" style={{ padding: '16px 22px' }}>
      <div className="flex items-center gap-2.5">
        <button
          aria-label="Історія практик"
          className="flex size-[34px] shrink-0 items-center justify-center border-2 border-primary-light/30 bg-primary-light/5 text-primary-light hover:bg-primary-light/[.12]"
          onClick={onMenuOpen}
          type="button"
        >
          <MenuIcon size={18} />
        </button>

        <button
          className="inline-flex items-center gap-[7px] border-0 bg-transparent text-primary-light opacity-70 hover:opacity-100"
          onClick={onBack}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            letterSpacing: '1px',
          }}
          type="button"
        >
          <ArrowLeftSolidIcon size={15} />
          Назад
        </button>
      </div>

      <span
        className="text-yellow-main"
        style={{
          fontFamily: "'Alfa Slab One', serif",
          fontSize: '16px',
          letterSpacing: '2px',
        }}
      >
        МЕТРОНОМ
      </span>

      <div className="inline-flex border-2 border-primary-light/30">
        {TIME_SIGNATURES.map((n) => (
          <button
            key={n}
            className={cn(
              'border-0 bg-transparent text-primary-light/60',
              'first:border-ie-0 [&:not(:first-child)]:border-is-2 [&:not(:first-child)]:border-primary-light/30',
              signature === n && 'bg-yellow-main text-primary-dark',
            )}
            onClick={() => onSignatureChange(n)}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '12px',
              fontWeight: 700,
              padding: '5px 10px',
            }}
            type="button"
          >
            {n}/4
          </button>
        ))}
      </div>
    </div>
  );
}

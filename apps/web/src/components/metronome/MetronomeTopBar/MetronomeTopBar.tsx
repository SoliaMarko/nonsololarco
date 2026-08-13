'use client';

import { useTranslations } from 'next-intl';

import { MenuIcon } from '@/src/icons/base';
import { TimeSignatureDef } from '@/src/lib/types/metronome.types';

import TimeSignatureSelect from '../TimeSignatureSelect';

interface MetronomeTopBarProps {
  onMenuOpen: () => void;
  onSignatureChange: (sig: TimeSignatureDef) => void;
  signature: TimeSignatureDef;
}

/**
 * Top navigation bar: practice-history menu, the centred metronome title,
 * and the time signature selector.
 *
 * Laid out as a three-column grid (`1fr auto 1fr`) rather than absolute
 * positioning, so the title stays centred at every width while the side
 * columns reserve their own space and never overlap it.
 */
export default function MetronomeTopBar({
  onMenuOpen,
  onSignatureChange,
  signature,
}: MetronomeTopBarProps) {
  const t = useTranslations('pages.metronome');

  return (
    <div className="pli-4 plb-3 md:plb-4 relative z-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <div className="flex min-w-0 items-center">
        <button
          aria-label="Menu and practice history"
          className="border-primary-light/30 bg-primary-light/5 text-primary-light hover:bg-primary-light/12 flex size-8.5 shrink-0 items-center justify-center border-2 transition-[background-color] duration-100"
          onClick={onMenuOpen}
          type="button"
        >
          <MenuIcon size={18} />
        </button>
      </div>

      <span className="font-display text-yellow-main text-[0.9375rem] tracking-[0.125rem] whitespace-nowrap">
        {t('title')}
      </span>

      <div className="flex justify-end">
        <TimeSignatureSelect
          denominator={Number(signature.label.split('/')[1])}
          numerator={signature.beats}
          onChange={(n, d) => onSignatureChange({ beats: n, label: `${n}/${d}` })}
          variant="dark"
        />
      </div>
    </div>
  );
}

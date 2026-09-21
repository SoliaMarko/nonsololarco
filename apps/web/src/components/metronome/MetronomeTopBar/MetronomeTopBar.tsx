'use client';

import { useTranslations } from 'next-intl';

import ThemeToggle from '@/src/components/shared/ThemeToggle';
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
 * the time signature selector and, after it, the theme lamp.
 *
 * Laid out as a three-column grid (`1fr auto 1fr`) rather than absolute
 * positioning, so the title stays centred at every width while the side
 * columns reserve their own space and never overlap it.
 *
 * The lamp is the one exception: it hangs from the top edge of the screen,
 * which a grid cell centred on the row cannot do, so it is positioned
 * absolutely at the inline end and the last column pads itself clear of it. The metronome
 * stays dark in both themes by design — it is a stage, not a page — so here
 * the lamp lights only itself and switches the theme for the rest of the app.
 */
export default function MetronomeTopBar({
  onMenuOpen,
  onSignatureChange,
  signature,
}: MetronomeTopBarProps) {
  const t = useTranslations('pages.metronome');

  return (
    // z-6 lifts the bar one step above BpmControl (z-5), which follows it in
    // the DOM and would otherwise sit on top of the lamp's hanging cord and
    // take its clicks. Every overlay on this screen is z-30 or higher.
    <div className="pli-4 plb-3 md:plb-4 relative z-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <ThemeToggle className="block-start-0 absolute inset-e-4" />

      <div className="flex min-w-0 items-center">
        <button
          aria-label={t('ariaMenu')}
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

      <div className="pie-12 flex justify-end">
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

'use client';

import { useTranslations } from 'next-intl';

import { DENOMINATORS, VALID_NUMERATORS } from '@/src/lib/types/metronome.types';
import { cn } from '@/src/utils/cn';

import SigDropdown from './SigDropdown';

type TimeSignatureSelectVariant = 'dark' | 'light';

interface TimeSignatureSelectProps {
  /** Bottom number of the time signature (note value: 2, 4, or 8). */
  denominator: number;
  /** Top number of the time signature (beat count). */
  numerator: number;
  /**
   * Called with the resolved (numerator, denominator) pair whenever either
   * value changes. When the denominator changes and the current numerator
   * is invalid for the new denominator, the numerator is auto-corrected
   * before calling this.
   */
  onChange: (numerator: number, denominator: number) => void;
  /**
   * Renders the "beats" / "note" captions under each dropdown. Off by
   * default so the control fits a single toolbar line; turn it on inside
   * forms, where the extra explanation is worth the vertical space.
   */
  showLabels?: boolean;
  variant: TimeSignatureSelectVariant;
}

const MUTED_VARIANT = {
  dark: 'text-primary-light/40',
  light: 'text-fg-tertiary',
} as const;

/**
 * Paired numerator / denominator dropdowns for picking a time signature.
 * Both triggers share the toolbar control height so the whole control sits
 * on one line; optional captions can be shown underneath in forms.
 * Changing the denominator auto-corrects the numerator when the current
 * value is invalid for the new denominator.
 */
export default function TimeSignatureSelect({
  denominator,
  numerator,
  onChange,
  showLabels = false,
  variant,
}: TimeSignatureSelectProps) {
  const t = useTranslations('pages.metronome');
  const validNums = VALID_NUMERATORS[denominator] ?? [4];
  const captionClass = cn('mbs-1 font-label text-[0.5rem] tracking-wider', MUTED_VARIANT[variant]);

  return (
    <div className={cn('flex gap-1', showLabels ? 'items-end' : 'items-center')}>
      <div className="flex flex-col items-center">
        <SigDropdown
          ariaLabel={t('ariaTimeSigNumerator')}
          onSelect={(n) => onChange(n, denominator)}
          options={validNums}
          value={numerator}
          variant={variant}
        />
        {showLabels && <span className={captionClass}>{t('beatsLabel')}</span>}
      </div>

      <span
        className={cn(
          'font-display text-base leading-none',
          showLabels && 'mbe-4',
          MUTED_VARIANT[variant],
        )}
      >
        /
      </span>

      <div className="flex flex-col items-center">
        <SigDropdown
          ariaLabel={t('ariaTimeSigDenominator')}
          onSelect={(d) => {
            const nums = VALID_NUMERATORS[d] ?? [4];
            const corrected = nums.includes(numerator) ? numerator : (nums[0] ?? 4);
            onChange(corrected, d);
          }}
          options={DENOMINATORS}
          value={denominator}
          variant={variant}
        />
        {showLabels && <span className={captionClass}>{t('noteLabel')}</span>}
      </div>
    </div>
  );
}

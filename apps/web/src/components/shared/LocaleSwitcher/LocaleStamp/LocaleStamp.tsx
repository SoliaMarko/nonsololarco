import { Locale } from '@/i18n/config';
import { cn } from '@/src/utils/cn';

import { LOCALE_FLAG_GRADIENT } from '../locale-switcher.const';

export interface LocaleStampProps {
  className?: string;
  locale: Locale;
}

/**
 * Retro postage-stamp badge showing a locale code with a coloured corner
 * triangle derived from the locale's national flag.
 *
 * Used as `leadingContent` in `LocaleSwitcher` dropdown items. The trigger
 * button renders the flag triangle directly (no nested stamp), so this
 * component is not used there.
 */
export default function LocaleStamp({ className, locale }: LocaleStampProps) {
  const code = locale.toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden',
        'border-2 border-fg-primary font-label text-[0.6875rem] font-bold tracking-[0.06em]',
        // Fixed width so every badge lines up, whatever the code's glyph
        // widths are — the codes sit in a column and must share an edge.
        'w-9 plb-[2px]',
        className,
      )}
    >
      {code}
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 size-[11px] [clip-path:polygon(100%_0,0_0,100%_100%)]"
        style={{ background: LOCALE_FLAG_GRADIENT[locale] }}
      />
    </span>
  );
}

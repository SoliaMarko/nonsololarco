'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { Locale, locales } from '@/i18n/config';
import { usePathname, useRouter } from '@/i18n/navigation';
import Dropdown from '@/src/components/ui/Dropdown';
import { OPTIONS_POSITION } from '@/src/lib/constants/common.const';
import { cn } from '@/src/utils/cn';

import LocaleStamp from './LocaleStamp';
import { LOCALE_FLAG_GRADIENT, LOCALE_LABEL } from './locale-switcher.const';

export interface LocaleSwitcherProps {
  className?: string;
}

/**
 * Dropdown that lets the user switch the interface language.
 *
 * The trigger is a retro press-style button whose body IS the stamp:
 * bordered rectangle, flag triangle in the top-right corner, locale code
 * and a down-chevron. The menu lists all supported locales with their
 * endonyms, separate stamp badges, and a checkmark on the active one.
 *
 * Switching navigates to the same pathname under the new locale prefix
 * via `router.replace`.
 */
export default function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('common');

  function handleLocaleChange(locale: Locale) {
    // Preserve existing query params (status, onlyMine, sort, order, etc.)
    // across the locale switch — `usePathname()` strips the query string.
    const query = searchParams.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;

    // `scroll: false` keeps the reader where they were — switching language
    // shouldn't throw them back to the top of a long repertoire list.
    router.replace(fullPath, { locale, scroll: false });
  }

  return (
    <Dropdown
      align={OPTIONS_POSITION.end}
      variant="stamp"
      // Pinned, not `w-fit`: the group label is translated, so an intrinsic
      // width would make the panel — and its border — a different size in
      // every language.
      className="w-59"
      groups={[
        {
          label: t('locale.interfaceLanguage'),
          selectionMode: 'single',
          items: locales.map((locale) => ({
            label: LOCALE_LABEL[locale],
            leadingContent: <LocaleStamp locale={locale} />,
            onClick: () => handleLocaleChange(locale),
            selected: locale === currentLocale,
          })),
        },
      ]}
      trigger={
        <button
          aria-label={t('locale.switchLanguage')}
          className={cn(
            'relative inline-flex items-center gap-2 overflow-hidden',
            'bg-control-surface border-fg-secondary border-2',
            'font-label text-xs font-bold tracking-[0.08em]',
            'cursor-pointer px-2.25 py-1.25',
            // Static by design — no press transform or transition. The hover
            // tint is an instant colour swap, kept purely for affordance.
            'shadow-[2px_2px_0_0_var(--color-fg-secondary)]',
            'hover:bg-control-surface-hover',
            'focus-visible:ring-fg-secondary focus-visible:ring-2 focus-visible:outline-none',
            className,
          )}
        >
          {/* Flag corner triangle — positioned inside the trigger button itself */}
          <span
            aria-hidden="true"
            className="absolute top-0 right-0 size-3.25 [clip-path:polygon(100%_0,0_0,100%_100%)]"
            style={{ background: LOCALE_FLAG_GRADIENT[currentLocale] }}
          />
          {/*
            Fixed-width slot: the button must not resize as the code changes.
            A width on the span rather than the button keeps the chevron at a
            constant offset, and holds even if the mono face falls back to a
            proportional one where "UK" and "IT" measure differently.
          */}
          <span className="text-fg-primary w-6 text-center">{currentLocale.toUpperCase()}</span>
          <span className="text-fg-tertiary ms-0.75 text-[9px]" aria-hidden="true">
            ▼
          </span>
        </button>
      }
    />
  );
}

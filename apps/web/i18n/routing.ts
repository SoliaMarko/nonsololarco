import { defineRouting } from 'next-intl/routing';

import { defaultLocale, locales } from './config';

/**
 * Routing configuration for next-intl.
 *
 * Uses URL prefix strategy (`/en`, `/it`, `/uk`) with automatic
 * browser language detection on first visit. The default locale prefix
 * is always shown for consistency (no "hidden" locale).
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

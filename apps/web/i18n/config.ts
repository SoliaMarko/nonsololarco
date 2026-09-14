/**
 * Supported locales and routing configuration for next-intl.
 *
 * English is the source of truth — Italian and Ukrainian translations
 * must mirror its key set exactly. The default locale is also used as
 * the fallback when Accept-Language negotiation produces no match.
 */

export const locales = ['en', 'it', 'uk'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

import { Locale } from '@/i18n/config';

/**
 * CSS `linear-gradient(135deg, …)` value for each locale's flag corner
 * triangle. Each gradient is a simplified representation of the national
 * flag, rendered inside a `clip-path: polygon(100% 0, 0 0, 100% 100%)`
 * triangle.
 */
export const LOCALE_FLAG_GRADIENT: Record<Locale, string> = {
  en: 'linear-gradient(135deg, #012169 0 34%, #f7f5ef 34% 62%, #c8102e 62% 100%)',
  it: 'linear-gradient(135deg, #008c45 0 34%, #f7f5ef 34% 66%, #cd212a 66% 100%)',
  uk: 'linear-gradient(135deg, #0057b7 0 50%, #ffd700 50% 100%)',
};

/**
 * Endonym (native name) for each supported locale — displayed in the
 * dropdown so the user can always recognise their language regardless
 * of the currently active locale.
 */
export const LOCALE_LABEL: Record<Locale, string> = {
  en: 'English',
  it: 'Italiano',
  uk: 'Українська',
};

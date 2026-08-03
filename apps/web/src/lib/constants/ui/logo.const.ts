import { Locale } from '../../types/common.types';
import { LogoColors, LogoSize, LogoTone } from '../../types/ui/logo.types';

export const LOGO_SUBTITLE: Record<Locale, string> = {
  en: 'MUSIC COMMUNITY',
  it: 'COMUNITÀ MUSICALE',
  ua: 'МУЗИЧНА СПІЛЬНОТА',
};

export const MARK_SIZE: Record<LogoSize, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

export const WORDMARK_SCALE: Record<LogoSize, number> = {
  xs: 0.45,
  sm: 0.6,
  md: 0.8,
  lg: 1,
  xl: 1.25,
};

export const LOGO_COLORS: Record<LogoTone, LogoColors> = {
  default: {
    accent: 'var(--color-emerald-main)',
    dot: 'var(--color-emerald-light)',
    muted: 'var(--color-fg-tertiary)',
    note: 'var(--color-emerald-main)',
    primary: 'var(--color-fg-primary)',
    squiggle: 'var(--color-emerald-main)',
    subtitle: 'var(--color-emerald-main)',
  },
  /*
   * Tuned for the emerald hero background: light text, yellow notes.
   * The hero background is a fixed dark green in both themes, so colors here
   * are theme-independent — `note` is pinned to the dark-theme yellow so the
   * shade stays identical on light and dark.
   */
  'on-brand': {
    accent: 'var(--color-emerald-light)',
    dot: 'var(--color-primary-light)',
    muted: 'color-mix(in srgb, var(--color-primary-light) 60%, transparent)',
    note: '#e8e07a',
    primary: 'var(--color-primary-light)',
    squiggle: 'var(--color-emerald-light)',
    subtitle: 'color-mix(in srgb, var(--color-primary-light) 70%, transparent)',
  },
};

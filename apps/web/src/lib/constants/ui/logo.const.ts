import { Locale } from '../../types/common.types';
import { LogoSize } from '../../types/ui/logo.types';

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

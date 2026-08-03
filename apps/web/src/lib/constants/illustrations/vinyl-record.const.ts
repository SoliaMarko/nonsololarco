import { VinylColor } from '../../types/illustrations/vinyl-record.types';

export const LABEL_COLOR: Record<VinylColor, string> = {
  olive: '#c4c425',
  rust: '#b24b3a',
  sage: '#8aa06b',
  amber: '#e0a92e',
  teal: '#4e8c82',
  terracotta: '#cc6b49',
  plum: '#7a4b6b',
  ochre: '#a8762c',
  moss: '#5f7a3a',
  slate: '#55707f',
  /** Reserved for solo tracks — a blank white label */
  solo: '#f5f0e8',
};

/** Default label radius, in the 56x56 viewBox of DiscIllustration */
export const LABEL_RADIUS = 12.4;

/** Solo records get a slightly larger label so they read as "no band" at a glance */
export const SOLO_LABEL_RADIUS = 14.6;

/** Colors assignable to a band — excludes `solo`, which is reserved */
export const VINYL_COLORS = (Object.keys(LABEL_COLOR) as VinylColor[]).filter(
  (color) => color !== 'solo',
);

export const GROOVES = [25.4, 24.1, 22.8, 21.5, 20.2, 18.9, 17.6, 16.3, 15, 13.7];

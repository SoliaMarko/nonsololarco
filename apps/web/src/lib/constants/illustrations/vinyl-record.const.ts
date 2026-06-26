import { VinylColor } from '../../types/illustrations/vinyl-record.types';

export const LABEL_COLOR: Record<VinylColor, string> = {
  olive: '#c4c425',
  rust: '#b24b3a',
  sage: '#8aa06b',
  amber: '#e0a92e',
  teal: '#4e8c82',
  terracotta: '#cc6b49',
};

export const VINYL_COLORS = Object.keys(LABEL_COLOR) as VinylColor[];

export const GROOVES = [25.4, 24.1, 22.8, 21.5, 20.2, 18.9, 17.6, 16.3, 15, 13.7];

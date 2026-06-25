import { AchievementBadgeColor } from '../../types/illustrations/achievement-badge.types';

export const CIRCUMFERENCE = 2 * Math.PI * 43; // ≈ 270.2

export const COLOR_CONFIG: Record<
  AchievementBadgeColor,
  {
    discFill: string;
    discStroke: string;
    glow: string;
    iconStroke: string;
    stroke: string;
  }
> = {
  green: {
    stroke: '#46b97a',
    glow: 'rgba(70,185,122,0.4)',
    discFill: '#fcfaf3',
    discStroke: '#62c48e',
    iconStroke: '#3ea36b',
  },
  amber: {
    stroke: '#e8a33a',
    glow: 'rgba(232,163,58,0.4)',
    discFill: '#fcfaf3',
    discStroke: '#ebb158',
    iconStroke: '#cc8f33',
  },
  orange: {
    stroke: '#e8843a',
    glow: 'rgba(232,132,58,0.4)',
    discFill: '#fcfaf3',
    discStroke: '#eb9658',
    iconStroke: '#cc7433',
  },
  blue: {
    stroke: '#3b82e0',
    glow: 'rgba(59,130,224,0.4)',
    discFill: '#fcfaf3',
    discStroke: '#5895e5',
    iconStroke: '#3472c5',
  },
  teal: {
    stroke: '#22b79a',
    glow: 'rgba(34,183,154,0.4)',
    discFill: '#fcfaf3',
    discStroke: '#43c2a9',
    iconStroke: '#1ea188',
  },
  red: {
    stroke: '#e0556f',
    glow: 'rgba(224,85,111,0.4)',
    discFill: '#fcfaf3',
    discStroke: '#e56f85',
    iconStroke: '#c54b62',
  },
  purple: {
    stroke: '#9b6bd8',
    glow: 'rgba(155,107,216,0.4)',
    discFill: '#fcfaf3',
    discStroke: '#aa81de',
    iconStroke: '#885ebe',
  },
  indigo: {
    stroke: '#7c6be0',
    glow: 'rgba(124,107,224,0.4)',
    discFill: '#fcfaf3',
    discStroke: '#9081e5',
    iconStroke: '#6d5ec5',
  },
  grey: {
    stroke: '#a8a292',
    glow: 'transparent',
    discFill: '#fcfaf3',
    discStroke: '#b5b0a2',
    iconStroke: '#9A9486',
  },
};

import {
  EighthRestIcon,
  HalfRestIcon,
  OnlineIcon,
  QuarterRestIcon,
  WholeRestIcon,
} from '@/src/icons/status';

export const ICON_POSITION = {
  end: 'end',
  start: 'start',
} as const;

export const ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical',
} as const;

export const STATUS_ICON = {
  online: OnlineIcon,
  pause: EighthRestIcon,
  away: QuarterRestIcon,
  long: HalfRestIcon,
  inactive: WholeRestIcon,
} as const;

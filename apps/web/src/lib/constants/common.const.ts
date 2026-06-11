import {
  CalendarIcon,
  ChatOutlineIcon,
  HomeOutlineIcon,
  ProfileOutlineIcon,
  RepertoireIcon,
} from '@/src/icons/base';
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

export const OPTIONS_POSITION = {
  end: 'end',
  center: 'center',
  start: 'start',
} as const;

export const ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical',
} as const;

export const THEME = { dark: 'dark', light: 'light' } as const;

export const STATUS_ICON = {
  online: OnlineIcon,
  pause: EighthRestIcon,
  away: QuarterRestIcon,
  long: HalfRestIcon,
  inactive: WholeRestIcon,
} as const;

export const NAV_ITEMS = [
  { href: '/', icon: HomeOutlineIcon, label: 'Feed' },
  { href: '/repertoire', icon: RepertoireIcon, label: 'Repertoire' },
  { href: '/calendar', icon: CalendarIcon, label: 'Calendar' },
  { href: '/chat', icon: ChatOutlineIcon, label: 'Chats', badge: 3 },
  { href: '/profile', icon: ProfileOutlineIcon, label: 'Profile' },
];

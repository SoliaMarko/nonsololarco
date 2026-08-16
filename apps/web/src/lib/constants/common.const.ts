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

/**
 * Primary navigation entries rendered by both `AppBottomNav` (mobile) and
 * `AppHeaderNav` (desktop).
 *
 * `labelKey` values belong to the `common` i18n namespace (e.g. `nav.feed`).
 * `badge` is a numeric indicator shown on the nav icon — `undefined` means
 * no badge is displayed.
 */
export const NAV_ITEMS = [
  { badge: undefined, href: '/', icon: HomeOutlineIcon, labelKey: 'nav.feed' },
  { badge: undefined, href: '/repertoire', icon: RepertoireIcon, labelKey: 'nav.repertoire' },
  { badge: undefined, href: '/calendar', icon: CalendarIcon, labelKey: 'nav.calendar' },
  { badge: 3, href: '/chat', icon: ChatOutlineIcon, labelKey: 'nav.chats' },
  { badge: undefined, href: '/profile', icon: ProfileOutlineIcon, labelKey: 'nav.profile' },
] as const;

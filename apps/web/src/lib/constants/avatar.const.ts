import { VariantProps } from 'class-variance-authority';

import {
  EighthRestIcon,
  HalfRestIcon,
  OnlineIcon,
  QuarterRestIcon,
  WholeRestIcon,
} from '@/src/icons/status';

import { avatarVariants } from '../ui/variants/avatar.variants';

export const STATUS_ICON = {
  online: OnlineIcon,
  pause: EighthRestIcon,
  away: QuarterRestIcon,
  long: HalfRestIcon,
  inactive: WholeRestIcon,
} as const;

export const STATUS_ICON_SIZE: Record<
  NonNullable<VariantProps<typeof avatarVariants>['size']>,
  number
> = {
  xs: 5,
  sm: 6,
  md: 7,
  lg: 9,
  xl: 12,
};

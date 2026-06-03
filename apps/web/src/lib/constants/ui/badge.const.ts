import { VariantProps } from 'class-variance-authority';

import { standaloneBadgeVariants } from '../../ui/variants/standalone-badge.variants';

type BadgeSize = NonNullable<VariantProps<typeof standaloneBadgeVariants>['size']>;

export const BADGE_STATUS_ICON_SIZE: Record<BadgeSize, number> = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
};

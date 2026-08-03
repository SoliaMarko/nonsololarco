import { VariantProps } from 'class-variance-authority';

import { avatarVariants } from '../../variants/avatar.variants';

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

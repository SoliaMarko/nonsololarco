import { VariantProps } from 'class-variance-authority';

import { buttonVariants } from './button.variants';

export const iconSizes: Record<NonNullable<VariantProps<typeof buttonVariants>['size']>, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
};

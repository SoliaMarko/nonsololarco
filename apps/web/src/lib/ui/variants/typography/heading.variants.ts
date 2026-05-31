import { cva } from 'class-variance-authority';

import { alignVariants, colorVariants, sizeVariants, truncateVariant } from './common.variant';

export const headingVariants = cva('font-medium leading-tight', {
  variants: {
    size: sizeVariants,
    color: colorVariants,
    align: alignVariants,
    isTruncated: truncateVariant,
  },
  defaultVariants: {
    size: 'xl',
    color: 'primary',
  },
});

import { cva } from 'class-variance-authority';

import { alignVariants } from './common.variant';
import { colorVariants, sizeVariants, truncateVariant } from './common.variant';

export const textVariants = cva('leading-normal', {
  variants: {
    size: sizeVariants,
    weight: {
      regular: 'font-regular',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    color: colorVariants,
    align: alignVariants,
    isTruncated: truncateVariant,
  },
  defaultVariants: {
    size: 'base',
    weight: 'regular',
    color: 'primary',
  },
});

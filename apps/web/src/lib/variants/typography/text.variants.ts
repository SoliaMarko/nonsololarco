import { cva } from 'class-variance-authority';

import { alignVariants, colorVariants, sizeVariants, truncateVariant } from '../common.variants';

/**
 * CVA definition for the `Text` component.
 *
 * The `weight` values map to stock Tailwind weight utilities so
 * `tailwind-merge` can recognise them. This matters for the default: when it
 * emitted the custom `font-regular`, tailwind-merge could not classify it as a
 * font-weight and so never dropped it, causing a `font-medium` passed through
 * `className` to silently lose. The prop value stays `regular` — only the
 * emitted class changed.
 */
export const textVariants = cva('leading-normal', {
  variants: {
    size: sizeVariants,
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
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

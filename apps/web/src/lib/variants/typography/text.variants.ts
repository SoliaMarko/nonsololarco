import { cva } from 'class-variance-authority';

import { alignVariants, colorVariants, sizeVariants, truncateVariant } from '../common.variants';

export const textVariants = cva('leading-normal', {
  variants: {
    size: sizeVariants,
    /**
     * Every value maps to a stock Tailwind weight utility so `tailwind-merge`
     * can recognise it. This matters for the default: when it emitted the
     * custom `font-regular`, tailwind-merge could not classify it as a
     * font-weight and so never dropped it, and a `font-medium` passed through
     * `className` silently lost to it.
     *
     * The prop value stays `regular` — only the class it emits changed.
     */
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

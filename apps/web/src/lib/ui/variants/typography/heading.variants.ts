import { cva } from 'class-variance-authority';

export const headingVariants = cva('font-medium leading-tight', {
  variants: {
    size: {
      h1: 'text-h1',
      h2: 'text-h2',
      h3: 'text-h3',
      h4: 'text-h4',
      h5: 'text-caption',
      h6: 'text-label',
    },
    color: {
      primary: 'text-fg-primary',
      secondary: 'text-fg-secondary',
      tertiary: 'text-fg-tertiary',
      accent: 'text-emerald-main',
      highlight: 'text-yellow-main',
      danger: 'text-danger',
    },
    isTruncated: {
      true: 'truncate',
    },
  },
  defaultVariants: {
    size: 'h2',
    color: 'primary',
  },
});

import { cva } from 'class-variance-authority';

export const spinnerVariants = cva('inline-flex items-end', {
  variants: {
    size: {
      xs: 'gap-px text-[9px]',
      sm: 'gap-px text-[11px]',
      md: 'gap-0.5 text-[16px]',
      lg: 'gap-1 text-[22px]',
      xl: 'gap-1 text-[28px]',
      xxl: 'gap-1 text-[40px]',
    },
    color: {
      emerald: 'text-emerald-main',
      muted: 'text-fg-disabled',
      primaryLight: 'text-primary-light',
      yellow: 'text-yellow-main',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'emerald',
  },
});

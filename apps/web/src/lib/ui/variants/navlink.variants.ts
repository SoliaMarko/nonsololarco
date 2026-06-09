import { cva } from 'class-variance-authority';

export const navLinkVariants = cva(
  'inline-flex items-center gap-2 transition-colors duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 rounded-sm text-fg-muted leading-none',
  {
    variants: {
      variant: {
        desktop: ['flex-row pli-3 plb-2 text-xs font-medium uppercase tracking-widest'],
        mobile: ['flex-col items-center gap-1 pli-2 plb-1 text-[10px] font-medium'],
      },
      isActive: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'desktop',
        isActive: true,
        className: 'text-fg-primary',
      },
      {
        variant: 'mobile',
        isActive: true,
        className: 'text-accent-red',
      },
    ],
    defaultVariants: {
      variant: 'desktop',
      isActive: false,
    },
  },
);

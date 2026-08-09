import { cva } from 'class-variance-authority';

export const tabsListVariants = cva('flex', {
  variants: {
    variant: {
      nav: 'items-end gap-1',
      panel:
        'min-w-max items-center bg-surface border-b-border-primary scrollbar-thumb-fg-tertiary scrollbar-track-edge scrollbar-thin',
    },
  },
  defaultVariants: {
    variant: 'panel',
  },
});

export const tabItemVariants = cva(
  'inline-flex items-center select-none transition-colors duration-150 focus-visible:outline-none -mbe-px',
  {
    variants: {
      variant: {
        nav: 'flex-row gap-2 pli-3 plb-2 text-xs font-medium uppercase tracking-widest leading-none rounded-sm border-b-2',
        panel: 'gap-3 pli-4 plb-3 border-edge border-r-2 border-solid w-48 border-b-4',
      },
      isActive: {
        true: 'border-b-accent-red text-fg-primary',
        false: 'border-b-transparent',
      },
    },
    compoundVariants: [
      {
        variant: 'nav',
        isActive: true,
        className: 'rounded-none',
      },
      {
        variant: 'nav',
        isActive: false,
        className: 'text-fg-muted hover:text-fg-primary',
      },
      {
        variant: 'panel',
        isActive: true,
        className: 'bg-base',
      },
      {
        variant: 'panel',
        isActive: false,
        className: 'text-fg-tertiary hover:text-fg-secondary hover:bg-elevated',
      },
    ],
    defaultVariants: {
      variant: 'panel',
      isActive: false,
    },
  },
);

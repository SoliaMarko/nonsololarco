import { cva } from 'class-variance-authority';

/**
 * CVA variants for the "Only mine" toggle button used in the repertoire filter
 * bar. Shared between the desktop and mobile layouts.
 */
export const onlyMineToggleVariants = cva(
  'plb-1.5 pli-3 flex items-center gap-2 border-2 text-xs font-bold tracking-wider uppercase transition-colors',
  {
    variants: {
      active: {
        true: 'border-yellow-deep bg-yellow-main text-primary-dark',
        false: 'border-border-primary text-fg-tertiary hover:text-fg-secondary',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

/** CVA variants for the count badge inside the "Only mine" toggle. */
export const onlyMineCountVariants = cva('pli-1.5 plb-0.5 border text-[10px] tabular-nums', {
  variants: {
    active: {
      true: 'border-primary-dark',
      false: 'border-border-primary',
    },
  },
  defaultVariants: {
    active: false,
  },
});

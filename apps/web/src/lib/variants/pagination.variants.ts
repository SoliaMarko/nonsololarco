import { cva } from 'class-variance-authority';

/**
 * CVA variants for pagination page-number cells.
 *
 * `isActive` renders the current-page highlight (dark bg, yellow text).
 * `isDisabled` dims the cell for prev/next arrows at the boundaries.
 */
export const paginationItemVariants = cva(
  [
    'inline-flex items-center justify-center',
    'min-w-8 min-h-8 pli-1.5',
    'text-sm font-bold tabular-nums',
    'border-2 transition-[background-color,border-color]',
    'cursor-pointer select-none',
  ],
  {
    defaultVariants: { isActive: false, isDisabled: false },
    variants: {
      isActive: {
        false:
          'border-border-primary text-fg-secondary hover:border-fg-tertiary hover:text-fg-primary',
        true: 'border-fg-primary bg-contrast text-yellow-main dark:text-yellow-contrast cursor-default',
      },
      isDisabled: {
        false: '',
        true: 'opacity-40 pointer-events-none cursor-default',
      },
    },
  },
);

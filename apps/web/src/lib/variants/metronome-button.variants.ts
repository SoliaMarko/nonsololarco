import { cva } from 'class-variance-authority';

export const metronomeButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'border-border-primary border-2',
    'transition-[transform,box-shadow,background-color] duration-100',
    'focus-visible:ring-yellow-main focus-visible:ring-2 focus-visible:outline-none',
  ],
  {
    variants: {
      variant: {
        /* Sits in the header row beside the theme toggle and avatar. Matches
           their 40px height so the row stays optically level; square rather
           than round to distinguish it from those controls. No drop shadow —
           the header is already a layered surface and one would read as a
           mistake. */
        header: ['bg-surface hover:bg-elevated size-10 rounded-sm'],
        /* Thumb-zone floating button. Round, raised, and large enough to hit
           without looking — 56px is the Material minimum for a primary FAB.
           The shadow is keyed to `primary-dark` (fixed, dark in both themes)
           rather than `fg-primary` (theme-aware): the button is always the
           fixed brand yellow, so a cream shadow in dark mode looks wrong. */
        fab: [
          'bg-yellow-main size-14 rounded-full',
          'shadow-[2px_2px_0_var(--color-primary-dark)]',
          'hover:-translate-x-px hover:-translate-y-px',
          'hover:shadow-[3px_3px_0_var(--color-primary-dark)]',
          'active:translate-x-0 active:translate-y-0 active:shadow-none',
        ],
      },
    },
    defaultVariants: {
      variant: 'header',
    },
  },
);

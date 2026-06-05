import { cva } from 'class-variance-authority';

export const chipVariants = cva(
  'inline-flex items-center gap-1 rounded-pill pli-2.5 plb-1 text-sm font-medium transition-all duration-150 select-none',
  {
    variants: {
      variant: {
        emerald: 'bg-emerald-subtle text-emerald-main',
        yellow: 'bg-yellow-subtle text-yellow-muted border border-yellow-muted',
        neutral: 'bg-card text-fg-secondary border border-edge',
        danger: 'bg-danger-subtle text-danger border border-danger',
      },
      isSelected: {
        true: '',
      },
      isInteractive: {
        true: 'cursor-pointer',
      },
      disabled: {
        true: 'opacity-40 pointer-events-none',
      },
    },
    compoundVariants: [
      {
        variant: 'emerald',
        isSelected: true,
        className: 'bg-emerald-deep text-emerald-light border border-emerald-main',
      },
      {
        variant: 'yellow',
        isSelected: true,
        className: 'bg-yellow-main text-yellow-contrast border border-yellow-main',
      },
      {
        variant: 'neutral',
        isSelected: true,
        className: 'bg-elevated text-fg-primary border border-contrast',
      },
      {
        variant: 'danger',
        isSelected: true,
        className: 'bg-danger text-white border border-danger',
      },
      {
        variant: 'emerald',
        isInteractive: true,
        className: 'hover:bg-emerald-deep hover:text-emerald-light',
      },
      {
        variant: 'yellow',
        isInteractive: true,
        className: 'hover:bg-yellow-deep',
      },
      {
        variant: 'neutral',
        isInteractive: true,
        className: 'hover:bg-elevated hover:text-fg-primary',
      },
      {
        variant: 'danger',
        isInteractive: true,
        className: 'hover:bg-danger hover:text-white',
      },
    ],
    defaultVariants: {
      variant: 'emerald',
    },
  },
);

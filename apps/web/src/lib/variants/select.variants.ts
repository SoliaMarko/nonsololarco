import { cva } from 'class-variance-authority';

export const selectTriggerVariants = cva(
  'relative flex w-full items-center justify-between gap-2 rounded-md border pli-3 plb-2 text-caption transition-colors duration-150 outline-none cursor-pointer select-none',
  {
    variants: {
      state: {
        default: 'border-edge bg-surface text-fg-primary',
        open: 'border-emerald-main bg-surface text-fg-primary',
        error: 'border-danger bg-surface text-fg-primary',
        disabled:
          'border-edge bg-surface text-fg-disabled opacity-50 cursor-not-allowed pointer-events-none',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

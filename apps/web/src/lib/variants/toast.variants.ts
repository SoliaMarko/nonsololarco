import { cva } from 'class-variance-authority';

export const toastVariants = cva(
  [
    'pli-4 plb-3 font-ui border-2 text-sm font-medium inline-flex items-center gap-2.5',
    'shadow-[2px_2px_0_rgba(0,0,0,0.5)]',
  ],
  {
    variants: {
      variant: {
        error:
          'border-primary-dark bg-danger-deep text-primary-light',
        info: 'border-primary-dark bg-surface text-fg-primary',
        success:
          'border-primary-dark bg-emerald-deep text-primary-light',
      },
    },
    defaultVariants: {
      variant: 'success',
    },
  },
);

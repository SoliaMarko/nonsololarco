import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium cursor-pointer transition-all duration-150 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-emerald-main text-white hover:bg-emerald-deep focus-visible:ring-emerald-main',
        secondary: 'bg-yellow-main hover:bg-yellow-deep',
        ghost:
          'bg-transparent text-emerald-main border border-emerald-main hover:bg-emerald-main hover:text-primary-light',
        outline: 'border border-contrast bg-transparent text-contrast hover:bg-surface',
        destructive: 'bg-danger text-white hover:bg-danger-deep',
      },
      size: {
        xs: 'h-6 pli-2 text-xs gap-1',
        sm: 'h-8 pli-3 text-sm gap-1.5',
        md: 'h-10 pli-4 text-md gap-2',
        lg: 'h-12 pli-5 text-lg gap-2',
        xl: 'h-16 pli-8 text-xl gap-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

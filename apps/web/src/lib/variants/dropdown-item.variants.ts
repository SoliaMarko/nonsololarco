import { cva } from 'class-variance-authority';

export const dropdownItemVariants = cva(
  'flex items-center gap-2 w-full pli-3 plb-2 text-caption cursor-pointer transition-colors duration-100 outline-none select-none focus-visible:bg-elevated first:pbs-3 first:rounded-t-lg last:pbe-3 last:rounded-b-lg data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'text-fg-secondary data-highlighted:text-fg-primary data-highlighted:bg-base',
        danger: 'text-danger data-highlighted:bg-danger-subtle',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

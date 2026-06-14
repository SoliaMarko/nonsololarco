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

        /**
         * press — physical 3D button with push-down effect on hover/active.
         * Uses box-shadow to simulate depth; translates on interaction.
         *
         * Best used as a circular action button (rounded-full + fixed w/h).
         *
         * @example
         * <Button variant="press" className="rounded-full w-16 h-16 p-0">
         *   <RepertoireIcon />
         * </Button>
         */
        press: [
          'bg-bg-base text-fg-muted',
          'border-[3px] border-fg-muted',
          'rounded-full',
          'hover:text-fg-primary hover:border-fg-primary',
          'hover:shadow-[2px_2px_0px_0px_var(--color-fg-primary)]',
          'hover:translate-x-[-2px] hover:translate-y-[-2px]',
          'active:shadow-none',
          'active:translate-x-[0px] active:translate-y-[0px]',
          'transition-[transform,box-shadow] duration-100 ease-out',
          'focus-visible:ring-fg-primary',
        ],
        'retro-primary': [
          'bg-yellow-main text-primary-dark',
          'border-[3px] border-primary-dark',
          'rounded-none justify-start',
          '-translate-x-0.5 -translate-y-0.5',
          'shadow-[2px_2px_0px_0px_var(--color-primary-dark)]',
          'hover:translate-x-[-4px] hover:translate-y-[-4px]',
          'hover:shadow-[4px_4px_0px_0px_var(--color-primary-dark)]',
          'active:-translate-x-0.5 active:-translate-y-0.5',
          'active:shadow-[2px_2px_0px_0px_var(--color-primary-dark)]',
          'transition-[transform,box-shadow] duration-100 ease-out',
        ],
        'retro-outline': [
          'bg-primary-light text-primary-dark',
          'border-[3px] border-primary-dark',
          'rounded-none justify-start',
          '-translate-x-0.5 -translate-y-0.5',
          'shadow-[2px_2px_0px_0px_var(--color-primary-dark)]',
          'hover:translate-x-[-4px] hover:translate-y-[-4px]',
          'hover:shadow-[4px_4px_0px_0px_var(--color-primary-dark)]',
          'active:-translate-x-0.5 active:-translate-y-0.5',
          'active:shadow-[2px_2px_0px_0px_var(--color-primary-dark)]',
          'transition-[transform,box-shadow] duration-100 ease-out',
        ],
      },
      size: {
        xs: 'min-h-6 pli-2 text-xs gap-1',
        sm: 'min-h-8 pli-3 text-sm gap-1.5',
        md: 'min-h-10 pli-4 text-md gap-2',
        lg: 'min-h-12 pli-5 text-lg gap-2',
        xl: 'min-h-16 pli-8 text-xl gap-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

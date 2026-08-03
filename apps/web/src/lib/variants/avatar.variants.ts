import { cva } from 'class-variance-authority';

export const avatarVariants = cva(
  'relative inline-flex items-center justify-center rounded-full font-medium select-none shrink-0 bg-emerald-deep text-emerald-light',
  {
    variants: {
      size: {
        xs: 'w-6 h-6 text-[8px]', // 24px
        sm: 'w-8 h-8 text-[10px]', // 32px
        md: 'w-10 h-10 text-[12px]', // 40px
        lg: 'w-12 h-12 text-[14px]', // 48px
        xl: 'w-14 h-14 text-[16px]', // 56px
      },
      status: {
        online: 'bg-emerald-deep text-emerald-light shadow-[0_0_0_3px_rgba(61,155,114,0.2)]',
        pause: 'bg-status-pause-solid text-yellow-contrast',
        away: 'bg-status-away-subtle text-status-away',
        long: 'bg-elevated text-fg-tertiary',
        inactive: 'bg-surface text-fg-disabled',
      },
      frame: {
        none: '',
        portrait:
          'border-4 border-emerald-light text-accent-dark-green bg-[radial-gradient(circle_at_30%_30%,#f5f0e8,#d8ede6)]',
      },
    },
    defaultVariants: {
      size: 'md',
      status: null,
      frame: 'none',
    },
  },
);

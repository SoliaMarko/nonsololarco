import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'absolute bottom-0 right-0 rounded-full border-2 border-base flex items-center justify-center font-normal leading-none',
  {
    variants: {
      size: {
        xs: 'w-1.5 h-1.5 text-[5px]',
        sm: 'w-2 h-2 text-[6px]',
        md: 'w-3 h-3 text-[8px]',
        lg: 'w-3.5 h-3.5 text-[9px]',
        xl: 'w-4 h-4 text-[10px]',
      },
      status: {
        online: 'bg-status-online',
        pause: 'bg-yellow-subtle text-status-pause',
        away: 'bg-surface text-status-away',
        long: 'bg-surface text-status-long',
        inactive: 'bg-surface text-status-inactive',
      },
    },
  },
);

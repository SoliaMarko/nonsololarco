import { cva } from 'class-variance-authority';

export const standaloneBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-pill pli-2.5 plb-0.5 text-base font-medium',
  {
    variants: {
      variant: {
        online: 'bg-emerald-subtle text-status-online',
        pause: 'bg-yellow-subtle text-status-pause border border-edge',
        away: 'bg-status-away-subtle text-status-away border border-edge',
        long: 'bg-surface text-status-long border border-edge',
        inactive: 'bg-surface text-status-inactive border border-edge',
        emerald: 'bg-emerald-subtle text-emerald-main',
        yellow: 'bg-yellow-subtle text-yellow-muted border border-yellow-muted',
        neutral: 'bg-card text-fg-secondary border border-edge',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

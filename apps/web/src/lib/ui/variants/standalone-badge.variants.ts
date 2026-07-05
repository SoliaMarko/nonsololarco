import { cva } from 'class-variance-authority';

export const standaloneBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded-pill font-medium',
  {
    variants: {
      size: {
        xs: 'pli-2 plb-0.5 text-[10px]',
        sm: 'pli-2 plb-0.5 text-[11px]',
        md: 'pli-2.5 plb-0.5 text-[13px]',
        lg: 'pli-3 plb-1 text-[15px]',
        xl: 'pli-4 plb-1 text-[16px]',
      },
      variant: {
        emerald: 'bg-emerald-subtle text-emerald-main',
        yellow: 'bg-yellow-subtle text-yellow-muted border border-yellow-muted',
        neutral: 'bg-card text-fg-secondary border border-edge',
        danger: 'bg-danger-subtle text-danger border border-danger',
        'stamp-ready':
          'uppercase tracking-widest font-bold rounded-sm bg-transparent text-emerald-main border border-emerald-main',
        'stamp-learning':
          'uppercase tracking-widest font-bold rounded-sm bg-transparent text-yellow-muted border border-yellow-muted',
        'stamp-new':
          'uppercase tracking-widest font-bold rounded-sm bg-transparent text-danger border border-danger',
        'stamp-archived':
          'uppercase tracking-widest font-bold rounded-sm bg-transparent text-fg-tertiary border border-fg-disabled',
      },
      status: {
        online: 'bg-emerald-subtle text-status-online',
        pause: 'bg-yellow-subtle text-status-pause border border-edge',
        away: 'bg-status-away-subtle text-status-away border border-edge',
        long: 'bg-surface text-status-long border border-edge',
        inactive: 'bg-surface text-status-inactive border border-edge',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'neutral',
    },
  },
);

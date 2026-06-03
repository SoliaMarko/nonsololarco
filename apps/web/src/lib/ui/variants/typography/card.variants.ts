import { cva } from 'class-variance-authority';

export const cardVariants = cva('rounded-lg p-3', {
  variants: {
    variant: {
      default: 'bg-card border border-edge',
      elevated: 'bg-elevated',
      outlined: 'bg-transparent border border-edge',
      emerald: 'bg-emerald-subtle border border-emerald-deep',
      yellow: 'bg-yellow-subtle border border-yellow-muted',
      danger: 'bg-danger-subtle border border-danger',
      ghost: 'bg-transparent border border-dashed border-edge',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

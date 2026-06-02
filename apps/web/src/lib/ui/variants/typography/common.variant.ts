export const alignVariants = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
} as const;

export const colorVariants = {
  primary: 'text-fg-primary',
  secondary: 'text-fg-secondary',
  tertiary: 'text-fg-tertiary',
  disabled: 'text-fg-disabled',
  accent: 'text-emerald-main',
  highlight: 'text-yellow-main',
  danger: 'text-danger',
} as const;

export const sizeVariants = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
} as const;

export const truncateVariant = {
  true: 'truncate',
} as const;

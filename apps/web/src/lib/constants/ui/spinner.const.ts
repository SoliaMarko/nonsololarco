import { VariantProps } from 'class-variance-authority';

import { spinnerVariants } from '../../variants/spinner.variants';

export const NOTES = ['♩', '♪', '♫', '♩'] as const;
export const DELAYS = ['0s', '0.15s', '0.3s', '0.45s'] as const;

export const WAVE_HEIGHT: Record<
  NonNullable<VariantProps<typeof spinnerVariants>['size']>,
  string
> = {
  xs: '-3px',
  sm: '-5px',
  md: '-8px',
  lg: '-12px',
  xl: '-16px',
  xxl: '-22px',
};

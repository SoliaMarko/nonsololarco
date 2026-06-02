import { cva } from 'class-variance-authority';

import { DividerThicknessType, DividerVariantType } from '../../types/ui/divider.types';

export const dividerVariants = cva('border-dotted', {
  variants: {
    color: {
      primary: 'border-fg-primary',
      secondary: 'border-fg-secondary',
      tertiary: 'border-fg-tertiary',
      emerald: 'border-emerald-main',
      danger: 'border-danger',
    },
  },
  defaultVariants: {
    color: 'secondary',
  },
});

export const labelColorMap: Record<NonNullable<DividerVariantType>, string> = {
  primary: 'text-fg-primary',
  secondary: 'text-fg-secondary',
  tertiary: 'text-fg-tertiary',
  emerald: 'text-emerald-main',
  danger: 'text-danger',
};

export const LABEL_COLOR_DEFAULT = 'secondary' satisfies DividerVariantType;

export const labelSizeMap: Record<NonNullable<DividerThicknessType>, string> = {
  1: 'text-[1.2rem]',
  2: 'text-[1.4rem]',
  4: 'text-[1.6rem]',
  8: 'text-[1.8rem]',
};

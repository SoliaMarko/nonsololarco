import { VariantProps } from 'class-variance-authority';

import { dividerVariants } from '../../ui/variants/ui/divider.variants';

export type DividerThicknessType = 1 | 2 | 4 | 8;
export type DividerVariantType = VariantProps<typeof dividerVariants>['color'];

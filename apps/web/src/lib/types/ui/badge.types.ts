import { VariantProps } from 'class-variance-authority';

import { badgeVariants } from '../../ui/variants/badge.variants';

export type BadgeStatus = NonNullable<VariantProps<typeof badgeVariants>['status']>;

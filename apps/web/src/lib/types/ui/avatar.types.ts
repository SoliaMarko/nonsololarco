import { VariantProps } from 'class-variance-authority';

import { avatarVariants } from '../../ui/variants/avatar.variants';
import { badgeVariants } from '../../ui/variants/badge.variants';

export type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>['size']>;
export type AvatarStatus = NonNullable<VariantProps<typeof badgeVariants>['status']>;

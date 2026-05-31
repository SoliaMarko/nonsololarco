import { VariantProps } from 'class-variance-authority';

import { avatarVariants } from '../../ui/variants/ui/avatar.variants';
import { badgeVariants } from '../../ui/variants/ui/badge.variants';

export type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>['size']>;
export type AvatarStatus = NonNullable<VariantProps<typeof badgeVariants>['status']>;

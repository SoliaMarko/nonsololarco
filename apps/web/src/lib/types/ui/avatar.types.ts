import { VariantProps } from 'class-variance-authority';

import { avatarVariants } from '../../ui/variants/avatar.variants';

export type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>['size']>;

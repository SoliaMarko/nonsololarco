import { VariantProps } from 'class-variance-authority';

import { avatarVariants } from '../../variants/avatar.variants';

export type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>['size']>;

export type AvatarFrame = NonNullable<VariantProps<typeof avatarVariants>['frame']>;

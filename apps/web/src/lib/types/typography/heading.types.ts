import { VariantProps } from 'class-variance-authority';

import { headingVariants } from '@/src/lib/ui/variants/typography/heading.variants';

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
export type HeadingVariantProps = VariantProps<typeof headingVariants>;

export const TAG_DEFAULT_SIZE: Record<HeadingTag, HeadingSize> = {
  h1: '2xl',
  h2: 'xl',
  h3: 'lg',
  h4: 'base',
  h5: 'sm',
  h6: 'xs',
};

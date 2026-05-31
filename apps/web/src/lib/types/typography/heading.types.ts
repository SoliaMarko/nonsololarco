import { VariantProps } from 'class-variance-authority';

import { headingVariants } from '../../ui/variants/typography/heading.variants';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingVariantProps = VariantProps<typeof headingVariants>;

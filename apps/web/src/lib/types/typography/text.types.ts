import { VariantProps } from 'class-variance-authority';

import { textVariants } from '@/src/lib/ui/variants/typography/text.variants';

export type TextElement = 'p' | 'span' | 'strong' | 'em' | 'small';

export type TextVariantProps = VariantProps<typeof textVariants>;

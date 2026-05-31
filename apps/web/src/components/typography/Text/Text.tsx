import { ElementType, ForwardedRef, HTMLAttributes, forwardRef } from 'react';

import { TextElement, TextVariantProps } from '@/src/lib/types/typography/text.types';
import { cn } from '@/src/lib/ui/utils/cn';
import { textVariants } from '@/src/lib/ui/variants/typography/text.variants';

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color'>, TextVariantProps {
  className?: string;
  tag?: TextElement;
}

function Text(
  { tag = 'p', className, size, weight, color, align, isTruncated, ...rest }: TextProps,
  ref: ForwardedRef<HTMLElement>,
) {
  const Component = tag as ElementType;

  return (
    <Component
      className={cn(textVariants({ size, weight, color, align, isTruncated }), className)}
      ref={ref}
      {...rest}
    />
  );
}

export default forwardRef<HTMLElement, TextProps>(Text);

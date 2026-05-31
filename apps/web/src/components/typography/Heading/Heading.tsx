import { ForwardedRef, HTMLAttributes, forwardRef } from 'react';

import {
  HeadingTag,
  HeadingVariantProps,
  TAG_DEFAULT_SIZE,
} from '@/src/lib/types/typography/heading.types';
import { cn } from '@/src/lib/ui/utils/cn';
import { headingVariants } from '@/src/lib/ui/variants/typography/heading.variants';

export interface HeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'color'>, HeadingVariantProps {
  className?: string;
  isTruncated?: boolean;
  tag?: HeadingTag;
}

function Heading(
  { tag: Component = 'h2', className, color, align, isTruncated, size, ...rest }: HeadingProps,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <Component
      className={cn(
        headingVariants({ size: size ?? TAG_DEFAULT_SIZE[Component], color, align, isTruncated }),
        className,
      )}
      ref={ref}
      {...rest}
    />
  );
}

export default forwardRef<HTMLHeadingElement, HeadingProps>(Heading);

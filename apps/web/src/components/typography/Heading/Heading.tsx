import { ForwardedRef, HTMLAttributes, forwardRef } from 'react';

import { HeadingLevel, HeadingVariantProps } from '@/src/lib/types/typography/heading.types';
import { cn } from '@/src/lib/ui/utils/cn';
import { headingVariants } from '@/src/lib/ui/variants/typography/heading.variants';

export interface HeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'color'>, HeadingVariantProps {
  as?: HeadingLevel;
  className?: string;
  isTruncated?: boolean;
}

function Heading(
  { as: Component = 'h2', className, color, isTruncated, size, ...rest }: HeadingProps,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <Component
      className={cn(headingVariants({ size: size ?? Component, color, isTruncated }), className)}
      ref={ref}
      {...rest}
    />
  );
}

export default forwardRef<HTMLHeadingElement, HeadingProps>(Heading);

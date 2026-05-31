import { ForwardedRef, HTMLAttributes, forwardRef } from 'react';

import { cn } from '@/lib/ui/utils/cn';
import { HeadingLevel, HeadingVariantProps } from '@/src/lib/types/typography/heading.types';
import { headingVariants } from '@/src/lib/ui/variants/typography/heading.variants';

export interface HeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'color'>, HeadingVariantProps {
  as?: HeadingLevel;
  className?: string;
  isTruncated?: boolean;
}

function Heading(
  { as: Component = 'h2', className, color, isTruncated, level, ...rest }: HeadingProps,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <Component
      className={cn(headingVariants({ level: level ?? Component, color, isTruncated }), className)}
      ref={ref}
      {...rest}
    />
  );
}

export default forwardRef<HTMLHeadingElement, HeadingProps>(Heading);

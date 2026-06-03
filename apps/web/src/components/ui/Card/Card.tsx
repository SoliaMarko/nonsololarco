import { ForwardedRef, HTMLAttributes, ReactNode, forwardRef } from 'react';

import { VariantProps } from 'class-variance-authority';

import { cn } from '@/src/lib/ui/utils/cn';
import { cardVariants } from '@/src/lib/ui/variants/typography/card.variants';

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  children: ReactNode;
  className?: string;
}

function Card(
  { children, className, variant, ...rest }: CardProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div className={cn(cardVariants({ variant }), className)} ref={ref} {...rest}>
      {children}
    </div>
  );
}

export default forwardRef<HTMLDivElement, CardProps>(Card);

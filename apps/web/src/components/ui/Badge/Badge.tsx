import { ElementType, ForwardedRef, HTMLAttributes, ReactNode, forwardRef } from 'react';

import { VariantProps } from 'class-variance-authority';

import { cn } from '@/src/lib/ui/utils/cn';
import { standaloneBadgeVariants } from '@/src/lib/ui/variants/standalone-badge.variants';

export type BadgeVariantProps = VariantProps<typeof standaloneBadgeVariants>;

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>, BadgeVariantProps {
  children: ReactNode;
  className?: string;
  icon?: ElementType;
  iconPosition?: 'start' | 'end';
}

function Badge(
  { children, className, icon: Icon, iconPosition = 'start', variant, ...rest }: BadgeProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  return (
    <span className={cn(standaloneBadgeVariants({ variant }), className)} ref={ref} {...rest}>
      {iconPosition === 'start' && Icon ? <Icon size={10} aria-hidden="true" /> : null}
      {children}
      {iconPosition === 'end' && Icon ? <Icon size={10} aria-hidden="true" /> : null}
    </span>
  );
}

export default forwardRef<HTMLSpanElement, BadgeProps>(Badge);

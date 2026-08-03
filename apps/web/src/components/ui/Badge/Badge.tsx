import { ElementType, ForwardedRef, HTMLAttributes, ReactNode, forwardRef } from 'react';

import { VariantProps } from 'class-variance-authority';

import { ICON_POSITION, STATUS_ICON } from '@/src/lib/constants/common.const';
import { BADGE_STATUS_ICON_SIZE } from '@/src/lib/constants/ui/badge.const';
import { IconPositionType } from '@/src/lib/types/common.types';
import { BadgeSize, BadgeStatus } from '@/src/lib/types/ui/badge.types';
import { standaloneBadgeVariants } from '@/src/lib/variants/standalone-badge.variants';
import { cn } from '@/src/utils/cn';

type BadgeVariantProps = VariantProps<typeof standaloneBadgeVariants>;

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>, BadgeVariantProps {
  children?: ReactNode;
  className?: string;
  icon?: ElementType;
  iconPosition?: IconPositionType;
  size?: BadgeSize;
  status?: BadgeStatus;
}

function Badge(
  {
    children,
    className,
    icon: Icon,
    iconPosition = ICON_POSITION.start,
    size = 'md',
    status,
    variant,
    ...rest
  }: BadgeProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const StatusIcon = status ? STATUS_ICON[status] : null;
  const iconSize = BADGE_STATUS_ICON_SIZE[size];

  const resolvedIcon = StatusIcon ? (
    <StatusIcon size={String(iconSize)} aria-hidden="true" />
  ) : Icon ? (
    <Icon size={iconSize} aria-hidden="true" />
  ) : null;

  return (
    <span
      className={cn(standaloneBadgeVariants({ size, variant, status }), className)}
      ref={ref}
      {...rest}
    >
      {iconPosition === ICON_POSITION.start ? resolvedIcon : null}
      {children}
      {iconPosition === ICON_POSITION.end ? resolvedIcon : null}
    </span>
  );
}

export default forwardRef<HTMLSpanElement, BadgeProps>(Badge);

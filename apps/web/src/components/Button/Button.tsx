'use client';

import {
  ButtonHTMLAttributes,
  ElementType,
  ForwardedRef,
  ReactNode,
  createElement,
  forwardRef,
} from 'react';

import { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/ui/utils/cn';
import { buttonVariants } from '@/lib/ui/variants/button.variants';
import { iconSizes } from '@/lib/ui/variants/icon.variants';
import { IconPositionType } from '@/src/lib/types/common.types';

export interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  icon?: ElementType;
  iconPosition?: IconPositionType;
  isLoading?: boolean;
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

function Button(
  {
    children,
    className,
    contentClassName,
    disabled,
    icon,
    iconPosition,
    isLoading,
    onClick,
    size,
    type = 'button',
    variant = 'primary',
    ...rest
  }: IButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const iconSize = iconSizes[size ?? 'md'];

  const renderIcon = (position: IconPositionType) => {
    if (!icon || iconPosition !== position) return null;

    const marginClass =
      size === 'xs'
        ? position === 'start'
          ? 'mie-0.25'
          : 'mis-0.25'
        : position === 'start'
          ? 'mie-0.5'
          : 'mis-0.5';

    return createElement(icon, {
      className: cn(marginClass, 'shrink-0'),
      size: iconSize,
      'aria-hidden': true,
    });
  };

  return (
    <button
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      className={cn('relative', buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      onClick={onClick}
      ref={ref}
      type={type}
      {...rest}
    >
      {isLoading ? (
        <span
          aria-label="Loading"
          className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-inherit"
        >
          {/* TODO */}
          Loading...
        </span>
      ) : null}

      <span
        className={cn(
          'inline-flex items-center gap-[inherit] transition-opacity',
          isLoading && 'pointer-events-none opacity-0',
          contentClassName,
        )}
      >
        {renderIcon('start')}
        <span className="w-full">{children}</span>
        {renderIcon('end')}
      </span>
    </button>
  );
}

export default forwardRef<HTMLButtonElement, IButtonProps>(Button);

import { ButtonHTMLAttributes, ForwardedRef, HTMLAttributes, forwardRef } from 'react';

import { cn } from '@/src/lib/ui/utils/cn';

import Avatar, { AvatarProps } from '../Avatar/Avatar';

type AvatarButtonProps = Omit<AvatarProps, keyof HTMLAttributes<HTMLDivElement> | 'role'> &
  ButtonHTMLAttributes<HTMLButtonElement>;

function AvatarButton(
  {
    className,
    alt,
    initials,
    size,
    src,
    status,
    type = 'button',
    ...buttonProps
  }: AvatarButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      className={cn(
        'focus-visible:ring-emerald-main focus-visible:ring-offset-base cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
    >
      <Avatar alt={alt} initials={initials} size={size} src={src} status={status} />
    </button>
  );
}

export default forwardRef<HTMLButtonElement, AvatarButtonProps>(AvatarButton);

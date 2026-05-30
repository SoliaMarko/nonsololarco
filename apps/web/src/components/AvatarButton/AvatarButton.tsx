import { ButtonHTMLAttributes, ForwardedRef, forwardRef } from 'react';

import { cn } from '@/src/lib/ui/utils/cn';

import Avatar, { AvatarProps } from '../Avatar/Avatar';

type AvatarButtonProps = Omit<AvatarProps, 'role'> & ButtonHTMLAttributes<HTMLButtonElement>;

function AvatarButton(
  { className, ...props }: AvatarButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'focus-visible:ring-emerald-main focus-visible:ring-offset-base cursor-pointer rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
    >
      <Avatar {...props} />
    </button>
  );
}

export default forwardRef<HTMLButtonElement, AvatarButtonProps>(AvatarButton);

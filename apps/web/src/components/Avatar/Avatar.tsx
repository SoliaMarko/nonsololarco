'use client';

import { ForwardedRef, HTMLAttributes, forwardRef, useState } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/ui/utils/cn';
import { avatarVariants } from '@/lib/ui/variants/avatar.variants';
import { STATUS_ICON, STATUS_ICON_SIZE } from '@/src/lib/constants/avatar.const';
import { AvatarSize, AvatarStatus } from '@/src/lib/types/avatar.types';
import { badgeVariants } from '@/src/lib/ui/variants/badge.variants';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  alt?: string;
  className?: string;
  initials: string;
  size?: AvatarSize;
  src?: string;
  status?: AvatarStatus;
}

function Avatar(
  { alt, className, initials, size = 'md', src, status, ...rest }: AvatarProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;

  const StatusIcon = status ? STATUS_ICON[status] : null;
  const iconSize = STATUS_ICON_SIZE[size];

  return (
    <div
      aria-label={alt ?? initials}
      className={cn(
        avatarVariants({ size, status: showImage ? null : status }),
        { 'shadow-[0_2px_8px_rgba(0,0,0,0.25)]': showImage },
        className,
      )}
      ref={ref}
      role="img"
      {...rest}
    >
      {showImage ? (
        <Image
          alt={alt ?? initials}
          className="h-full w-full rounded-full object-cover"
          fill
          onError={() => setImgError(true)}
          src={src}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}

      {status ? (
        <span aria-label={status} className={cn(badgeVariants({ size, status }))} role="status">
          {StatusIcon ? <StatusIcon size={String(iconSize)} aria-hidden="true" /> : null}
        </span>
      ) : null}
    </div>
  );
}

export default forwardRef<HTMLDivElement, AvatarProps>(Avatar);

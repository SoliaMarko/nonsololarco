'use client';

import { ForwardedRef, HTMLAttributes, forwardRef, useEffect, useState } from 'react';

import Image from 'next/image';

import { STATUS_ICON } from '@/src/lib/constants/common.const';
import { STATUS_ICON_SIZE } from '@/src/lib/constants/ui/avatar.const';
import { AvatarFrame, AvatarSize } from '@/src/lib/types/ui/avatar.types';
import { BadgeStatus } from '@/src/lib/types/ui/badge.types';
import { avatarVariants } from '@/src/lib/variants/avatar.variants';
import { badgeVariants } from '@/src/lib/variants/badge.variants';
import { cn } from '@/src/utils/cn';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  alt?: string;
  className?: string;
  frame?: AvatarFrame;
  initials: string;
  size?: AvatarSize;
  src?: string;
  status?: BadgeStatus;
}

function Avatar(
  { alt, className, frame = 'none', initials, size = 'md', src, status, ...rest }: AvatarProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const showImage = src && !imgError;

  const StatusIcon = status ? STATUS_ICON[status] : null;
  const iconSize = STATUS_ICON_SIZE[size];

  return (
    <div
      aria-label={alt ?? initials}
      className={cn(
        avatarVariants({ size, status: showImage ? null : status, frame }),
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

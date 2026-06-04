import { CSSProperties, HTMLAttributes } from 'react';

import { SkeletonRounded } from '@/src/lib/types/ui/skeleton.types';
import { cn } from '@/src/lib/ui/utils/cn';
import { roundedMap } from '@/src/lib/ui/variants/skeleton.variants';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  /** Accepts px number (e.g. 48) or CSS string (e.g. '100%', '3rem') */
  height?: string | number;
  rounded?: SkeletonRounded;
  /** Accepts px number (e.g. 200) or CSS string (e.g. '100%', '3rem') */
  width?: string | number;
}

function Skeleton({
  className,
  height = '1rem',
  rounded = 'md',
  width = '100%',
  ...rest
}: SkeletonProps) {
  const style: CSSProperties = {
    width: typeof width === 'number' ? `${width / 16}rem` : width,
    height: typeof height === 'number' ? `${height / 16}rem` : height,
  };

  return (
    <div
      aria-hidden="true"
      className={cn('skeleton-shimmer shrink-0', roundedMap[rounded], className)}
      style={style}
      {...rest}
    />
  );
}

export default Skeleton;

import { Ref, SVGProps, forwardRef } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/lib/ui/utils/svg.utils';

type ChevronDirection = 'up' | 'down' | 'left' | 'right';

const ROTATION: Record<ChevronDirection, number> = {
  down: 0,
  up: 180,
  right: -90,
  left: 90,
};

export interface ChevronIconProps extends Partial<SVGProps<SVGSVGElement> & SVGCustomProps> {
  /** Direction the chevron points. @default 'down' */
  direction?: ChevronDirection;
}

function ChevronIcon(
  {
    strokeWidth = '1.5',
    title,
    titleId,
    direction = 'down',
    style: styleProp,
    ...props
  }: ChevronIconProps,
  ref: Ref<SVGSVGElement>,
) {
  return (
    <svg
      aria-labelledby={titleId}
      fill="none"
      height={props.size || 24}
      width={props.size || 24}
      viewBox={calcViewBox({ x1: 3, y1: 3, x2: 17, y2: 17 })}
      preserveAspectRatio="xMidYMid meet"
      style={{ transform: `rotate(${ROTATION[direction]}deg)`, ...styleProp }}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default forwardRef<SVGSVGElement, ChevronIconProps>(ChevronIcon);

import { Ref, SVGProps, forwardRef } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/lib/ui/utils/svg.utils';

function DisconnectOutlineIcon(
  {
    strokeWidth = '1.3',
    title,
    titleId,
    ...props
  }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps>,
  ref: Ref<SVGSVGElement>,
) {
  return (
    <svg
      aria-labelledby={titleId}
      fill="none"
      height={props.size || 24}
      width={props.size || 24}
      viewBox={calcViewBox({ x1: 2, y1: 2, x2: 18, y2: 18 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M2 17C2 14.2 4.2 12 7 12C8.3 12 9.4 12.5 10.3 13.2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M13 13L17 17M17 13L13 17"
        stroke="currentColor"
        strokeWidth={Number(strokeWidth) * 1.15}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default forwardRef(DisconnectOutlineIcon);

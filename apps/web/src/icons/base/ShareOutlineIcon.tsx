import { Ref, SVGProps, forwardRef } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

function ShareOutlineIcon(
  { title, titleId, ...props }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps>,
  ref: Ref<SVGSVGElement>,
) {
  return (
    <svg
      aria-labelledby={titleId}
      fill="none"
      height={props.size || '24'}
      width={props.size || '24'}
      viewBox={calcViewBox({ x1: 2.5, y1: 2.5, x2: 17.5, y2: 17.5 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle cx="5" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="15" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="15" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <line
        x1="7.5"
        y1="9"
        x2="12.5"
        y2="6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="7.5"
        y1="11"
        x2="12.5"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ForwardRef = forwardRef(ShareOutlineIcon);
export default ForwardRef;

import { Ref, SVGProps, forwardRef } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/lib/ui/utils/svg.utils';

function SettingsOutlineIcon(
  { title, titleId, ...props }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps>,
  ref: Ref<SVGSVGElement>,
) {
  return (
    <svg
      aria-labelledby={titleId}
      fill="none"
      height={props.size || '24'}
      width={props.size || '24'}
      viewBox={calcViewBox({ x1: 2, y1: 2, x2: 18, y2: 18 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M8.5 3.5L8 5.2C7.5 5.4 7 5.7 6.6 6.1L4.9 5.5L3.5 8L4.8 9C4.7 9.3 4.7 9.7 4.7 10C4.7 10.3 4.7 10.7 4.8 11L3.5 12L4.9 14.5L6.6 13.9C7 14.3 7.5 14.6 8 14.8L8.5 16.5H11.5L12 14.8C12.5 14.6 13 14.3 13.4 13.9L15.1 14.5L16.5 12L15.2 11C15.3 10.7 15.3 10.3 15.3 10C15.3 9.7 15.3 9.3 15.2 9L16.5 8L15.1 5.5L13.4 6.1C13 5.7 12.5 5.4 12 5.2L11.5 3.5H8.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export default forwardRef(SettingsOutlineIcon);

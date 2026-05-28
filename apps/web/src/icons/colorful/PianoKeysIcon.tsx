import { Ref, SVGProps, forwardRef } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

function PianoKeysIcon(
  { title, titleId, ...props }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps>,
  ref: Ref<SVGSVGElement>,
) {
  return (
    <svg
      aria-labelledby={titleId}
      fill="none"
      height={props.size || '64'}
      width={props.size || '64'}
      viewBox={calcViewBox({ x1: 6, y1: 14, x2: 58, y2: 50 }, 2)}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x="6"
        y="14"
        width="52"
        height="36"
        rx="3"
        fill="#F0E8D8"
        stroke="#5A4F44"
        strokeWidth="1.5"
      />
      <line x1="14.4" y1="34" x2="14.4" y2="50" stroke="#5A4F44" strokeWidth="1.2" />
      <line x1="24.8" y1="34" x2="24.8" y2="50" stroke="#5A4F44" strokeWidth="1.2" />
      <line x1="35.2" y1="34" x2="35.2" y2="50" stroke="#5A4F44" strokeWidth="1.2" />
      <line x1="45.6" y1="34" x2="45.6" y2="50" stroke="#5A4F44" strokeWidth="1.2" />
      <rect x="11.5" y="14" width="6.5" height="20" rx="1.2" fill="#15120F" />
      <rect x="22" y="14" width="6.5" height="20" rx="1.2" fill="#15120F" />
      <rect x="35.5" y="14" width="6.5" height="20" rx="1.2" fill="#15120F" />
      <rect x="46" y="14" width="6.5" height="20" rx="1.2" fill="#15120F" />
    </svg>
  );
}

const ForwardRef = forwardRef(PianoKeysIcon);
export default ForwardRef;

import { Ref, SVGProps, forwardRef } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

function MusicPlant(
  { title, titleId, ...props }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps>,
  ref: Ref<SVGSVGElement>,
) {
  return (
    <svg
      aria-labelledby={titleId}
      fill="none"
      height={props.size || '120'}
      width={props.size || '120'}
      viewBox={calcViewBox({ x1: 31, y1: 13.2, x2: 87, y2: 98.6 }, 2)}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {/* note */}
      <g fill="currentColor">
        <ellipse cx="61.2" cy="27.6" rx="4.4" ry="3.4" transform="rotate(-22 61.2 27.6)" />
        <path
          d="M64.6 13.2 v14.6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M64.6 13.2 C 71.6 14.4, 73.6 19.6, 70.4 24.6 C 71.4 20.6, 69.4 17.8, 64.6 17.6 Z" />
      </g>
      {/* leaves */}
      <g stroke="#2b201a" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M60 60 C 46 60 36 50 36 38 C 50 38 60 48 60 60 Z" fill="#3e9d5e" />
        <path d="M60 60 C 74 60 84 50 84 38 C 70 38 60 48 60 60 Z" fill="#3e9d5e" />
      </g>
      {/* pot */}
      <g stroke="#2b201a" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        {/* rim */}
        <path
          d="M33 58 H 87 a2 2 0 0 1 2 2 v6 a2 2 0 0 1 -2 2 H 33 a2 2 0 0 1 -2 -2 v-6 a2 2 0 0 1 2 -2 Z"
          fill="#d98841"
        />
        {/* body */}
        <path d="M37 68 H 83 L 79 96 a3 3 0 0 1 -3 2.6 H 44 a3 3 0 0 1 -3 -2.6 Z" fill="#d98841" />
        {/* soil line just below rim */}
        <path
          d="M38.5 71 H 81.5"
          stroke="#b86d2e"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

const ForwardRef = forwardRef(MusicPlant);
export default ForwardRef;

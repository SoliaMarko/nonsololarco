import { Ref, SVGProps, forwardRef } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

function BouquetIcon(
  { title, titleId, ...props }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps>,
  ref: Ref<SVGSVGElement>,
) {
  return (
    <svg
      aria-labelledby={titleId}
      fill="none"
      height={props.size || '64'}
      width={props.size || '64'}
      viewBox={calcViewBox({ x1: 16.5, y1: 10.5, x2: 47.5, y2: 62 }, 2)}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <g stroke="#4ABE7C" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M 22 30 Q 26 40 30 50" />
        <path d="M 32 28 L 32 52" />
        <path d="M 42 30 Q 38 40 34 50" />
      </g>
      <ellipse
        cx="24"
        cy="42"
        rx="3.6"
        ry="1.6"
        transform="rotate(-30 24 42)"
        fill="#4ABE7C"
        stroke="#5A4F44"
        strokeWidth="0.6"
      />
      <ellipse
        cx="40"
        cy="42"
        rx="3.6"
        ry="1.6"
        transform="rotate(30 40 42)"
        fill="#4ABE7C"
        stroke="#5A4F44"
        strokeWidth="0.6"
      />
      <circle cx="22" cy="22" r="5.5" fill="#E84545" stroke="#5A4F44" strokeWidth="1" />
      <circle cx="22" cy="22" r="1.8" fill="#E8C547" />
      <circle cx="42" cy="22" r="5.5" fill="#E8933A" stroke="#5A4F44" strokeWidth="1" />
      <circle cx="42" cy="22" r="1.8" fill="#E8C547" />
      <circle cx="32" cy="17" r="6.5" fill="#C97AC0" stroke="#5A4F44" strokeWidth="1" />
      <circle cx="32" cy="17" r="2.2" fill="#E8C547" />
      <circle cx="28" cy="28" r="4.5" fill="#7B6FD4" stroke="#5A4F44" strokeWidth="1" />
      <circle cx="28" cy="28" r="1.4" fill="#E8C547" />
      <circle cx="36" cy="28" r="4.5" fill="#4A8FD4" stroke="#5A4F44" strokeWidth="1" />
      <circle cx="36" cy="28" r="1.4" fill="#E8C547" />
      <path
        d="M 24 48 L 40 48 L 38 58 L 26 58 Z"
        fill="#D4C9B0"
        stroke="#5A4F44"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M 28 51 L 36 51" stroke="#5A4F44" strokeWidth="0.6" opacity="0.5" />
      <path
        d="M 32 58 Q 28 60 27 62 L 30 60 L 32 62 L 34 60 L 37 62 Q 36 60 32 58 Z"
        fill="#C97AC0"
        stroke="#5A4F44"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ForwardRef = forwardRef(BouquetIcon);
export default ForwardRef;

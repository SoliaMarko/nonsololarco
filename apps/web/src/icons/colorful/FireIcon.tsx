import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

function FireIcon(
  { title, titleId, ...props }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps>,
  ref: Ref<SVGSVGElement>,
) {
  const generatedId = useId();
  const resolvedTitleId = titleId ?? (title ? generatedId : undefined);

  return (
    <svg
      {...(title ? { role: 'img', 'aria-labelledby': resolvedTitleId } : { 'aria-hidden': true })}
      fill="none"
      height={props.size || '64'}
      width={props.size || '64'}
      viewBox={calcViewBox({ x1: 22, y1: 8, x2: 50, y2: 44 }, 2)}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <g style={{ transformOrigin: '50% 90%' }}>
        <path
          d="M32 8 C 26 18 22 22 22 32 C 22 38 24 42 28 44 C 26 40 28 36 32 32 C 34 38 38 38 38 32 C 42 36 44 40 44 44 C 48 42 50 38 50 32 C 50 26 46 22 42 16 C 40 22 36 22 36 18 C 36 14 34 10 32 8 Z"
          fill="#E8933A"
          stroke="#5A4F44"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d="M32 24 C 28 30 28 36 32 40 C 36 36 36 30 32 24 Z" fill="#E8C547" />
      </g>
    </svg>
  );
}

const ForwardRef = forwardRef(FireIcon);
export default ForwardRef;

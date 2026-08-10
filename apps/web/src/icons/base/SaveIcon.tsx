import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/utils/svg.utils';

function SaveIcon(
  { title, titleId, ...props }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps>,
  ref: Ref<SVGSVGElement>,
) {
  const generatedId = useId();
  const resolvedTitleId = titleId ?? (title ? generatedId : undefined);

  return (
    <svg
      {...(title ? { role: 'img', 'aria-labelledby': resolvedTitleId } : { 'aria-hidden': true })}
      fill="none"
      height={props.size || 24}
      width={props.size || 24}
      viewBox={calcViewBox({ x1: 3, y1: 3, x2: 21, y2: 21 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <path
        d="M17 21H7a4 4 0 01-4-4V7a4 4 0 014-4h7.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V17a4 4 0 01-4 4z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M7 3v5h8V3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="7" y="13" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default forwardRef(SaveIcon);

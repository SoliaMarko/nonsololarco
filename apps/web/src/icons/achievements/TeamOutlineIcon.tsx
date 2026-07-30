import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/utils/svg.utils';

function TeamOutlineIcon(
  {
    strokeWidth = '1.7',
    title,
    titleId,
    ...props
  }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps>,
  ref: Ref<SVGSVGElement>,
) {
  const generatedId = useId();
  const resolvedTitleId = titleId ?? (title ? generatedId : undefined);

  return (
    <svg
      {...(title ? { role: 'img', 'aria-labelledby': resolvedTitleId } : { 'aria-hidden': true })}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      height={props.size || 24}
      width={props.size || 24}
      viewBox={calcViewBox({ x1: 3.6, y1: 5.5, x2: 20.4, y2: 19 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.6 19a5.4 5.4 0 0 1 10.8 0" />
      <circle cx="16.6" cy="9.5" r="2.2" />
      <path d="M16 14a4.4 4.4 0 0 1 4.4 4.4" />
    </svg>
  );
}

const ForwardRef = forwardRef(TeamOutlineIcon);
export default ForwardRef;

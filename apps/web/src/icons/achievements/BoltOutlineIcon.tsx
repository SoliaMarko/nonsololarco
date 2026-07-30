import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/utils/svg.utils';

function BoltOutlineIcon(
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
      viewBox={calcViewBox({ x1: 6, y1: 3, x2: 18, y2: 21 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <path d="M13 3L6 13.2h5l-1 7.8 8-11h-5z" />
    </svg>
  );
}

const ForwardRef = forwardRef(BoltOutlineIcon);
export default ForwardRef;

import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

function CrownOutlineIcon(
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
      viewBox={calcViewBox({ x1: 4, y1: 5.5, x2: 20, y2: 18.5 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <path d="M4 8.5l4 3.5 4-6.5 4 6.5 4-3.5-1.8 10H5.8z" />
    </svg>
  );
}

const ForwardRef = forwardRef(CrownOutlineIcon);
export default ForwardRef;

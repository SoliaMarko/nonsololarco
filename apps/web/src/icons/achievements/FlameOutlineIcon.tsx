import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

function FlameOutlineIcon(
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
      viewBox={calcViewBox({ x1: 8.4, y1: 3.5, x2: 15.6, y2: 15 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <path d="M12 3.5c.5 2.6 3.6 3.9 3.6 7.6a3.6 3.6 0 0 1-7.2 0c0-1.6.7-2.7 1.7-3.5.3 1 .9 1.7 1.7 1.9C12.4 7.7 12 5.7 12 3.5z" />
    </svg>
  );
}

const ForwardRef = forwardRef(FlameOutlineIcon);
export default ForwardRef;

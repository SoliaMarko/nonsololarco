import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/utils/svg.utils';

function MicrophoneIcon(
  {
    strokeWidth = '2',
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
      height={props.size || 24}
      width={props.size || 24}
      viewBox={calcViewBox({ x1: 5, y1: 2, x2: 19, y2: 22 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <path
        d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zM5 10v1a7 7 0 0014 0v-1M12 18v4M8 22h8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default forwardRef(MicrophoneIcon);

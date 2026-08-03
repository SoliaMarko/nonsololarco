import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/utils/svg.utils';

function OnlineIcon(
  {
    className = 'text-status-online',
    strokeWidth = '1',
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
      className={className}
      fill="none"
      height={props.size || 36}
      width={props.size || 36}
      viewBox={calcViewBox({ x1: 6, y1: 6, x2: 30, y2: 30 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <circle cx="18" cy="18" r="7" fill="currentColor" />
      <circle
        cx="18"
        cy="18"
        r="12"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity="0.25"
      />
    </svg>
  );
}

const ForwardRef = forwardRef(OnlineIcon);
export default ForwardRef;

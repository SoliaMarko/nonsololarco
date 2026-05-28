import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

function PlusSolidIcon(
  { title, titleId, ...props }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps>,
  ref: Ref<SVGSVGElement>,
) {
  const generatedId = useId();
  const resolvedTitleId = titleId ?? (title ? generatedId : undefined);

  return (
    <svg
      {...(title ? { role: 'img', 'aria-labelledby': resolvedTitleId } : { 'aria-hidden': true })}
      fill="none"
      height={props.size || '24'}
      width={props.size || '24'}
      viewBox={calcViewBox({ x1: 4, y1: 4, x2: 16, y2: 16 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <line
        x1="10"
        y1="4"
        x2="10"
        y2="16"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="10"
        x2="16"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ForwardRef = forwardRef(PlusSolidIcon);
export default ForwardRef;

import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/utils/svg.utils';

function PickIcon(
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
      viewBox={calcViewBox({ x1: 3.5, y1: 2.5, x2: 20.5, y2: 21 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <path
        d="M12 2.5c5 0 8.5 2.6 8.5 6.2 0 4.2-4.2 9.4-7 12.2a2.1 2.1 0 0 1-3 0c-2.8-2.8-7-8-7-12.2C3.5 5.1 7 2.5 12 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

const ForwardRef = forwardRef(PickIcon);
export default ForwardRef;

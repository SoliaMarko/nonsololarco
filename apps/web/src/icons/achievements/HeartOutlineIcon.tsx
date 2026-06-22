import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

function HeartOutlineIcon(
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
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      height={props.size || '24'}
      width={props.size || '24'}
      viewBox={calcViewBox({ x1: 3, y1: 3.9, x2: 21, y2: 20.5 })}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <path d="M12 20.5C12 20.5 3 14.6 3 8.7C3 5.9 5.2 3.9 7.7 3.9C9.4 3.9 11 4.9 12 6.5C13 4.9 14.6 3.9 16.3 3.9C18.8 3.9 21 5.9 21 8.7C21 14.6 12 20.5 12 20.5Z" />
    </svg>
  );
}

const ForwardRef = forwardRef(HeartOutlineIcon);
export default ForwardRef;

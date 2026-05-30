import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

function WholeRestIcon(
  // TODO:
  { className = '', title, titleId, ...props }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps>,
  ref: Ref<SVGSVGElement>,
) {
  const generatedId = useId();
  const resolvedTitleId = titleId ?? (title ? generatedId : undefined);

  return (
    <svg
      {...(title ? { role: 'img', 'aria-labelledby': resolvedTitleId } : { 'aria-hidden': true })}
      className={className}
      fill="none"
      height={props.size || '36'}
      width={props.size || '36'}
      viewBox={calcViewBox({ x1: 34, y1: 60, x2: 146, y2: 94 }, 4)}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <rect x="58" y="60" width="64" height="30" rx="4" fill="currentColor" />
      <rect x="34" y="86" width="112" height="8" rx="3" fill="currentColor" />
    </svg>
  );
}

const ForwardRef = forwardRef(WholeRestIcon);
export default ForwardRef;

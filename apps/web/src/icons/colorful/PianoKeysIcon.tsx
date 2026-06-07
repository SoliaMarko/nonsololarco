import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

function PianoKeysIcon(
  { title, titleId, ...props }: Partial<SVGProps<SVGSVGElement> & SVGCustomProps>,
  ref: Ref<SVGSVGElement>,
) {
  const generatedId = useId();
  const resolvedTitleId = titleId ?? (title ? generatedId : undefined);

  return (
    <svg
      {...(title ? { role: 'img', 'aria-labelledby': resolvedTitleId } : { 'aria-hidden': true })}
      fill="none"
      height={props.size || '64'}
      width={props.size || '64'}
      viewBox={calcViewBox({ x1: 24, y1: 24, x2: 656, y2: 396 }, 8)}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}

      <defs>
        <clipPath id="bodyClip">
          <rect x="35" y="35" width="610" height="350" rx="26" />
        </clipPath>
      </defs>

      <rect x="24" y="24" width="632" height="372" rx="38" fill="#f1e8d8" />

      <g clipPath="url(#bodyClip)">
        <g stroke="#5a5045" strokeWidth="8" strokeLinecap="round">
          <line x1="114.3" y1="24" x2="114.3" y2="396" />
          <line x1="204.6" y1="24" x2="204.6" y2="396" />
          <line x1="294.9" y1="24" x2="294.9" y2="396" />
          <line x1="385.1" y1="24" x2="385.1" y2="396" />
          <line x1="475.4" y1="24" x2="475.4" y2="396" />
          <line x1="565.7" y1="24" x2="565.7" y2="396" />
        </g>

        <g fill="#14120f">
          <rect x="91.3" y="24" width="46" height="193" rx="12" />
          <rect x="181.6" y="24" width="46" height="193" rx="12" />
          <rect x="362.1" y="24" width="46" height="193" rx="12" />
          <rect x="452.4" y="24" width="46" height="193" rx="12" />
          <rect x="542.7" y="24" width="46" height="193" rx="12" />
        </g>
      </g>

      <rect
        x="24"
        y="24"
        width="632"
        height="372"
        rx="38"
        fill="none"
        stroke="#5a5045"
        strokeWidth="22"
      />
    </svg>
  );
}

const ForwardRef = forwardRef(PianoKeysIcon);
export default ForwardRef;

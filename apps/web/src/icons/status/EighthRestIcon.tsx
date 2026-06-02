import { Ref, SVGProps, forwardRef, useId } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/src/lib/ui/utils/svg.utils';

function EighthRestIcon(
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
      viewBox={calcViewBox({ x1: 77, y1: 113, x2: 163, y2: 250 }, 4)}
      preserveAspectRatio="xMidYMid meet"
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={resolvedTitleId}>{title}</title> : null}
      <path
        d="M 129 124 C 132 131 136 138 144 138 C 151 138 156 131 159 123 C 161 118 163 120 163 126 C 163 134 154 149 142 168 C 128 191 112 218 100 239 C 96 246 89 250 86 245 C 84 241 86 234 90 226 C 101 208 117 184 129 166 C 136 156 141 152 145 152 C 137 160 124 166 108 165 C 90 164 77 152 77 137 C 77 122 90 113 105 113 C 115 113 123 117 129 124 Z"
        fill="currentColor"
      />
    </svg>
  );
}

const ForwardRef = forwardRef(EighthRestIcon);
export default ForwardRef;

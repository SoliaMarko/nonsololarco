import { Ref, SVGProps, forwardRef } from 'react';

import { SVGCustomProps } from '@/lib/types/common.types';
import { calcViewBox } from '@/lib/ui/utils/svg.utils';

type DotsDirection = 'vertical' | 'horizontal';

export interface DotsIconProps extends Partial<SVGProps<SVGSVGElement> & SVGCustomProps> {
  /** Direction of dots. @default 'vertical' */
  direction?: DotsDirection;
}

function DotsIcon(
  { title, titleId, direction = 'vertical', style: styleProp, ...props }: DotsIconProps,
  ref: Ref<SVGSVGElement>,
) {
  const isVertical = direction === 'vertical';

  return (
    <svg
      aria-labelledby={titleId}
      fill="none"
      height={props.size || 24}
      width={props.size || 24}
      viewBox={calcViewBox({ x1: 3, y1: 3, x2: 17, y2: 17 })}
      preserveAspectRatio="xMidYMid meet"
      style={styleProp}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {isVertical ? (
        <>
          <circle cx="10" cy="5" r="1.4" fill="currentColor" />
          <circle cx="10" cy="10" r="1.4" fill="currentColor" />
          <circle cx="10" cy="15" r="1.4" fill="currentColor" />
        </>
      ) : (
        <>
          <circle cx="5" cy="10" r="1.4" fill="currentColor" />
          <circle cx="10" cy="10" r="1.4" fill="currentColor" />
          <circle cx="15" cy="10" r="1.4" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

export default forwardRef<SVGSVGElement, DotsIconProps>(DotsIcon);

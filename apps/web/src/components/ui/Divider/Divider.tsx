'use client';

import { ORIENTATION } from '@/src/lib/constants/common.const';
import { OrientationType } from '@/src/lib/types/common.types';
import { DividerThicknessType, DividerVariantType } from '@/src/lib/types/ui/divider.types';
import { cn } from '@/src/lib/ui/utils/cn';
import {
  LABEL_COLOR_DEFAULT,
  dividerVariants,
  labelColorMap,
  labelSizeMap,
} from '@/src/lib/ui/variants/divider.variants';

export interface IDividerProps {
  className?: string;
  color?: DividerVariantType;
  // works only for horizontal dividers
  label?: string;
  labelClassName?: string;
  orientation?: OrientationType;
  thickness?: DividerThicknessType;
  wrapperClassName?: string;
}

const horizontalThicknessMap: Record<DividerThicknessType, string> = {
  1: 'border-t',
  2: 'border-t-2',
  4: 'border-t-4',
  8: 'border-t-8',
};

const verticalThicknessMap: Record<DividerThicknessType, string> = {
  1: 'border-s',
  2: 'border-s-2',
  4: 'border-s-4',
  8: 'border-s-8',
};

function Divider({
  className,
  color,
  label,
  labelClassName,
  orientation = ORIENTATION.vertical,
  thickness = 4,
  wrapperClassName,
}: IDividerProps) {
  const base = cn(dividerVariants({ color }), 'border-dotted', className);

  if (orientation === ORIENTATION.horizontal && label) {
    return (
      <div
        aria-orientation="horizontal"
        className={cn('flex w-full flex-row items-center gap-1', wrapperClassName)}
        role="separator"
      >
        <hr
          aria-hidden="true"
          className={cn(base, 'mlb-2 flex-1 border-0', horizontalThicknessMap[thickness])}
        />
        <span
          className={cn(
            color ? labelColorMap[color] : labelColorMap[LABEL_COLOR_DEFAULT],
            thickness && labelSizeMap[thickness],
            'shrink-0',
            labelClassName,
          )}
        >
          {label}
        </span>
        <hr
          aria-hidden="true"
          className={cn(base, 'mlb-2 flex-1 border-0', horizontalThicknessMap[thickness])}
        />
      </div>
    );
  }

  if (orientation === ORIENTATION.horizontal) {
    return (
      <hr
        aria-orientation="horizontal"
        className={cn(base, 'mlb-2 border-0', horizontalThicknessMap[thickness])}
        role="separator"
      />
    );
  }

  return (
    <div
      aria-orientation="vertical"
      className={cn('mli-2 flex self-stretch', wrapperClassName)}
      role="separator"
    >
      <div aria-hidden="true" className={cn(base, 'border-0', verticalThicknessMap[thickness])} />
    </div>
  );
}

export default Divider;

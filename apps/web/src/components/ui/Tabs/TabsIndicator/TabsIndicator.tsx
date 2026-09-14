import { cn } from '@/src/utils/cn';

interface IndicatorRect {
  height: number;
  left: number;
  top: number;
  width: number;
}

export interface TabsIndicatorProps {
  /** Whether to animate transitions — false on first render to avoid a slide from 0,0. */
  animate: boolean;
  rect: IndicatorRect;
  variant: 'nav' | 'panel';
}

const UNDERLINE_HEIGHT: Record<string, number> = {
  nav: 2,
  panel: 4,
};

/**
 * Absolutely-positioned sliding indicator rendered inside the Tabs list.
 * Consists of two layers: a semi-transparent background highlight and an
 * accent-coloured underline, both driven by the same `rect`.
 */
export default function TabsIndicator({ animate, rect, variant }: TabsIndicatorProps) {
  const transition = animate
    ? 'transition-[left,width,top,height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]'
    : '';

  const underlineH = UNDERLINE_HEIGHT[variant] ?? 4;

  return (
    <>
      {/* Background highlight */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute z-0 rounded-sm',
          variant === 'panel' ? 'bg-base' : 'bg-elevated/60',
          transition,
        )}
        style={{
          height: rect.height,
          left: rect.left,
          top: rect.top,
          width: rect.width,
        }}
      />

      {/* Accent underline */}
      <div
        aria-hidden="true"
        className={cn('bg-accent-red pointer-events-none absolute z-10', transition)}
        style={{
          height: underlineH,
          left: rect.left,
          top: rect.top + rect.height - underlineH,
          width: rect.width,
        }}
      />
    </>
  );
}

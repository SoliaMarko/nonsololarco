import { CSSProperties, HTMLAttributes } from 'react';

import { VariantProps } from 'class-variance-authority';

import { DELAYS, NOTES, WAVE_HEIGHT } from '@/src/lib/constants/ui/spinner.const';
import { spinnerVariants } from '@/src/lib/variants/spinner.variants';
import { cn } from '@/src/utils/cn';

/**
 * nonsololarco signature loading indicator — 4 musical notes bouncing in a wave.
 *
 * Uses pure CSS animation via `note-wave` keyframes defined in globals.css.
 * Accessible: announces loading state to screen readers via `role="status"`
 * and `aria-live="polite"` — screen reader waits for a pause then reads the label.
 *
 * @example
 * // Default
 * <Spinner />
 *
 * // Inside a button (isLoading)
 * <Spinner size="sm" color="white" />
 *
 * // Page-level loading
 * <Spinner size="lg" label="Loading musicians..." />
 */

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>, VariantProps<typeof spinnerVariants> {
  className?: string;
  label?: string;
}

function Spinner({ className, color, label = 'Loading', size = 'md', ...rest }: SpinnerProps) {
  return (
    <span
      aria-label={label}
      aria-live="polite"
      role="status"
      className={cn(spinnerVariants({ size, color }), className)}
      {...rest}
    >
      {NOTES.map((note, index) => (
        <span
          key={index}
          aria-hidden="true"
          style={
            {
              display: 'inline-block',
              animation: `note-wave 1.2s ease-in-out ${DELAYS[index]} infinite`,
              '--wave-height': WAVE_HEIGHT[size ?? 'md'],
            } as CSSProperties
          }
        >
          {note}
        </span>
      ))}
    </span>
  );
}

export default Spinner;

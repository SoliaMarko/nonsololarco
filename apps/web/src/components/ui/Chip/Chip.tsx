import { ForwardedRef, HTMLAttributes, forwardRef } from 'react';

import { VariantProps } from 'class-variance-authority';

import { CloseSolidIcon } from '@/src/icons/base';
import { chipVariants } from '@/src/lib/variants/chip.variants';
import { cn } from '@/src/utils/cn';

type ChipVariantProps = Omit<VariantProps<typeof chipVariants>, 'isInteractive'>;

/**
 * Interactive tag for instruments, genres, and search filters.
 *
 * Supports three mutually exclusive interaction modes:
 * - `onClick` — the entire chip is clickable (renders as `<button>`)
 * - `onRemove` — chip has a remove button (renders as `<span>` with nested `<button>`)
 * - neither — static display only
 *
 * @example
 * // Static
 * <Chip label="Violin" variant="emerald" />
 *
 * // Clickable (filter)
 * <Chip label="Classical" isSelected onClick={() => toggleFilter('classical')} />
 *
 * // Removable
 * <Chip label="Folk" onRemove={() => removeTag('folk')} />
 */
export interface ChipProps
  extends Omit<HTMLAttributes<HTMLElement>, 'color' | 'onClick'>, ChipVariantProps {
  label: string;
  className?: string;
  disabled?: boolean;
  isSelected?: boolean;
}

type ChipWithClick = { onClick: () => void; onRemove?: never };
type ChipWithRemove = { onRemove: () => void; onClick?: never };
type ChipStatic = { onClick?: never; onRemove?: never };
type ChipInteractiveProps = ChipWithClick | ChipWithRemove | ChipStatic;

type ChipComponentProps = ChipProps & ChipInteractiveProps;

function Chip(
  {
    className,
    disabled = false,
    isSelected = false,
    label,
    onClick,
    onRemove,
    variant,
    ...rest
  }: ChipComponentProps,
  ref: ForwardedRef<HTMLButtonElement | HTMLSpanElement>,
) {
  const isClickable = Boolean(onClick);
  const Tag = isClickable ? 'button' : 'span';

  return (
    <Tag
      className={cn(
        chipVariants({ variant, isSelected, isInteractive: isClickable, disabled }),
        className,
      )}
      disabled={isClickable ? disabled : undefined}
      onClick={onClick}
      ref={ref as ForwardedRef<HTMLButtonElement & HTMLSpanElement>}
      type={isClickable ? 'button' : undefined}
      {...rest}
    >
      <span>{label}</span>

      {onRemove ? (
        <button
          aria-label={`Remove ${label}`}
          className="mis-0.5 rounded-full opacity-60 hover:opacity-100 focus-visible:ring-1 focus-visible:ring-current focus-visible:outline-none"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          type="button"
        >
          <CloseSolidIcon size="10" aria-hidden="true" />
        </button>
      ) : null}
    </Tag>
  );
}

export default forwardRef<HTMLButtonElement | HTMLSpanElement, ChipComponentProps>(Chip);

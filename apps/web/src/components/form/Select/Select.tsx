'use client';

import * as RadixSelect from '@radix-ui/react-select';

import ChevronIcon from '@/src/icons/base/ChevronIcon';
import CloseSolidIcon from '@/src/icons/base/CloseSolidIcon';
import { selectTriggerVariants } from '@/src/lib/variants/select.variants';
import { cn } from '@/src/utils/cn';

import SelectItem from './SelectItem';

export type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

export type SelectGroup = {
  label: string;
  options: SelectOption[];
};

interface SelectBaseProps {
  className?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
  isClearable?: boolean;
  label?: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
  value: string | null;
}

type SelectProps = SelectBaseProps &
  ({ groups?: never; options: SelectOption[] } | { groups: SelectGroup[]; options?: never });

/**
 * Accessible select component built on Radix UI.
 * Supports flat options or grouped options — mutually exclusive via props.
 * Clearable when isClearable is true.
 *
 * @example
 * // Flat options
 * <Select label="Genre" value={value} onChange={setValue} options={[{ label: 'Jazz', value: 'jazz' }]} />
 *
 * // Grouped options
 * <Select label="Instrument" value={value} onChange={setValue} groups={[{ label: 'Strings', options: [...] }]} />
 *
 * // Clearable
 * <Select label="City" value={value} onChange={setValue} options={[...]} isClearable />
 */
function Select({
  className,
  disabled,
  error,
  groups,
  hint,
  isClearable,
  label,
  onChange,
  options,
  placeholder = 'Select...',
  value,
}: SelectProps) {
  const flatOptions: SelectOption[] = options ?? groups.flatMap((group) => group.options);
  const selectedLabel = flatOptions.find((option) => option.value === value)?.label;
  const getTriggerState = () => {
    if (disabled) return 'disabled';
    if (error) return 'error';
    return 'default';
  };
  const triggerState = getTriggerState();

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label ? <label className="text-label text-fg-secondary">{label}</label> : null}

      <div className="relative">
        <RadixSelect.Root
          value={value ?? ''}
          onValueChange={(value) => onChange(value || null)}
          disabled={disabled}
        >
          <RadixSelect.Trigger
            className={selectTriggerVariants({ state: triggerState })}
            aria-label={label}
          >
            <span className={cn('truncate', !selectedLabel && 'text-fg-disabled')}>
              {selectedLabel ?? placeholder}
            </span>
            <RadixSelect.Icon asChild>
              <ChevronIcon
                size={14}
                direction="down"
                aria-hidden="true"
                className="text-fg-disabled shrink-0"
              />
            </RadixSelect.Icon>
          </RadixSelect.Trigger>

          <RadixSelect.Portal>
            <RadixSelect.Content
              position="popper"
              sideOffset={4}
              className={cn(
                'z-50 w-(--radix-select-trigger-width) overflow-hidden',
                'border-edge bg-card rounded-md border shadow-[0_4px_16px_rgba(0,0,0,0.3)]',
                'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              )}
            >
              <RadixSelect.Viewport className="p-1">
                {options
                  ? options.map((option) => <SelectItem key={option.value} option={option} />)
                  : groups.map((group, index) => (
                      <RadixSelect.Group key={group.label}>
                        {index > 0 ? (
                          <RadixSelect.Separator className="border-t-edge mlb-1 border-t border-dotted" />
                        ) : null}
                        <RadixSelect.Label className="pli-3 plb-1 text-label text-fg-disabled tracking-widest uppercase">
                          {group.label}
                        </RadixSelect.Label>
                        {group.options.map((option) => (
                          <SelectItem key={option.value} option={option} />
                        ))}
                      </RadixSelect.Group>
                    ))}
              </RadixSelect.Viewport>
            </RadixSelect.Content>
          </RadixSelect.Portal>
        </RadixSelect.Root>

        {isClearable && value ? (
          <button
            type="button"
            aria-label="Clear selection"
            disabled={disabled}
            className="text-fg-disabled hover:text-danger absolute top-1/2 right-9 -translate-y-1/2 transition-colors disabled:pointer-events-none"
            onClick={() => onChange(null)}
          >
            <CloseSolidIcon size={12} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {error ? <span className="text-label text-danger">{error}</span> : null}
      {!error && hint ? <span className="text-label text-fg-disabled">{hint}</span> : null}
    </div>
  );
}

export default Select;

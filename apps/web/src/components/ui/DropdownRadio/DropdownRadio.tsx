'use client';

import { ReactNode } from 'react';

import * as RadixDropdown from '@radix-ui/react-dropdown-menu';

import { CheckSolidIcon } from '@/src/icons/base';
import { OPTIONS_POSITION } from '@/src/lib/constants/common.const';
import { OptionsPositionType } from '@/src/lib/types/common.types';
import { cn } from '@/src/utils/cn';

export interface DropdownRadioOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface DropdownRadioProps {
  align?: OptionsPositionType;
  className?: string;
  /** Called when the user picks an option */
  onChange: (value: string) => void;
  options: DropdownRadioOption[];
  /** Trigger element — renders as the dropdown toggle */
  trigger: ReactNode;
  /** Currently selected value */
  value: string;
}

/**
 * Single-select dropdown built on Radix DropdownMenu with RadioGroup semantics.
 * Shows a checkmark next to the active option — ideal for sort/view pickers.
 *
 * @example
 * <DropdownRadio
 *   trigger={<button>Sort</button>}
 *   value={sort}
 *   onChange={setSort}
 *   options={[
 *     { label: 'Default', value: 'default' },
 *     { label: 'BPM ↑', value: 'bpm-asc' },
 *   ]}
 * />
 */
function DropdownRadio({
  align = OPTIONS_POSITION.end,
  className,
  onChange,
  options,
  trigger,
  value,
}: DropdownRadioProps) {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          align={align}
          sideOffset={6}
          className={cn(
            'bg-card border-edge z-dropdown w-fit min-w-48 rounded-lg border',
            'shadow-[0_4px_16px_rgba(0,0,0,0.3)]',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            className,
          )}
        >
          <RadixDropdown.RadioGroup value={value} onValueChange={onChange}>
            {options.map((option) => (
              <RadixDropdown.RadioItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={cn(
                  'flex items-center justify-between gap-4 pli-4 plb-3',
                  'text-sm cursor-pointer transition-colors duration-100 outline-none select-none',
                  'text-fg-secondary data-highlighted:text-fg-primary data-highlighted:bg-base',
                  'data-[state=checked]:text-fg-primary data-[state=checked]:font-semibold',
                  'data-disabled:pointer-events-none data-disabled:opacity-40',
                  'first:pbs-4 first:rounded-t-lg last:pbe-4 last:rounded-b-lg',
                  'focus-visible:bg-elevated',
                )}
              >
                <span>{option.label}</span>
                <RadixDropdown.ItemIndicator>
                  <CheckSolidIcon size={16} className="text-emerald-main" />
                </RadixDropdown.ItemIndicator>
              </RadixDropdown.RadioItem>
            ))}
          </RadixDropdown.RadioGroup>
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}

export default DropdownRadio;

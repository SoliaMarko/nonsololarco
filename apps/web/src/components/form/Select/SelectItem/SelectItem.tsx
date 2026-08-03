'use client';

import * as RadixSelect from '@radix-ui/react-select';

import { cn } from '@/src/utils/cn';

import { SelectOption } from '../Select';

function SelectItem({ option }: { option: SelectOption }) {
  return (
    <RadixSelect.Item
      value={option.value}
      disabled={option.disabled}
      className={cn(
        'pli-3 plb-2 text-caption text-fg-secondary relative flex cursor-pointer items-center rounded-sm',
        'transition-colors duration-100 outline-none select-none',
        'data-highlighted:bg-base data-highlighted:text-fg-primary',
        'data-[state=checked]:text-emerald-main data-[state=checked]:bg-emerald-subtle',
        'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-40',
        'focus-visible:bg-elevated',
      )}
    >
      <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}

export default SelectItem;

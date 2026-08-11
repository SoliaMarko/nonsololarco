'use client';

import * as RadixDropdown from '@radix-ui/react-dropdown-menu';

import { CheckSolidIcon } from '@/src/icons/base';
import { cn } from '@/src/utils/cn';

type SigDropdownVariant = 'dark' | 'light';

interface SigDropdownProps {
  ariaLabel: string;
  onSelect: (value: number) => void;
  options: readonly number[];
  value: number;
  variant: SigDropdownVariant;
}

const TRIGGER_VARIANT = {
  dark: 'border-2 border-primary-light/30 bg-primary-light/5 text-primary-light hover:bg-primary-light/[.12]',
  light: 'border border-edge bg-elevated text-fg-primary hover:bg-surface',
} as const;

const ITEM_VARIANT = {
  dark: 'text-primary-light/60 data-highlighted:text-primary-light data-highlighted:bg-primary-light/10',
  light: 'text-fg-secondary data-highlighted:text-fg-primary data-highlighted:bg-base',
} as const;

/**
 * Compact numeric picker for one half of a time signature.
 *
 * Uses Radix DropdownMenu directly rather than the DS `Dropdown`, because
 * the DS component targets text menus with generous padding and a 10rem
 * min-width — far too bulky for a 1–2 digit number. This keeps portalling,
 * outside-click, Escape and arrow-key navigation while trimming the chrome
 * to fit the toolbar.
 */
export default function SigDropdown({
  ariaLabel,
  onSelect,
  options,
  value,
  variant,
}: SigDropdownProps) {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>
        <button
          aria-label={ariaLabel}
          className={cn(
            'font-label flex h-8.5 w-11.5 shrink-0 cursor-pointer items-center justify-center gap-1',
            'text-sm leading-none font-bold outline-none',
            'transition-[background-color,border-color] duration-100',
            TRIGGER_VARIANT[variant],
          )}
          type="button"
        >
          {value}
          <svg aria-hidden="true" fill="none" height="6" viewBox="0 0 10 6" width="10">
            <path
              d="M1 1l4 4 4-4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.5"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          align="start"
          sideOffset={4}
          className={cn(
            'bg-card border-edge z-dropdown min-w-11.5 border',
            'shadow-[0_4px_12px_rgba(0,0,0,0.25)]',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          )}
        >
          {options.map((opt) => (
            <RadixDropdown.Item
              key={opt}
              className={cn(
                'font-label flex cursor-pointer items-center justify-between gap-2 px-2.5 py-1.5 text-sm outline-none select-none',
                'transition-colors duration-75',
                ITEM_VARIANT[variant],
                opt === value && 'font-semibold',
              )}
              onSelect={() => onSelect(opt)}
            >
              {opt}
              {opt === value && (
                <CheckSolidIcon
                  size={13}
                  className="text-emerald-main shrink-0"
                  aria-hidden="true"
                />
              )}
            </RadixDropdown.Item>
          ))}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}

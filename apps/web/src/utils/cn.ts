import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names, resolving Tailwind conflicts in favour of the last value.
 *
 * `clsx` flattens the arguments and drops falsy ones, so conditionals can be
 * passed inline; `tailwind-merge` then removes earlier classes that the later
 * ones override — `cn('pli-2', 'pli-4')` yields `'pli-4'` rather than both.
 *
 * Put an incoming `className` prop last so callers can always override a
 * component's own styling.
 *
 * @example
 * cn('border-2', isActive && 'border-accent-red', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

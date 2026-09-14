'use client';

import { cva } from 'class-variance-authority';

import Text from '@/src/components/typography/Text';
import Button from '@/src/components/ui/Button';
import { NotesIcon } from '@/src/icons/base';
import { cn } from '@/src/utils/cn';

/** Mirrors the `Button` size scale (`xs | sm | md | lg | xl`). */
type AiButtonSize = 'md' | 'sm';

interface AiButtonProps {
  className?: string;
  /**
   * `"sm"` mirrors the `LocaleSwitcher` trigger — 2px border, tighter padding,
   * 14px icon — for the mobile header, where the two buttons sit side by side
   * and read as a mismatched pair at the default size.
   *
   * `"md"` is the standard action-button size and must stay the default: on
   * desktop this button sits next to `AddTrackButton`, which uses it.
   */
  size?: AiButtonSize;
  textClassName?: string;
}

/**
 * Size-variant overrides for the underlying `Button`.
 *
 * The `sm` overrides align the button with the `LocaleSwitcher` trigger it
 * sits beside in the mobile header — matching geometry and a theme-aware
 * `fg-secondary` border/shadow instead of the variant's fixed `primary-dark`,
 * which disappears against a dark background. The hover/active overrides cancel
 * the variant's press animation, since the switcher next to it is static.
 */
const aiButtonVariants = cva('bg-accent-dark-green', {
  variants: {
    size: {
      md: '',
      sm: cn(
        'pli-[9px] plb-[5px] min-h-0 border-2',
        'border-fg-primary shadow-[2px_2px_0_0_var(--color-fg-primary)]',
        'hover:translate-x-0 hover:translate-y-0 hover:shadow-[2px_2px_0_0_var(--color-fg-primary)]',
        'active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_var(--color-fg-primary)]',
      ),
    },
  },
  defaultVariants: { size: 'md' },
});

const ICON_SIZE: Record<AiButtonSize, number> = {
  md: 16,
  sm: 14,
};

/**
 * Stroke is bumped at `sm` so the glyph carries the same visual weight as the
 * bold label beside it — matching the icon's `size` alone would leave it
 * looking thin next to bold text.
 */
const ICON_STROKE: Record<AiButtonSize, string> = {
  md: '1.8',
  sm: '2.4',
};

const TEXT_CLASS: Record<AiButtonSize, string> = {
  md: 'text-sm sm:text-[0.8rem]',
  sm: 'text-xs',
};

const TEXT_WEIGHT: Record<AiButtonSize, 'bold' | 'medium'> = {
  md: 'medium',
  sm: 'bold',
};

/**
 * Retro-press AI shortcut button. Available in `"md"` (desktop default,
 * paired with `AddTrackButton`) and `"sm"` (mobile header, paired with
 * `LocaleSwitcher`).
 */
export default function AiButton({ className, size = 'md', textClassName }: AiButtonProps) {
  return (
    <Button className={cn(aiButtonVariants({ size }), className)} variant="retro-primary">
      <div className={cn('text-primary-light flex flex-row items-center gap-2', textClassName)}>
        <NotesIcon size={ICON_SIZE[size]} strokeWidth={ICON_STROKE[size]} />
        <Text className={cn('text-inherit uppercase', TEXT_CLASS[size])} weight={TEXT_WEIGHT[size]}>
          AI
        </Text>
      </div>
    </Button>
  );
}

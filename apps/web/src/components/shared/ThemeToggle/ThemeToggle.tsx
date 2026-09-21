'use client';

import { AnimationEvent, useEffect, useState } from 'react';

import { useTheme } from '@/src/hooks/global/useTheme';
import CeilingLamp from '@/src/illustrations/lamp/CeilingLamp';
import { THEME } from '@/src/lib/constants/common.const';
import { cn } from '@/src/utils/cn';

export interface ThemeToggleProps {
  className?: string;
  /** Rendered lamp height in px. The default is tuned to the 56px header. */
  height?: number;
}

/**
 * Lamp height in px.
 *
 * The shade sits at 62% of this, so 66 keeps it inside the 56px header row
 * and leaves the knob hanging about 10px past the border — enough for the
 * cord to read as a cord, little enough that it does not sit on the content
 * underneath. Changing this moves both ends at once.
 */
const LAMP_HEIGHT = 66;

const ARIA_LABEL = {
  toDark: 'Switch to dark theme',
  toLight: 'Switch to light theme',
} as const;

/**
 * Theme switch, drawn as a pull-cord ceiling lamp: lit in light mode, dark
 * in dark mode, and yanked by the rope to change.
 *
 * The button box is deliberately smaller than the illustration. It covers
 * the lamp's footprint inside the header, while the rope and knob that hang
 * below the header border stay clickable through the SVG's own painted
 * geometry — `pointer-events-none` on the svg with `pointer-events-auto` on
 * the drawing means the empty space around the rope falls through to the
 * page instead of swallowing clicks on whatever sits under the header.
 *
 * The lamp is not told which state to show. It reads `data-theme` in CSS, so
 * it is already correct in the first painted frame — including after a client
 * navigation, where a React-state answer would render the dark lamp and snap
 * to the lit one. `mounted` remains only for the label, whose one-tick delay
 * nobody can see; it exists because `useTheme` reads localStorage on the
 * client's first render and the server has no way to know the answer.
 *
 * The tug resets on `animationend` rather than a timer: the pull and the
 * sway are the same length, so either one firing is a safe moment to clear
 * the state, and removing the class is what lets the next click replay it.
 *
 * @example
 * <ThemeToggle className="self-start" />
 */
export default function ThemeToggle({ className, height = LAMP_HEIGHT }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = mounted && theme === THEME.light;

  const handleClick = () => {
    setIsPulling(true);
    toggleTheme();
  };

  const handleAnimationEnd = (event: AnimationEvent<HTMLButtonElement>) => {
    if (!event.animationName.startsWith('lamp-')) return;

    setIsPulling(false);
  };

  return (
    <button
      aria-label={isLight ? ARIA_LABEL.toDark : ARIA_LABEL.toLight}
      className={cn(
        // The cord hangs past whatever holds the toggle, over the content
        // below it. z-20 clears page content (which tops out at z-10) and
        // stays under every overlay — bottom nav 40, FAB 45, popovers 50+ —
        // so the cord is never hidden and never floats over a menu. Inside
        // the sticky header this is local to the header's own stack.
        'relative z-20 h-14 w-10 shrink-0 cursor-pointer',
        'focus-visible:ring-yellow-main rounded-sm focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      onAnimationEnd={handleAnimationEnd}
      onClick={handleClick}
      type="button"
    >
      <CeilingLamp
        className="block-start-0 absolute inset-s-0"
        height={height}
        isPulling={isPulling}
      />
    </button>
  );
}

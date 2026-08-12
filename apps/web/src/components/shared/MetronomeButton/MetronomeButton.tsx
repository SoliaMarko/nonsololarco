'use client';

import Link from 'next/link';

import { VariantProps } from 'class-variance-authority';

import VintageMetronome from '@/src/illustrations/metronome/VintageMetronome';
import { metronomeButtonVariants } from '@/src/lib/variants/metronome-button.variants';
import { cn } from '@/src/utils/cn';

type MetronomeButtonVariantProps = VariantProps<typeof metronomeButtonVariants>;

export interface MetronomeButtonProps extends MetronomeButtonVariantProps {
  className?: string;
}

/** Illustration height per variant, in px. Tuned to leave optical padding
 *  inside the button rather than filling it edge to edge. */
const ILLUSTRATION_HEIGHT = {
  fab: 40,
  header: 30,
} as const;

/**
 * Entry point to the metronome, rendered as the vintage metronome
 * illustration inside a link.
 *
 * Two placements, one component: `header` for the desktop header row, `fab`
 * for the mobile thumb zone. The caller decides which is visible at which
 * breakpoint — this component does not query the viewport itself, so it
 * stays testable and usable in Storybook.
 *
 * The illustration is decorative (`aria-hidden`); the accessible name lives
 * on the link, where a screen reader expects it.
 *
 * @example
 * // Desktop header — hidden below md by the caller
 * <MetronomeButton className="hidden md:inline-flex" />
 *
 * // Mobile FAB, positioned by its wrapper
 * <MetronomeButton variant="fab" />
 */
export default function MetronomeButton({
  className,
  variant = 'header',
}: MetronomeButtonProps) {
  const resolvedVariant = variant ?? 'header';

  return (
    <Link
      aria-label="Metronome"
      className={cn(metronomeButtonVariants({ variant }), className)}
      href="/metronome"
    >
      <VintageMetronome height={ILLUSTRATION_HEIGHT[resolvedVariant]} variant="compact" />
    </Link>
  );
}

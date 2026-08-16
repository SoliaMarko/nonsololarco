import { cva } from 'class-variance-authority';

import { cn } from '@/src/utils/cn';

interface FilterPillProps {
  activeStyle: string;
  isActive: boolean;
  label: string;
  onClick: () => void;
  count?: number;
}

/**
 * Width is reserved rather than left to the label, because the label is
 * translated: "All" (3 chars) becomes "Tutti" (5), "Learning" (8) becomes
 * "In studio" (9). Sizing to content made every pill — and the whole filter
 * row — a different width in each language.
 *
 * Two reservations, because a pill carrying a count needs the extra room:
 * without it the count would push the pill wider again and defeat the point.
 */
const filterPillVariants = cva(
  'plb-1.5 pli-3 shrink-0 border-2 text-xs font-bold tracking-wider whitespace-nowrap uppercase transition-colors',
  {
    variants: {
      layout: {
        withCount: 'min-w-30',
        plain: 'min-w-24',
      },
    },
    defaultVariants: { layout: 'plain' },
  },
);

/**
 * Stamp-style toggle pill used in the repertoire filter bar.
 *
 * Renders a fixed-minimum-width button to keep the row stable across
 * locales. When `count` is provided an extra `min-w-30` reservation
 * prevents the badge from overflowing the pill.
 */
export default function FilterPill({
  activeStyle,
  count,
  isActive,
  label,
  onClick,
}: FilterPillProps) {
  const hasCount = count !== undefined;
  const layout = hasCount ? 'withCount' : 'plain';

  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        filterPillVariants({ layout }),
        isActive
          ? activeStyle
          : 'border-border-primary text-fg-tertiary hover:text-fg-secondary hover:border-fg-tertiary',
      )}
    >
      {label}
      {count !== undefined ? (
        <span className="mis-1.5 text-[10px] tabular-nums">{count}</span>
      ) : null}
    </button>
  );
}

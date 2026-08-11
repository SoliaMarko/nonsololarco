import { cn } from '@/src/utils/cn';

interface FilterPillProps {
  activeStyle: string;
  count?: number;
  isActive: boolean;
  label: string;
  onClick: () => void;
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
const MIN_WIDTH_WITH_COUNT = 'min-w-30';
const MIN_WIDTH_PLAIN = 'min-w-24';

export default function FilterPill({
  activeStyle,
  count,
  isActive,
  label,
  onClick,
}: FilterPillProps) {
  const hasCount = count !== undefined;

  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'plb-1.5 pli-3 shrink-0 border-2 text-xs font-bold tracking-wider whitespace-nowrap uppercase transition-colors',
        hasCount ? MIN_WIDTH_WITH_COUNT : MIN_WIDTH_PLAIN,
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

import { cn } from '@/src/utils/cn';

interface FilterPillProps {
  activeStyle: string;
  count?: number;
  isActive: boolean;
  label: string;
  onClick: () => void;
}

export default function FilterPill({
  activeStyle,
  count,
  isActive,
  label,
  onClick,
}: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'plb-1.5 pli-3 shrink-0 border-2 text-xs font-bold tracking-wider uppercase transition-colors',
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

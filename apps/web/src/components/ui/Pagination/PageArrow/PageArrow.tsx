import { ChevronIcon } from '@/src/icons/base';
import { paginationItemVariants } from '@/src/lib/variants/pagination.variants';

interface PageArrowProps {
  direction: 'prev' | 'next';
  isDisabled: boolean;
  onClick: () => void;
}

/** Previous / Next arrow button for the pagination bar. */
export default function PageArrow({ direction, isDisabled, onClick }: PageArrowProps) {
  const label = direction === 'prev' ? 'Previous page' : 'Next page';
  const chevronDir = direction === 'prev' ? 'left' : 'right';

  return (
    <button
      aria-label={label}
      className={paginationItemVariants({ isDisabled })}
      disabled={isDisabled}
      onClick={onClick}
      type="button"
    >
      <ChevronIcon direction={chevronDir} size={14} strokeWidth="2" aria-hidden="true" />
    </button>
  );
}

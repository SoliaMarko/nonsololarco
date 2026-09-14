import { paginationItemVariants } from '@/src/lib/variants/pagination.variants';

interface PageButtonProps {
  isActive: boolean;
  onClick: () => void;
  page: number;
}

/** A single page-number button inside the pagination bar. */
export default function PageButton({ isActive, onClick, page }: PageButtonProps) {
  return (
    <button
      aria-current={isActive ? 'page' : undefined}
      aria-label={`Go to page ${page}`}
      className={paginationItemVariants({ isActive })}
      onClick={onClick}
      type="button"
    >
      {page}
    </button>
  );
}

import { getPaginationRange } from '@/src/utils/pagination.utils';

import PageArrow from './PageArrow';
import PageButton from './PageButton';

export interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  totalPages: number;
}

/**
 * Retro-styled pagination nav with page numbers, ellipsis collapsing and
 * prev/next arrows.
 *
 * Renders `null` when `totalPages <= 1` — a single-page result needs no
 * pagination controls.
 */
export default function Pagination({
  currentPage,
  onPageChange,
  siblingCount = 1,
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const range = getPaginationRange(currentPage, totalPages, siblingCount);

  return (
    <nav
      aria-label="Pagination"
      className="xs:justify-end plb-4 pli-5 flex items-center justify-center gap-1.5"
    >
      <PageArrow
        direction="prev"
        isDisabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {range.map((item, i) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${i}`}
            className="text-fg-tertiary inline-flex min-h-8 min-w-8 items-center justify-center text-sm"
            aria-hidden="true"
          >
            &hellip;
          </span>
        ) : (
          <PageButton
            key={item}
            isActive={item === currentPage}
            onClick={() => onPageChange(item)}
            page={item}
          />
        ),
      )}

      <PageArrow
        direction="next"
        isDisabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </nav>
  );
}

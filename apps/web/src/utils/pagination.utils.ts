/**
 * A single slot in a pagination control — either a 1-based page number or an
 * `'ellipsis'` placeholder representing a gap between visible page buttons.
 */
export type PaginationItem = number | 'ellipsis';

/**
 * Builds a compact page-number range with ellipsis markers for a pagination
 * control.
 *
 * Always includes the first and last page. Pages around `currentPage` are kept
 * visible (controlled by `siblingCount`), and gaps wider than one slot are
 * collapsed to a single `'ellipsis'` marker.
 *
 * Returns `[]` when `totalPages` is 0 or negative, and clamps `currentPage`
 * into `[1, totalPages]`.
 *
 * @example
 * getPaginationRange(5, 10)  // [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
 * getPaginationRange(1, 5)   // [1, 2, 3, 4, 5]
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  if (totalPages <= 0) return [];

  const clamped = Math.max(1, Math.min(currentPage, totalPages));

  // If total pages fit within the sibling window, show all pages
  const maxVisible = siblingCount * 2 + 3; // siblings + first + last + current
  if (totalPages <= maxVisible + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const rangeStart = Math.max(2, clamped - siblingCount);
  const rangeEnd = Math.min(totalPages - 1, clamped + siblingCount);

  const items: PaginationItem[] = [1];

  if (rangeStart > 3) {
    items.push('ellipsis');
  } else if (rangeStart === 3) {
    items.push(2);
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
    items.push(i);
  }

  if (rangeEnd < totalPages - 2) {
    items.push('ellipsis');
  } else if (rangeEnd === totalPages - 2) {
    items.push(totalPages - 1);
  }

  if (totalPages > 1) {
    items.push(totalPages);
  }

  return items;
}

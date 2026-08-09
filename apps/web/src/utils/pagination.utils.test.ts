import { describe, expect, it } from 'vitest';

import { getPaginationRange } from './pagination.utils';

describe('getPaginationRange', () => {
  it('returns empty array for zero pages', () => {
    expect(getPaginationRange(1, 0)).toEqual([]);
  });

  it('returns [1] for a single page', () => {
    expect(getPaginationRange(1, 1)).toEqual([1]);
  });

  it('returns all pages when total fits without ellipsis', () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('collapses left side with ellipsis', () => {
    expect(getPaginationRange(8, 10)).toEqual([1, 'ellipsis', 7, 8, 9, 10]);
  });

  it('collapses right side with ellipsis', () => {
    expect(getPaginationRange(2, 10)).toEqual([1, 2, 3, 'ellipsis', 10]);
  });

  it('collapses both sides with ellipsis', () => {
    expect(getPaginationRange(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  });

  it('respects wider siblingCount', () => {
    expect(getPaginationRange(5, 10, 2)).toEqual([1, 2, 3, 4, 5, 6, 7, 'ellipsis', 10]);
  });

  it('clamps out-of-range currentPage', () => {
    expect(getPaginationRange(99, 5)).toEqual([1, 'ellipsis', 4, 5]);
  });
});

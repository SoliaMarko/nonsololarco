/**
 * Generic envelope returned by any paginated list endpoint.
 *
 * When pagination is opt-in and the caller omits `page`, the endpoint returns
 * the full result set as a single page (`page: 1`, `totalPages: 1`,
 * `pageSize: total`).
 *
 * TODO: evaluate switching to cursor-based pagination once repertoire sizes
 * grow large enough for offset skip cost to matter.
 */
export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

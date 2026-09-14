/**
 * Values accepted by the `sort` query param.
 *
 * Mirrors `TrackSortField` in the API's `RepertoireQueryDto` — the backend
 * validates against its own enum, so adding a field here without adding it
 * there produces a 400 at runtime rather than a type error.
 *
 * `trackOrder` is only meaningful when a specific band is selected; under
 * "All Repertoires" the numbers are display indices across several bands.
 */
export type SortField = 'bpm' | 'status' | 'time' | 'title' | 'trackOrder';

/** Direction for the `order` query param. Defaults to `asc` when absent. */
export type SortOrder = 'asc' | 'desc';

/**
 * Values accepted by the `status` query param.
 *
 * Mirrors `TrackFilterField` in the API's `RepertoireQueryDto`. `'all'` and
 * `'active'` are not track statuses: `'all'` is the no-filter default and is
 * omitted from the URL rather than sent, and `'active'` means every status
 * except `archived`.
 */
export type TrackFilterParam = 'all' | 'ready' | 'learning' | 'new' | 'active' | 'archived';

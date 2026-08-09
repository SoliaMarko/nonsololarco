import { Track } from '@nonsololarco/types';

import { SortField, SortOrder, TrackFilterParam } from '@/src/utils/tracks-sort.utils';

import { apiFetch } from './client';

export interface RepertoireQueryParams {
  onlyMine?: boolean;
  order?: SortOrder;
  sort?: SortField;
  status?: TrackFilterParam;
}

/** Serialises sort/filter params into a URL query string. Omits defaults (`status=all`) to keep URLs clean. */
function buildQueryString(params: RepertoireQueryParams): string {
  const search = new URLSearchParams();
  if (params.sort) search.set('sort', params.sort);
  if (params.order) search.set('order', params.order);
  if (params.status && params.status !== 'all') search.set('status', params.status);
  if (params.onlyMine) search.set('onlyMine', 'true');
  const str = search.toString();
  return str ? `?${str}` : '';
}

/** Fetches all tracks where the current user is lead or performer, across all bands. */
export async function fetchMyRepertoire(params: RepertoireQueryParams = {}): Promise<Track[]> {
  return apiFetch<Track[]>(`/users/me/repertoire${buildQueryString(params)}`);
}

/** Fetches the current user's solo tracks (no band). */
export async function fetchSoloRepertoire(params: RepertoireQueryParams = {}): Promise<Track[]> {
  return apiFetch<Track[]>(`/users/me/repertoire/solo${buildQueryString(params)}`);
}

/** Fetches all tracks for a specific band. Supports `onlyMine` to restrict to the user's tracks. */
export async function fetchBandRepertoire(
  bandId: string,
  params: RepertoireQueryParams = {},
): Promise<Track[]> {
  return apiFetch<Track[]>(`/bands/${bandId}/repertoire${buildQueryString(params)}`);
}

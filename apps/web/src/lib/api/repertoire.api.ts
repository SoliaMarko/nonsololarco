import { Track } from '@nonsololarco/types';

import { SortField, SortOrder, TrackFilterParam } from '@/src/utils/tracks-sort.utils';

import { apiFetch } from './client';

export interface RepertoireQueryParams {
  onlyMine?: boolean;
  order?: SortOrder;
  sort?: SortField;
  status?: TrackFilterParam;
}

function buildQueryString(params: RepertoireQueryParams): string {
  const search = new URLSearchParams();
  if (params.sort) search.set('sort', params.sort);
  if (params.order) search.set('order', params.order);
  if (params.status && params.status !== 'all') search.set('status', params.status);
  if (params.onlyMine) search.set('onlyMine', 'true');
  const str = search.toString();
  return str ? `?${str}` : '';
}

export async function fetchMyRepertoire(params: RepertoireQueryParams = {}): Promise<Track[]> {
  return apiFetch<Track[]>(`/users/me/repertoire${buildQueryString(params)}`);
}

export async function fetchSoloRepertoire(params: RepertoireQueryParams = {}): Promise<Track[]> {
  return apiFetch<Track[]>(`/users/me/repertoire/solo${buildQueryString(params)}`);
}

export async function fetchBandRepertoire(
  bandId: string,
  params: RepertoireQueryParams = {},
): Promise<Track[]> {
  return apiFetch<Track[]>(`/bands/${bandId}/repertoire${buildQueryString(params)}`);
}

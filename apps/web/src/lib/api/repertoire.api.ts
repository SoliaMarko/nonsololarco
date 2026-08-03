import { Track } from '@nonsololarco/types';

import { SortField, SortOrder } from '@/src/utils/tracks-sort.utils';

import { apiFetch } from './client';

function buildSortParams(sort?: SortField, order?: SortOrder): string {
  if (!sort) return '';
  const params = new URLSearchParams({ sort, order: order ?? 'asc' });
  return `?${params.toString()}`;
}

export async function fetchMyRepertoire(sort?: SortField, order?: SortOrder): Promise<Track[]> {
  return apiFetch<Track[]>(`/users/me/repertoire${buildSortParams(sort, order)}`);
}

export async function fetchSoloRepertoire(sort?: SortField, order?: SortOrder): Promise<Track[]> {
  return apiFetch<Track[]>(`/users/me/repertoire/solo${buildSortParams(sort, order)}`);
}

export async function fetchBandRepertoire(
  bandId: string,
  sort?: SortField,
  order?: SortOrder,
): Promise<Track[]> {
  return apiFetch<Track[]>(`/bands/${bandId}/repertoire${buildSortParams(sort, order)}`);
}

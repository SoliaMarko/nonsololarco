import { Track } from '@nonsololarco/types';

import { apiFetch } from './client';

export async function fetchMyRepertoire(): Promise<Track[]> {
  return apiFetch<Track[]>('/users/me/repertoire');
}

export async function fetchSoloRepertoire(): Promise<Track[]> {
  return apiFetch<Track[]>('/users/me/repertoire/solo');
}

export async function fetchBandRepertoire(bandId: string): Promise<Track[]> {
  return apiFetch<Track[]>(`/bands/${bandId}/repertoire`);
}

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { SortField, SortOrder, TrackFilterParam } from '@/src/utils/tracks-sort.utils';

import {
  fetchBandRepertoire,
  fetchMyRepertoire,
  fetchSoloRepertoire,
  RepertoireQueryParams,
} from '../api/repertoire.api';

import { ALL_BANDS_ID, SOLO_BAND_ID } from '../constants/repertoire.const';

export { ALL_BANDS_ID, SOLO_BAND_ID };

export interface UseRepertoireTracksOptions {
  onlyMine?: boolean;
  order?: SortOrder;
  sort?: SortField;
  status?: TrackFilterParam;
}

/**
 * Fetches repertoire tracks based on context:
 * - Empty string → all user tracks (where user is lead)
 * - 'solo'       → solo tracks only (no band)
 * - Other string → tracks for that specific band
 *
 * Sort and filter params are forwarded to the backend so ordering and
 * filtering are server-side (ready for future pagination).
 */
export function useRepertoireTracks(bandId: string, options: UseRepertoireTracksOptions = {}) {
  const { sort, order, status, onlyMine } = options;
  const isSolo = bandId === SOLO_BAND_ID;
  const isBandSelected = Boolean(bandId) && !isSolo;

  const params: RepertoireQueryParams = { sort, order, status, onlyMine };

  const mode = isSolo ? 'solo' : isBandSelected ? 'band' : 'me';
  const queryKey = mode === 'band'
    ? ['repertoire', mode, bandId, sort, order, status, onlyMine]
    : ['repertoire', mode, sort, order, status, onlyMine];

  function queryFn() {
    if (mode === 'solo') return fetchSoloRepertoire(params);
    if (mode === 'band') return fetchBandRepertoire(bandId, params);
    return fetchMyRepertoire(params);
  }

  return useQuery({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData,
  });
}

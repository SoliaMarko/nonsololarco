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

  return useQuery({
    queryKey: isSolo
      ? ['repertoire', 'solo', sort, order, status, onlyMine]
      : isBandSelected
        ? ['repertoire', 'band', bandId, sort, order, status, onlyMine]
        : ['repertoire', 'me', sort, order, status, onlyMine],
    queryFn: () =>
      isSolo
        ? fetchSoloRepertoire(params)
        : isBandSelected
          ? fetchBandRepertoire(bandId, params)
          : fetchMyRepertoire(params),
    placeholderData: keepPreviousData,
  });
}

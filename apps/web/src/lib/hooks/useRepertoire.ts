import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { SortField, SortOrder } from '@/src/utils/tracks-sort.utils';

import {
  fetchBandRepertoire,
  fetchMyRepertoire,
  fetchSoloRepertoire,
} from '../api/repertoire.api';

import { ALL_BANDS_ID, SOLO_BAND_ID } from '../constants/repertoire.const';

export { ALL_BANDS_ID, SOLO_BAND_ID };

/**
 * Fetches repertoire tracks based on context:
 * - Empty string → all user tracks (where user is lead)
 * - 'solo'       → solo tracks only (no band)
 * - Other string → tracks for that specific band
 *
 * Sort params are forwarded to the backend so ordering is server-side
 * (ready for future pagination).
 */
export function useRepertoireTracks(bandId: string, sort?: SortField, order?: SortOrder) {
  const isSolo = bandId === SOLO_BAND_ID;
  const isBandSelected = Boolean(bandId) && !isSolo;

  return useQuery({
    queryKey: isSolo
      ? ['repertoire', 'solo', sort, order]
      : isBandSelected
        ? ['repertoire', 'band', bandId, sort, order]
        : ['repertoire', 'me', sort, order],
    queryFn: () =>
      isSolo
        ? fetchSoloRepertoire(sort, order)
        : isBandSelected
          ? fetchBandRepertoire(bandId, sort, order)
          : fetchMyRepertoire(sort, order),
    placeholderData: keepPreviousData,
  });
}

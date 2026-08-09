import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { SortField, SortOrder, TrackFilterParam } from '@/src/utils/tracks-sort.utils';

import {
  RepertoireQueryParams,
  fetchBandRepertoire,
  fetchMyRepertoire,
  fetchSoloRepertoire,
} from '../api/repertoire.api';
import { ALL_BANDS_ID, SOLO_BAND_ID } from '../constants/repertoire.const';

export { ALL_BANDS_ID, SOLO_BAND_ID };

export interface UseRepertoireTracksOptions {
  onlyMine?: boolean;
  order?: SortOrder;
  page?: number;
  pageSize?: number;
  sort?: SortField;
  status?: TrackFilterParam;
}

/**
 * Fetches repertoire tracks based on context:
 * - Empty string → all user tracks (where user is lead)
 * - 'solo'       → solo tracks only (no band)
 * - Other string → tracks for that specific band
 *
 * Sort, filter and pagination params are forwarded to the backend.
 */
export function useRepertoireTracks(bandId: string, options: UseRepertoireTracksOptions = {}) {
  const { sort, order, status, onlyMine, page, pageSize } = options;
  const isSolo = bandId === SOLO_BAND_ID;
  const isBandSelected = Boolean(bandId) && !isSolo;

  const params: RepertoireQueryParams = { sort, order, status, onlyMine, page, pageSize };

  return useQuery({
    queryKey: isSolo
      ? ['repertoire', 'solo', sort, order, status, onlyMine, page, pageSize]
      : isBandSelected
        ? ['repertoire', 'band', bandId, sort, order, status, onlyMine, page, pageSize]
        : ['repertoire', 'me', sort, order, status, onlyMine, page, pageSize],
    queryFn: () =>
      isSolo
        ? fetchSoloRepertoire(params)
        : isBandSelected
          ? fetchBandRepertoire(bandId, params)
          : fetchMyRepertoire(params),
    placeholderData: keepPreviousData,
  });
}

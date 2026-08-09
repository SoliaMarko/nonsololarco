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

  const scope = isSolo ? 'solo' : isBandSelected ? 'band' : 'me';
  const scopeKey = scope === 'band' ? ['repertoire', scope, bandId] : ['repertoire', scope];

  return useQuery({
    queryKey: [...scopeKey, params],
    queryFn: () => {
      if (scope === 'solo') return fetchSoloRepertoire(params);
      if (scope === 'band') return fetchBandRepertoire(bandId, params);
      return fetchMyRepertoire(params);
    },
    placeholderData: keepPreviousData,
  });
}

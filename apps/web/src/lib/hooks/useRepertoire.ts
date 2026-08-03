import { useQuery } from '@tanstack/react-query';

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
 */
export function useRepertoireTracks(bandId: string) {
  const isSolo = bandId === SOLO_BAND_ID;
  const isBandSelected = Boolean(bandId) && !isSolo;

  return useQuery({
    queryKey: isSolo
      ? ['repertoire', 'solo']
      : isBandSelected
        ? ['repertoire', 'band', bandId]
        : ['repertoire', 'me'],
    queryFn: () =>
      isSolo
        ? fetchSoloRepertoire()
        : isBandSelected
          ? fetchBandRepertoire(bandId)
          : fetchMyRepertoire(),
  });
}

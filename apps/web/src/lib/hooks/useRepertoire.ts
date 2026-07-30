import { useQuery } from '@tanstack/react-query';

import { fetchBandRepertoire, fetchMyRepertoire } from '../api/repertoire.api';

/**
 * Fetches repertoire tracks based on context:
 * - No bandId (or empty string) → fetches all user tracks
 * - With bandId → fetches tracks for that specific band
 */
export function useRepertoireTracks(bandId: string) {
  const isBandSelected = Boolean(bandId);

  return useQuery({
    queryKey: isBandSelected ? ['repertoire', 'band', bandId] : ['repertoire', 'me'],
    queryFn: () => (isBandSelected ? fetchBandRepertoire(bandId) : fetchMyRepertoire()),
  });
}

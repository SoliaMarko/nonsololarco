import { useQuery } from '@tanstack/react-query';

import { fetchBandRepertoire, fetchMyRepertoire } from '../api/repertoire.api';

export function useMyRepertoire() {
  return useQuery({
    queryKey: ['repertoire', 'me'],
    queryFn: fetchMyRepertoire,
  });
}

export function useBandRepertoire(bandId: string) {
  return useQuery({
    queryKey: ['repertoire', 'band', bandId],
    queryFn: () => fetchBandRepertoire(bandId),
  });
}

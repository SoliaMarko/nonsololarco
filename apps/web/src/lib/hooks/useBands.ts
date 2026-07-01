import { useQuery } from '@tanstack/react-query';

import { fetchMyBands } from '../api/bands.api';

export function useMyBands() {
  return useQuery({
    queryKey: ['bands', 'me'],
    queryFn: fetchMyBands,
  });
}

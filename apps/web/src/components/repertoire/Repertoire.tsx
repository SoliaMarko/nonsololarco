import { MOCK_BANDS, MOCK_REPERTOIRE_STATS } from '@/src/data/repertoire/bands.mock';
import { Band } from '@/src/lib/types/repertoire/band.types';

import RepertoireHeader from './RepertoireHeader';

export default function Repertoire() {
  const stats = MOCK_REPERTOIRE_STATS;

  const bands: Band[] = [
    {
      id: '',
      name: 'All Repertoires',
      vinylColor: 'olive',
      readyTracks: stats.readyTracks,
      totalTracks: stats.totalTracks,
      totalDuration: stats.totalDuration,
      tracks: [],
    },
    ...MOCK_BANDS,
  ];

  return (
    <>
      <RepertoireHeader bands={bands} stats={stats} onAIToggle={() => {}} />
    </>
  );
}

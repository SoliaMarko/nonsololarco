import { Band, RepertoireStats } from '@nonsololarco/types';

import RepertoireHeader from './RepertoireHeader';
import TracksTable from './TracksTable';

export interface RepertoireProps {
  bands: Band[];
  stats: RepertoireStats;
}

export default function Repertoire({ bands, stats }: RepertoireProps) {
  return (
    <>
      <RepertoireHeader bands={bands} stats={stats} onAIToggle={() => {}} />
      <TracksTable />
    </>
  );
}

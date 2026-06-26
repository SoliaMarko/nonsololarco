import { Band, RepertoireStats } from '@/src/lib/types/repertoire/band.types';

import RepertoireHeader from './RepertoireHeader';

export interface RepertoireProps {
  bands: Band[];
  stats: RepertoireStats;
}

export default function Repertoire({ bands, stats }: RepertoireProps) {
  return (
    <>
      <RepertoireHeader bands={bands} stats={stats} onAIToggle={() => {}} />
    </>
  );
}

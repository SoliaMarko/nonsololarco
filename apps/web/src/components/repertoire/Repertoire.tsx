import { Band, RepertoireStats } from '@nonsololarco/types';

import { VINYL_COLORS } from '@/src/lib/constants/illustrations/vinyl-record.const';

import RepertoireHeader from './RepertoireHeader';
import TracksTable from './TracksTable';

export interface RepertoireProps {
  bands: Band[];
  stats: RepertoireStats;
}

export default function Repertoire({ bands, stats }: RepertoireProps) {
  const coloredBands = bands.map((band, index) => ({
    ...band,
    color: VINYL_COLORS[index % VINYL_COLORS.length],
  }));

  return (
    <>
      <RepertoireHeader bands={coloredBands} stats={stats} onAIToggle={() => {}} />
      <TracksTable bands={coloredBands} />
    </>
  );
}

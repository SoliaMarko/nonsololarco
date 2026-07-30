'use client';

import { RepertoireStats } from '@nonsololarco/types';

import { useActiveBand } from '@/src/hooks/global/useActiveBand';

interface BandStatsProps {
  stats: RepertoireStats;
}

export default function BandStats({ stats }: BandStatsProps) {
  const { activeBand, isSpecificBandSelected } = useActiveBand();

  const statsSource = isSpecificBandSelected && activeBand ? activeBand : stats;

  return (
    <div className="md:text-fg-tertiary text-edge text-md xs:text-lg flex items-center gap-1 self-center md:gap-3 md:text-xl">
      <span className="md:text-primary-dark">
        <strong className="text-yellow-deep dark:text-emerald-deep md:text-primary-dark md:dark:text-primary-dark font-black">
          {statsSource.totalTracks}
        </strong>{' '}
        tracks
      </span>
      <span className="text-primary-dark">·</span>
      <span className="md:text-primary-dark">
        <strong className="text-yellow-deep dark:text-emerald-deep md:text-primary-dark md:dark:text-primary-dark font-black">
          {statsSource.readyTracks}
        </strong>{' '}
        ready
      </span>
      <span className="text-primary-dark">·</span>
      <span>
        <strong className="text-edge md:text-primary-dark font-black">
          {statsSource.totalDuration}
        </strong>
      </span>
    </div>
  );
}

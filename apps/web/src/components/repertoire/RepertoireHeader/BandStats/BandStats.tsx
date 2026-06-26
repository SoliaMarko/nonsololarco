'use client';

import { useSearchParams } from 'next/navigation';

import { Band, RepertoireStats } from '@/src/lib/types/repertoire/band.types';

export interface RepertoireHeaderProps {
  bands: Band[];
  stats: RepertoireStats;
}

export default function BandStats({ bands, stats }: RepertoireHeaderProps) {
  const searchParams = useSearchParams();

  const activeBandId = searchParams.get('band') ?? bands[0]?.id;
  const activeBand = bands.find((band) => band.id === activeBandId) ?? bands[0];

  const statsSource = activeBandId && activeBand ? activeBand : stats;

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

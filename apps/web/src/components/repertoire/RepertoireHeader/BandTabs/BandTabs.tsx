'use client';

import { Band } from '@nonsololarco/types';

import { useActiveBand } from '@/src/hooks/global/useActiveBand';
import VinylCrate from '@/src/illustrations/vinyl-crate/VinylCrate';
import VinylRecord from '@/src/illustrations/vinyl/VinylRecord/VinylRecord';
import { ALL_BANDS_ID } from '@/src/lib/constants/repertoire.const';
import { cn } from '@/src/utils/cn';

interface BandTabsProps {
  bands: Band[];
}

export default function BandTabs({ bands }: BandTabsProps) {
  const { activeBandId, getVinylColor, onBandChange } = useActiveBand();

  // TODO: Refactor, extract it to the Tab component for design system.
  return (
    <div className="bg-surface border-b-border-primary scrollbar-thumb-fg-tertiary scrollbar-track-edge scrollbar-thin overflow-x-auto overflow-y-hidden border-b">
      <div className="flex min-w-max items-center">
        {bands.map((band) => {
          const isActive = activeBandId === band.id;
          const isAllBands = band.id === ALL_BANDS_ID;

          return (
            <button
              key={band.id}
              onClick={() => onBandChange(band.id)}
              className={cn(
                'plb-3 pli-4 border-edge flex w-48 items-center gap-3 border-r-2 border-solid transition-colors',
                '-mbe-px border-b-4',
                isActive
                  ? 'border-b-accent-red text-fg-primary bg-base'
                  : 'text-fg-tertiary hover:text-fg-secondary hover:bg-elevated border-b-transparent',
              )}
            >
              {isAllBands ? (
                <VinylCrate height={32} isPlaying={isActive} width={24} />
              ) : (
                <VinylRecord color={getVinylColor(band.id)} isPlaying={isActive} size={32} />
              )}
              <div className="min-w-0 text-left">
                <div className="truncate text-sm font-semibold">{band.name}</div>
                <div className="text-fg-tertiary mbs-0.5 truncate text-xs">
                  {band?.role ? [band.role, band.totalTracks].join(' · ') : band.totalTracks}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

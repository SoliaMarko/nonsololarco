'use client';

import { Band } from '@nonsololarco/types';

import Tabs, { TabItem } from '@/src/components/ui/Tabs';
import { useActiveBand } from '@/src/hooks/global/useActiveBand';
import VinylCrate from '@/src/illustrations/vinyl-crate/VinylCrate';
import VinylRecord from '@/src/illustrations/vinyl/VinylRecord/VinylRecord';
import { ALL_BANDS_ID } from '@/src/lib/constants/repertoire.const';

interface BandTabsProps {
  bands: Band[];
}

export default function BandTabs({ bands }: BandTabsProps) {
  const { activeBandId, getVinylColor, onBandChange } = useActiveBand();

  return (
    <Tabs animated variant="panel" label="Bands" className="border-b-border-primary border-b">
      {bands.map((band) => {
        const isActive = activeBandId === band.id;
        const isAllBands = band.id === ALL_BANDS_ID;

        return (
          <TabItem key={band.id} isActive={isActive} onClick={() => onBandChange(band.id)}>
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
          </TabItem>
        );
      })}
    </Tabs>
  );
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Band } from '@nonsololarco/types';

import VinylRecord from '@/src/illustrations/vinyl/VinylRecord/VinylRecord';
import { VINYL_COLORS } from '@/src/lib/constants/illustrations/vinyl-record.const';
import { cn } from '@/src/lib/ui/utils/cn';

interface BandTabsProps {
  bands: Band[];
}

export default function BandTabs({ bands }: BandTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawBandId = searchParams.get('band');
  const activeBandId = bands.some((b) => b.id === rawBandId) ? rawBandId : bands[0]?.id;

  function onBandChange(bandId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('band', bandId || '');
    router.push(`?${params.toString()}`);
  }

  // TODO: Refactor, extract it to the Tab component for design system.
  return (
    <div className="bg-surface border-b-border-primary scrollbar-thumb-fg-tertiary scrollbar-track-edge scrollbar-thin overflow-x-auto overflow-y-hidden border-b">
      <div className="flex min-w-max items-center">
        {bands.map((band, index) => {
          const color = VINYL_COLORS[index % VINYL_COLORS.length];

          return (
            <button
              key={band.id}
              onClick={() => onBandChange(band.id)}
              className={cn(
                'plb-3 pli-4 border-edge flex items-center gap-3 border-r-2 border-solid transition-colors',
                '-mbe-px border-b-4',
                activeBandId === band.id
                  ? 'border-b-accent-red text-fg-primary bg-base'
                  : 'text-fg-tertiary hover:text-fg-secondary hover:bg-elevated cursor-pointer border-b-transparent',
              )}
            >
              <VinylRecord color={color} size={32} isPlaying={activeBandId === band.id} />
              <div className="text-left">
                <div className="text-sm leading-none font-semibold">{band.name}</div>
                <div className="text-fg-tertiary mbs-0.5 text-xs">
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

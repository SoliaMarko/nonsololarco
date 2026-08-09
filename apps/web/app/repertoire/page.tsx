'use client';

import { Suspense, useMemo } from 'react';

import { RepertoireStats, Track } from '@nonsololarco/types';

import AppShell from '@/src/components/layout/AppShell';
import Repertoire from '@/src/components/repertoire';
import Spinner from '@/src/components/ui/Spinner';
import { ActiveBandProvider, useActiveBand } from '@/src/hooks/global/useActiveBand';
import { useMyBands } from '@/src/lib/hooks/useBands';
import { ALL_BANDS_ID, SOLO_BAND_ID, useRepertoireTracks } from '@/src/lib/hooks/useRepertoire';
import { sumRawDurations } from '@/src/utils/duration.utils';

function deriveStats(tracks: Track[]): RepertoireStats {
  return {
    totalTracks: tracks?.length,
    readyTracks: tracks?.filter((t) => t.status === 'ready').length,
    totalDuration: sumRawDurations(tracks?.map((t) => t.duration)),
  };
}

function RepertoireShell({ children }: { children: React.ReactNode }) {
  const { activeBand } = useActiveBand();

  return (
    <AppShell activePath="/repertoire" activeTitle={activeBand?.name} mainClassName="flex flex-col">
      {children}
    </AppShell>
  );
}

function RepertoirePageContent() {
  const { data: bands, isLoading: isLoadingMyBands } = useMyBands();
  const { data: allMyTracks } = useRepertoireTracks(ALL_BANDS_ID);
  const { data: soloTracks } = useRepertoireTracks(SOLO_BAND_ID);

  const allMyStats = useMemo(
    () => (allMyTracks ? deriveStats(allMyTracks.data) : null),
    [allMyTracks],
  );
  const soloStats = useMemo(() => (soloTracks ? deriveStats(soloTracks.data) : null), [soloTracks]);

  const hasSoloTracks = soloTracks && soloTracks.data?.length > 0;

  const formattedBands = useMemo(
    () =>
      bands && allMyStats
        ? [
            { id: ALL_BANDS_ID, name: 'All Repertoires', ...allMyStats },
            ...(hasSoloTracks && soloStats
              ? [{ id: SOLO_BAND_ID, name: 'Solo', ...soloStats }]
              : []),
            ...bands,
          ]
        : null,
    [bands, allMyStats, hasSoloTracks, soloStats],
  );

  if (isLoadingMyBands || !formattedBands || !allMyStats) {
    return (
      <AppShell activePath="/repertoire" mainClassName="flex flex-col">
        <div className="mli-auto flex min-h-full flex-1 flex-col items-center justify-center">
          <Spinner size="xl" />
        </div>
      </AppShell>
    );
  }

  return (
    <ActiveBandProvider bands={formattedBands}>
      <RepertoireShell>
        <Repertoire
          bands={formattedBands}
          isEmpty={allMyStats.totalTracks === 0}
          stats={allMyStats}
        />
      </RepertoireShell>
    </ActiveBandProvider>
  );
}

export default function RepertoirePage() {
  return (
    <Suspense
      fallback={
        <AppShell activePath="/repertoire" mainClassName="flex flex-col">
          <div className="mli-auto flex min-h-full flex-1 flex-col items-center justify-center">
            <Spinner size="xl" />
          </div>
        </AppShell>
      }
    >
      <RepertoirePageContent />
    </Suspense>
  );
}

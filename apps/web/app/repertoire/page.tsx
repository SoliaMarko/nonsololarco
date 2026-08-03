'use client';

import { Suspense, useMemo } from 'react';

import AppShell from '@/src/components/layout/AppShell';
import Repertoire from '@/src/components/repertoire';
import Spinner from '@/src/components/ui/Spinner';
import { MOCK_REPERTOIRE_STATS } from '@/src/data/repertoire/bands.mock';
import { ActiveBandProvider, useActiveBand } from '@/src/hooks/global/useActiveBand';
import { useMyBands } from '@/src/lib/hooks/useBands';

function RepertoireShell({ children }: { children: React.ReactNode }) {
  const { activeBand } = useActiveBand();

  return (
    <AppShell activePath="/repertoire" activeTitle={activeBand?.name}>
      {children}
    </AppShell>
  );
}

function RepertoirePageContent() {
  // TODO: Replace with actual stats from API
  const stats = MOCK_REPERTOIRE_STATS;

  const { data: bands, isLoading: isLoadingMyBands } = useMyBands();

  const formattedBands = useMemo(
    () =>
      bands
        ? [
            {
              id: '',
              name: 'All Repertoires',
              readyTracks: stats.readyTracks,
              totalTracks: stats.totalTracks,
              totalDuration: stats.totalDuration,
            },
            ...bands,
          ]
        : null,
    [bands, stats],
  );

  if (isLoadingMyBands || !formattedBands) {
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
        <Repertoire bands={formattedBands} stats={stats} />
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

'use client';

import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import AppShell from '@/src/components/layout/AppShell';
import Repertoire from '@/src/components/repertoire';
import Spinner from '@/src/components/ui/Spinner';
import { MOCK_REPERTOIRE_STATS } from '@/src/data/repertoire/bands.mock';
import { useMyBands } from '@/src/lib/hooks/useBands';

function RepertoirePageContent() {
  const searchParams = useSearchParams();

  // TODO: Replace with actual stats from API
  const stats = MOCK_REPERTOIRE_STATS;

  const { data: bands, isLoading: isLoadingMyBands } = useMyBands();

  const formattedBands = bands
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
    : null;

  const activeBandId = searchParams.get('band') ?? formattedBands?.[0]?.id;
  const activeBand =
    formattedBands?.find((band) => band.id === activeBandId) ?? formattedBands?.[0];

  return (
    <AppShell
      activePath={'/repertoire'}
      activeTitle={activeBand?.name}
      mainClassName={isLoadingMyBands ? 'flex flex-col' : ''}
    >
      {isLoadingMyBands ? (
        <div className="mli-auto flex min-h-full flex-1 flex-col items-center justify-center">
          <Spinner size="xl" />
        </div>
      ) : formattedBands ? (
        <Repertoire bands={formattedBands} stats={stats} />
      ) : null}
    </AppShell>
  );
}

export default function RepertoirePage() {
  return (
    <Suspense
      fallback={
        <AppShell activePath={'/repertoire'} mainClassName="flex flex-col">
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

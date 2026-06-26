'use client';

import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import AppShell from '@/src/components/layout/AppShell';
import Repertoire from '@/src/components/repertoire';
import Spinner from '@/src/components/ui/Spinner';
import { MOCK_BANDS, MOCK_REPERTOIRE_STATS } from '@/src/data/repertoire/bands.mock';
import { Band } from '@/src/lib/types/repertoire/band.types';

function RepertoirePageContent() {
  const searchParams = useSearchParams();

  const stats = MOCK_REPERTOIRE_STATS;
  const bands: Band[] = [
    {
      id: '',
      name: 'All Repertoires',
      vinylColor: 'olive',
      readyTracks: stats.readyTracks,
      totalTracks: stats.totalTracks,
      totalDuration: stats.totalDuration,
      tracks: [],
    },
    ...MOCK_BANDS,
  ];

  const activeBandId = searchParams.get('band') ?? bands[0]?.id;
  const activeBand = bands.find((band) => band.id === activeBandId) ?? bands[0];

  return (
    <AppShell activePath={'/repertoire'} activeTitle={activeBand?.name}>
      <Repertoire bands={bands} stats={stats} />
    </AppShell>
  );
}

export default function RepertoirePage() {
  return (
    <Suspense
      fallback={
        <div className="mli-auto flex h-full items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <RepertoirePageContent />
    </Suspense>
  );
}

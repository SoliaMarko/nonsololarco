'use client';

'use client';

import { useParams } from 'next/navigation';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

export default function BandPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <AppShell activePath="/band" mainClassName="flex flex-col">
      <EmptyState
        title="Band profile"
        description={`Full band page for "${id}" — members, repertoire, and stats. Coming soon.`}
      />
    </AppShell>
  );
}

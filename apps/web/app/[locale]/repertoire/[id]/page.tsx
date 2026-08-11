'use client';

import { useParams } from 'next/navigation';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

export default function TrackDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <AppShell activePath="/repertoire" mainClassName="flex flex-col">
      <EmptyState
        title="Track details"
        description={`Lyrics, notes, and practice history for "${id}". Coming soon.`}
      />
    </AppShell>
  );
}

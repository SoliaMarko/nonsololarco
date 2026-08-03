'use client';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

export default function CalendarPage() {
  return (
    <AppShell activePath="/calendar" mainClassName="flex flex-col">
      <EmptyState
        title="Calendar"
        description="Rehearsals, gigs, and deadlines — all in one place. Coming soon."
      />
    </AppShell>
  );
}

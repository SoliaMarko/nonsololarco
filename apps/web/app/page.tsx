'use client';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

export default function Home() {
  return (
    <AppShell activePath="/" mainClassName="flex flex-col">
      <EmptyState
        title="Feed"
        description="Updates from your bands, recent activity, and picks from the community. Coming soon."
      />
    </AppShell>
  );
}

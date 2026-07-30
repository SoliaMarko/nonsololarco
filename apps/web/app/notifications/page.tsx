'use client';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

export default function NotificationsPage() {
  return (
    <AppShell activePath="/notifications" mainClassName="flex flex-col">
      <EmptyState
        title="Notifications"
        description="Stay in the loop with band updates, picks, and rehearsal reminders. Coming soon."
      />
    </AppShell>
  );
}

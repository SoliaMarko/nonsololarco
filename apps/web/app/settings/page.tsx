'use client';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

export default function SettingsPage() {
  return (
    <AppShell activePath="/settings" mainClassName="flex flex-col">
      <EmptyState
        title="Settings"
        description="Theme, language, notification preferences, and account details. Coming soon."
      />
    </AppShell>
  );
}

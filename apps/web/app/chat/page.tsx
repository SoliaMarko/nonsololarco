'use client';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

export default function ChatPage() {
  return (
    <AppShell activePath="/chat" mainClassName="flex flex-col">
      <EmptyState
        title="Chats"
        description="Message your bandmates and coordinate in real time. Coming soon."
      />
    </AppShell>
  );
}

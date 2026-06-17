'use client';

import AppShell from '@/src/components/layout/AppShell';
import Text from '@/src/components/typography/Text';

export default function ChatPage() {
  return (
    <AppShell activePath={'/chat'}>
      <Text>Chat Page Content</Text>
    </AppShell>
  );
}

'use client';

import AppShell from '@/src/components/layout/AppShell';
import Text from '@/src/components/typography/Text';

export default function NotificationsPage() {
  return (
    <AppShell activePath={'/notifications'}>
      <Text>Notifications Page Content</Text>
    </AppShell>
  );
}

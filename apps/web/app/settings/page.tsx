'use client';

import AppShell from '@/src/components/layout/AppShell';
import Text from '@/src/components/typography/Text';

export default function SettingsPage() {
  return (
    <AppShell activePath={'/settings'}>
      <Text>Settings Page Content</Text>
    </AppShell>
  );
}

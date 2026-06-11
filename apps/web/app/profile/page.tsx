'use client';

import AppShell from '@/src/components/layout/AppShell';
import Text from '@/src/components/typography/Text';

export default function ProfilePage() {
  return (
    <AppShell activePath={'/profile'}>
      <Text>Profile Page Content</Text>
    </AppShell>
  );
}

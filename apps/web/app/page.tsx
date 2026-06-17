'use client';

import AppShell from '@/src/components/layout/AppShell';
import Text from '@/src/components/typography/Text';

export default function Home() {
  return (
    <AppShell activePath={'/'}>
      <Text>Home Page Content</Text>
    </AppShell>
  );
}

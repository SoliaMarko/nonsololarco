'use client';

import AppShell from '@/src/components/layout/AppShell';
import Text from '@/src/components/typography/Text';

export default function CalendarPage() {
  return (
    <AppShell activePath={'/calendar'}>
      <Text>Calendar Page Content</Text>
    </AppShell>
  );
}

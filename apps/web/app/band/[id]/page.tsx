'use client';

import { useParams } from 'next/navigation';

import AppShell from '@/src/components/layout/AppShell';
import Text from '@/src/components/typography/Text';

export default function BandPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <AppShell activePath="/band">
      <Text>Band Item Page Content id: {id}</Text>
    </AppShell>
  );
}

'use client';

import { useParams } from 'next/navigation';

import AppShell from '@/src/components/layout/AppShell';
import Text from '@/src/components/typography/Text';

export default function RepertoirePage() {
  const { id } = useParams();

  return (
    <AppShell activePath={`/repertoire/[${id}]`}>
      <Text>Repertoire Item Page Content id: {id}</Text>
    </AppShell>
  );
}

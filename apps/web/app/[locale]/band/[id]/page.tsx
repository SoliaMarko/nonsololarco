'use client';

// import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

export default function BandPage() {
  // const { id } = useParams<{ id: string }>();
  const t = useTranslations('pages');

  return (
    <AppShell activePath="/band" mainClassName="flex flex-col">
      <EmptyState title={t('band.title')} description={t('band.comingSoonDescription')} />
    </AppShell>
  );
}

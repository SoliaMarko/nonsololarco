'use client';

import { useTranslations } from 'next-intl';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

export default function Home() {
  const t = useTranslations('pages');

  return (
    <AppShell activePath="/" mainClassName="flex flex-col">
      <EmptyState title={t('feed.title')} description={t('feed.comingSoonDescription')} />
    </AppShell>
  );
}

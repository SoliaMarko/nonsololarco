'use client';

import { useTranslations } from 'next-intl';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

export default function CalendarPage() {
  const t = useTranslations('pages');

  return (
    <AppShell activePath="/calendar" mainClassName="flex flex-col">
      <EmptyState
        title={t('calendar.title')}
        description={t('calendar.comingSoonDescription')}
      />
    </AppShell>
  );
}

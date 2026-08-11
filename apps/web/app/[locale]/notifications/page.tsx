'use client';

import { useTranslations } from 'next-intl';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

export default function NotificationsPage() {
  const t = useTranslations('pages');

  return (
    <AppShell activePath="/notifications" mainClassName="flex flex-col">
      <EmptyState
        title={t('notifications.title')}
        description={t('notifications.comingSoonDescription')}
      />
    </AppShell>
  );
}

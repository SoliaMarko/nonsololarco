'use client';

import { useTranslations } from 'next-intl';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

/** Placeholder page for user settings. Shown while the feature is in development. */
export default function SettingsPage() {
  const t = useTranslations('pages');

  return (
    <AppShell activePath="/settings" mainClassName="flex flex-col">
      <EmptyState
        title={t('settings.title')}
        description={t('settings.comingSoonDescription')}
      />
    </AppShell>
  );
}

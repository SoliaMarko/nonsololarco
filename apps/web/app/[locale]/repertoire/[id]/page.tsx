'use client';

import { useTranslations } from 'next-intl';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

/** Placeholder page for track detail view. Shown while the feature is in development. */
export default function TrackDetailPage() {
  const t = useTranslations('pages');

  return (
    <AppShell activePath="/repertoire" mainClassName="flex flex-col">
      <EmptyState
        title={t('repertoire.trackDetailsTitle')}
        description={t('repertoire.trackDetailsComingSoon')}
      />
    </AppShell>
  );
}

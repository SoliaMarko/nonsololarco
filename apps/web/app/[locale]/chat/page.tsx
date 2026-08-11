'use client';

import { useTranslations } from 'next-intl';

import AppShell from '@/src/components/layout/AppShell';
import EmptyState from '@/src/components/shared/EmptyState';

export default function ChatPage() {
  const t = useTranslations('pages');

  return (
    <AppShell activePath="/chat" mainClassName="flex flex-col">
      <EmptyState title={t('chat.title')} description={t('chat.comingSoonDescription')} />
    </AppShell>
  );
}

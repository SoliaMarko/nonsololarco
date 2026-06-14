'use client';

import AppShell from '@/src/components/layout/AppShell';
import ProfileHero from '@/src/components/profile/ProfileHero';

export default function ProfilePage() {
  return (
    <AppShell activePath={'/profile'}>
      <ProfileHero />
    </AppShell>
  );
}

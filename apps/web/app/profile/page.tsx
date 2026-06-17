'use client';

import AppShell from '@/src/components/layout/AppShell';
import Profile from '@/src/components/profile';

export default function ProfilePage() {
  return (
    <AppShell activePath={'/profile'}>
      <Profile />
    </AppShell>
  );
}

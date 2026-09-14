'use client';

import AppShell from '@/src/components/layout/AppShell';
import Profile from '@/src/components/profile';

/** Profile page — renders the current user's public profile via the `Profile` feature component. */
export default function ProfilePage() {
  return (
    <AppShell activePath={'/profile'}>
      <Profile />
    </AppShell>
  );
}

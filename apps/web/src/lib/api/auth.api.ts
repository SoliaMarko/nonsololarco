import { User } from '@nonsololarco/types';

import { API_URL } from './client';

export async function fetchCurrentUser(): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });

  if (!res.ok) {
    throw new Error('Not authenticated');
  }

  return res.json() as Promise<User>;
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    // If this fails, the token cookie is still active server-side (well,
    // client-side — it's just not cleared) — don't let the caller clear
    // local auth state and redirect as if logout succeeded.
    throw new Error('Logout failed');
  }
}

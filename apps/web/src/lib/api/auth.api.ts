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
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

import { Band } from '@nonsololarco/types';

import { API_URL } from './repertoire.api';

export async function fetchMyBands(): Promise<Band[]> {
  const res = await fetch(`${API_URL}/users/me/bands`);

  if (!res.ok) {
    throw new Error('Failed to fetch bands');
  }

  return res.json();
}

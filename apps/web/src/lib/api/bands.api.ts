import { Band } from '@nonsololarco/types';

import { apiFetch } from './client';

export async function fetchMyBands(): Promise<Band[]> {
  return apiFetch<Band[]>('/users/me/bands');
}

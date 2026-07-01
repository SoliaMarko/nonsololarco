import { Track } from '@nonsololarco/types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export async function fetchMyRepertoire(): Promise<Track[]> {
  const res = await fetch(`${API_URL}/users/me/repertoire`);

  if (!res.ok) {
    throw new Error('Failed to fetch repertoire');
  }

  return res.json();
}

export async function fetchBandRepertoire(bandId: string): Promise<Track[]> {
  const res = await fetch(`${API_URL}/bands/${bandId}/repertoire`);

  if (!res.ok) {
    throw new Error(`Failed to fetch band: ${bandId} repertoire`);
  }

  return res.json();
}

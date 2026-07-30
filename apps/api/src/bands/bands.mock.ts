/**
 * Static band metadata — identity + user's role.
 * Computed stats (totalTracks, readyTracks, totalDuration)
 * are derived from repertoire data in BandsService.
 */
export interface BandSeed {
  id: string;
  name: string;
  role: string;
}

export const MOCK_BANDS: BandSeed[] = [
  { id: 'band-1', name: 'Quiet Yard', role: 'back vocal' },
  { id: 'band-2', name: 'Night Shift', role: 'covers' },
  { id: 'band-3', name: 'Broken Glass', role: 'back vocal' },
  { id: 'band-4', name: 'Dreamy Garden', role: 'covers' },
  { id: 'band-5', name: 'Pumpkin Square', role: 'back vocal' },
  { id: 'band-6', name: 'Jellyfish', role: 'covers' },
];

import { ProfileSidebar } from '@/src/lib/types/profile/profile.types';

export const MOCK_SIDEBAR: ProfileSidebar = {
  instruments: [
    { kind: 'vocal', label: 'Vocal' },
    { kind: 'acoustic', label: 'Acoustic' },
    { kind: 'keys', label: 'Keys' },
  ],
  bands: [
    {
      id: 'band-1',
      name: 'Repertoires',
      role: 'vocal',
      since: 2024,
    },
    {
      id: 'band-2',
      name: 'Тихий двір',
      role: 'back vocal',
      avatarUrl: undefined,
    },
  ],
  achievements: [
    { id: 'ach-1', kind: 'streak', label: '100% June' },
    { id: 'ach-2', kind: 'solo', label: 'Solo Evening' },
    { id: 'ach-3', kind: 'top3', label: 'Top-3', count: 4 },
    { id: 'ach-4', kind: 'fire', label: '6 in a row' },
  ],
};

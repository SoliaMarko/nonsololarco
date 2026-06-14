import { ProfileType } from '../lib/types/profile.types';

export const MOCK_PROFILE: ProfileType = {
  id: 'user-1',
  initials: 'CB',
  name: 'Chester Bennington',
  tags: [
    { icon: 'microphone', labels: ['vocals', 'frontman'] },
    { icon: 'location', labels: ['Lviv'] },
  ],
  memberSince: 2024,
  picks: 42,
  rehearsalsCount: 78,
  tracksCount: 24,
  performancesCount: 12,
};

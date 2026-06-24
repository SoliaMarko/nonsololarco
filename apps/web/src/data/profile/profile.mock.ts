import { ProfileType } from '../../lib/types/profile.types';
import { MomentType } from '../../lib/types/profile/profile.types';

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

export const MOCK_PROFILE_MOMENTS: MomentType[] = [
  {
    id: 'm-1',
    kind: 'photo',
    caption: 'ON STAGE · LAMP',
    thumbnailUrl: null,
    isFeatured: true,
  },
  {
    id: 'm-2',
    kind: 'video',
    caption: 'VOCAL · SOLO',
    thumbnailUrl: null,
    videoUrl: 'https://youtube.com/watch?v=example',
    duration: '0:48',
  },
  {
    id: 'm-3',
    kind: 'photo',
    caption: 'SOUNDCHECK',
    thumbnailUrl: null,
  },
  {
    id: 'm-4',
    kind: 'photo',
    caption: 'BACKSTAGE',
    thumbnailUrl: null,
  },
  {
    id: 'm-5',
    kind: 'video',
    caption: 'EVENING FINALE',
    thumbnailUrl: null,
    videoUrl: 'https://youtube.com/watch?v=example2',
    duration: '1:12',
  },
];

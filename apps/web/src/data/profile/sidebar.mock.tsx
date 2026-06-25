import { BoltOutlineIcon, FlameOutlineIcon, StarOutlineIcon } from '@/src/icons/achievements';
import { AchievementBadgeColor } from '@/src/lib/types/illustrations/achievement-badge.types';
import { AchievementKind, ProfileSidebar } from '@/src/lib/types/profile/profile.types';

export const ACHIEVEMENT_KIND_COLOR_CONFIG: Record<AchievementKind, AchievementBadgeColor> = {
  streak: 'green',
  solo: 'blue',
  top3: 'amber',
  fire: 'red',
};

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
      name: 'Quiet courtyard',
      role: 'back vocal',
      avatarUrl: undefined,
    },
  ],
  achievements: [
    { icon: <FlameOutlineIcon />, id: 'ach-1', kind: 'streak', label: '100% June' },
    { icon: <StarOutlineIcon />, id: 'ach-2', kind: 'solo', label: 'Solo Evening' },
    { icon: <BoltOutlineIcon />, id: 'ach-3', kind: 'top3', label: 'Top-3', count: 4 },
    { icon: <FlameOutlineIcon />, id: 'ach-4', kind: 'fire', label: '6 in a row' },
  ],
};

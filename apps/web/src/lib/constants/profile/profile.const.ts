import { CalendarIcon, MicrophoneIcon, RepertoireIcon } from '@/src/icons/base';
import MediatorBadge from '@/src/illustrations/picks/MediatorBadge';

import { ProfileStatsConfig } from '../../types/profile/profile.types';

export const PROFILE_STATS: ProfileStatsConfig[] = [
  {
    color: 'text-icon-accent-yellow',
    icon: MediatorBadge,
    isPicks: true,
    labelKey: 'profile.stats.picks',
    valueKey: 'picks',
  },
  {
    color: 'text-icon-accent-green',
    icon: CalendarIcon,
    labelKey: 'profile.stats.rehearsals',
    valueKey: 'rehearsalsCount',
  },
  {
    color: 'text-blue-subtle',
    icon: RepertoireIcon,
    labelKey: 'profile.stats.tracks',
    valueKey: 'tracksCount',
  },
  {
    color: 'text-accent-red',
    icon: MicrophoneIcon,
    labelKey: 'profile.stats.performances',
    valueKey: 'performancesCount',
  },
];

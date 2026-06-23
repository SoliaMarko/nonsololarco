import { CalendarIcon, RepertoireIcon } from '@/src/icons/base';
import { BouquetIcon } from '@/src/icons/colorful';
import MediatorBadge from '@/src/illustrations/picks/MediatorBadge';

import { ProfileStatsConfig } from '../../types/profile/profile.types';

export const PROFILE_STATS: ProfileStatsConfig[] = [
  {
    color: 'text-icon-accent-yellow',
    icon: MediatorBadge,
    label: 'Picks',
    isPicks: true,
    valueKey: 'picks',
  },
  {
    color: 'text-icon-accent-green',
    icon: CalendarIcon,
    label: 'Rehearsals',
    valueKey: 'rehearsalsCount',
  },
  {
    color: 'text-accent-red',
    icon: RepertoireIcon,
    label: 'Tracks',
    valueKey: 'tracksCount',
  },
  {
    icon: BouquetIcon,
    label: 'Performances',
    valueKey: 'performancesCount',
  },
];

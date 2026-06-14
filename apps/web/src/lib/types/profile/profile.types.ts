import { ElementType } from 'react';

import { ProfileType } from '../profile.types';

export type ProfileStatsConfig = {
  color?: string;
  icon: ElementType;
  isPicks?: boolean;
  label: string;
  valueKey: keyof Pick<
    ProfileType,
    'picks' | 'rehearsalsCount' | 'tracksCount' | 'performancesCount'
  >;
};

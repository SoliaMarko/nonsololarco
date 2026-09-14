import { ElementType, ReactNode } from 'react';

import { ProfileType } from '../profile.types';

export type ProfileStatsConfig = {
  icon: ElementType;
  labelKey: string;
  valueKey: keyof Pick<
    ProfileType,
    'picks' | 'rehearsalsCount' | 'tracksCount' | 'performancesCount'
  >;
  color?: string;
  isPicks?: boolean;
};

export type MomentKind = 'photo' | 'video';

export type MomentType = {
  /** Caption shown at bottom */
  caption: string;
  id: string;
  kind: MomentKind;
  /** Image URL (photo) or video thumbnail URL (video). Null = empty placeholder. */
  thumbnailUrl: string | null;
  /** Only for video: display duration */
  duration?: string;
  /** The single featured (large) moment is rendered bigger */
  isFeatured?: boolean;
  /** Only for video: external link (YouTube/Vimeo) opened on click */
  videoUrl?: string;
};

export type InstrumentKind =
  | 'vocal'
  | 'violin'
  | 'acoustic'
  | 'keys'
  | 'drums'
  | 'bass'
  | 'cello'
  | 'flute'
  | 'trumpet'
  | 'saxophone'
  | 'harp'
  | 'ukulele';

export interface Instrument {
  kind: InstrumentKind;
  label: string;
}

export interface Band {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  since?: number;
}

export type AchievementKind = 'streak' | 'solo' | 'top3' | 'fire';

export interface Achievement {
  icon: ReactNode;
  id: string;
  kind: AchievementKind;
  label: string | [string, string?];
  count?: number;
}

export interface ProfileSidebar {
  achievements: Achievement[];
  bands: Band[];
  instruments: Instrument[];
}

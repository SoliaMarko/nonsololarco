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

export type MomentKind = 'photo' | 'video';

export type MomentType = {
  /** Caption shown at bottom */
  caption: string;
  /** Only for video: display duration */
  duration?: string;
  id: string;
  /** The single featured (large) moment is rendered bigger */
  isFeatured?: boolean;
  kind: MomentKind;
  /** Image URL (photo) or video thumbnail URL (video). Null = empty placeholder. */
  thumbnailUrl: string | null;
  /** Only for video: external link (YouTube/Vimeo) opened on click */
  videoUrl?: string;
};

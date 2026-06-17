import { type ElementType } from 'react';

import { ICON_POSITION, OPTIONS_POSITION, ORIENTATION, THEME } from '../constants/common.const';

export type Locale = 'en' | 'it' | 'ua';

export interface SVGCustomProps {
  size?: number | string;
  title?: string;
  titleId?: string;
}

export type ValuesType<T> = T[keyof T];

export type IconPositionType = ValuesType<typeof ICON_POSITION>;
export type OptionsPositionType = ValuesType<typeof OPTIONS_POSITION>;
export type OrientationType = ValuesType<typeof ORIENTATION>;
export type ThemeType = ValuesType<typeof THEME>;

export type NavItem = {
  badge?: number;
  href: string;
  icon: ElementType;
  label: string;
};

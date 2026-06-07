import { ICON_POSITION, ORIENTATION } from '../constants/common.const';

export type Locale = 'en' | 'it' | 'ua';

export interface SVGCustomProps {
  size?: number | string;
  title?: string;
  titleId?: string;
}

export type ValuesType<T> = T[keyof T];

export type IconPositionType = ValuesType<typeof ICON_POSITION>;
export type OrientationType = ValuesType<typeof ORIENTATION>;

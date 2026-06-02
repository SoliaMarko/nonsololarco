import { ICON_POSITION, ORIENTATION } from '../constants/common.const';

export interface SVGCustomProps {
  size?: string;
  title?: string;
  titleId?: string;
}

export type ValuesType<T> = T[keyof T];

export type IconPositionType = ValuesType<typeof ICON_POSITION>;
export type OrientationType = ValuesType<typeof ORIENTATION>;

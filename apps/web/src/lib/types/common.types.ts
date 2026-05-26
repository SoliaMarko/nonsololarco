import { IconPosition, Orientation } from '../constants/common.const';

export type ValuesType<T> = T[keyof T];

export type IconPositionType = ValuesType<typeof IconPosition>;
export type OrientationType = ValuesType<typeof Orientation>;

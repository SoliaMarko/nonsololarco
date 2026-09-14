import { TrackStatus } from '@nonsololarco/types';

export type MetronomePhase = 'choose' | 'play';

/**
 * A time signature defined by its display label and beat count.
 *
 * `beats` is the number of audible clicks per bar. For compound signatures
 * like 6/8 or 9/8, `beats` reflects the number of felt pulses (2 or 3)
 * when `compound` is true — but we keep it as the literal upper numeral
 * so the visual dots match what musicians expect to see.
 */
export interface TimeSignatureDef {
  /** Number of beat dots / clicks per bar */
  beats: number;
  /** Display label — e.g. "4/4", "6/8" */
  label: string;
}

/**
 * All available time signatures, ordered for the top-bar selector.
 *
 * Simple: 2/4, 3/4, 4/4, 5/4, 6/4, 7/4
 * Compound: 6/8, 9/8, 12/8
 * Half: 2/2
 */
export const TIME_SIGNATURE_OPTIONS: TimeSignatureDef[] = [
  { beats: 2, label: '2/4' },
  { beats: 3, label: '3/4' },
  { beats: 4, label: '4/4' },
  { beats: 5, label: '5/4' },
  { beats: 6, label: '6/4' },
  { beats: 7, label: '7/4' },
  { beats: 6, label: '6/8' },
  { beats: 9, label: '9/8' },
  { beats: 12, label: '12/8' },
  { beats: 2, label: '2/2' },
];

/** Default time signature */
export const DEFAULT_SIGNATURE: TimeSignatureDef = TIME_SIGNATURE_OPTIONS[2]!; // 4/4

/**
 * Valid numerators for each denominator value. Covers standard simple,
 * compound and irregular meters used in classical and contemporary music.
 */
export const VALID_NUMERATORS: Record<number, number[]> = {
  2: [2, 3, 4],
  4: [2, 3, 4, 5, 6, 7],
  8: [3, 5, 6, 7, 9, 12],
};

/** Available denominator values for time signature selectors. */
export const DENOMINATORS = [2, 4, 8] as const;

export interface PracticeSession {
  bpm: number;
  /** Session length in milliseconds — the numeric source of truth for stats. */
  durationMs: number;
  id: string;
  song: string;
  songNumber: number;
  /**
   * ISO 8601 timestamp of when the session started — the sort key and the
   * single source of truth for the date. The displayed label is derived
   * from it at render time via next-intl's formatter, so the two can never
   * disagree.
   */
  startedAt: string;
}

export interface ChooserSong {
  bpm: number;
  key: string;
  number: number;
  ready: TrackStatus;
  title: string;
}

export const MT_MIN = 40;
export const MT_MAX = 240;
export const MT_TICK_WIDTH = 14;

/**
 * Returns the Italian tempo marking with a Ukrainian translation for a given
 * BPM value — e.g. `"Andante · кроком"`.
 *
 * Ranges follow the standard classical convention:
 * Largo (< 60), Adagio (60–80), Andante (80–108), Moderato (108–120),
 * Allegro (120–168), Presto (168–200), Prestissimo (≥ 200).
 *
 * Real scores treat these as descriptions of character as much as speed, so
 * published charts disagree at the edges by a few BPM; these boundaries are
 * the most widely cited set.
 */
export function tempoName(bpm: number): string {
  if (bpm < 60) return 'Largo · широко';
  if (bpm < 80) return 'Adagio · повільно';
  if (bpm < 108) return 'Andante · кроком';
  if (bpm < 120) return 'Moderato · помірно';
  if (bpm < 168) return 'Allegro · жваво';
  if (bpm < 200) return 'Presto · швидко';
  return 'Prestissimo';
}

/**
 * Clamps a BPM value to the allowed metronome range [MT_MIN, MT_MAX].
 */
export function clampBpm(bpm: number): number {
  return Math.max(MT_MIN, Math.min(MT_MAX, bpm));
}

const SHORT_MONTHS_UK = [
  'СІЧ',
  'ЛЮТ',
  'БЕР',
  'КВІ',
  'ТРА',
  'ЧЕРВ',
  'ЛИП',
  'СЕР',
  'ВЕР',
  'ЖОВ',
  'ЛИС',
  'ГРУ',
];

/**
 * Formats an ISO timestamp as a short Ukrainian date — `"4 ЧЕРВ"`.
 *
 * The year is omitted because the history list is grouped by song and read
 * at a glance; returns an em dash for a timestamp the browser can't parse
 * rather than the string `"Invalid Date"`.
 */
export function formatSessionDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return `${date.getDate()} ${SHORT_MONTHS_UK[date.getMonth()]}`;
}

/**
 * Compares two sessions so the most recent sorts first.
 *
 * @example sessions.slice().sort(byNewestFirst)
 */
export function byNewestFirst(a: { startedAt: string }, b: { startedAt: string }): number {
  return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
}

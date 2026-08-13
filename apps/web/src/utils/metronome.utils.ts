export const MT_MIN = 40;
export const MT_MAX = 240;
export const MT_TICK_WIDTH = 14;

/**
 * The seven classical tempo bands, as stable ids. The UI localizes each one
 * through the `metronome.tempo*` messages — the Italian marking is kept in
 * every locale, only the plain-language gloss after it changes.
 */
export type TempoId =
  | 'largo'
  | 'adagio'
  | 'andante'
  | 'moderato'
  | 'allegro'
  | 'presto'
  | 'prestissimo';

/**
 * Maps a BPM value to its tempo band id — e.g. `92 → "andante"`.
 *
 * Ranges follow the standard classical convention:
 * Largo (< 60), Adagio (60–80), Andante (80–108), Moderato (108–120),
 * Allegro (120–168), Presto (168–200), Prestissimo (≥ 200).
 *
 * Real scores treat these as descriptions of character as much as speed, so
 * published charts disagree at the edges by a few BPM; these boundaries are
 * the most widely cited set. Returns an id rather than a display string so
 * the wording stays in the message catalogue, not the util.
 */
export function tempoName(bpm: number): TempoId {
  if (bpm < 60) return 'largo';
  if (bpm < 80) return 'adagio';
  if (bpm < 108) return 'andante';
  if (bpm < 120) return 'moderato';
  if (bpm < 168) return 'allegro';
  if (bpm < 200) return 'presto';
  return 'prestissimo';
}

/**
 * Clamps a BPM value to the allowed metronome range [MT_MIN, MT_MAX].
 */
export function clampBpm(bpm: number): number {
  return Math.max(MT_MIN, Math.min(MT_MAX, bpm));
}

/**
 * Compares two sessions so the most recent sorts first.
 *
 * @example sessions.slice().sort(byNewestFirst)
 */
export function byNewestFirst(a: { startedAt: string }, b: { startedAt: string }): number {
  return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
}

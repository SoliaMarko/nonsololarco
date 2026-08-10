export const MT_MIN = 40;
export const MT_MAX = 240;
export const MT_TICK_WIDTH = 14;

/**
 * Returns the Italian tempo marking with a Ukrainian translation for a given
 * BPM value — e.g. `"Andante · кроком"`.
 *
 * Ranges follow the standard classical convention: Largo (< 60), Adagio (< 72),
 * Andante (< 92), Moderato (< 120), Allegro (< 156), Presto (< 200),
 * Prestissimo (≥ 200).
 */
export function tempoName(bpm: number): string {
  if (bpm < 60) return 'Largo · широко';
  if (bpm < 72) return 'Adagio · повільно';
  if (bpm < 92) return 'Andante · кроком';
  if (bpm < 120) return 'Moderato · помірно';
  if (bpm < 156) return 'Allegro · жваво';
  if (bpm < 200) return 'Presto · швидко';
  return 'Prestissimo';
}

/**
 * Clamps a BPM value to the allowed metronome range [MT_MIN, MT_MAX].
 */
export function clampBpm(bpm: number): number {
  return Math.max(MT_MIN, Math.min(MT_MAX, bpm));
}

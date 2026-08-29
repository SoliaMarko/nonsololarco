/**
 * Parse a human-readable duration string ("1 hr 2 min", "45 min", "2 hr")
 * back into total seconds.
 */
export function parseFormattedDuration(formatted: string): number {
  const hrMatch = formatted.match(/(\d+)\s*hr/);
  const minMatch = formatted.match(/(\d+)\s*min/);

  const hours = hrMatch?.[1] ? parseInt(hrMatch[1], 10) : 0;
  const minutes = minMatch?.[1] ? parseInt(minMatch[1], 10) : 0;

  return hours * 3600 + minutes * 60;
}

/**
 * Format total seconds into a human-readable duration.
 * Matches the backend format: "3 min", "1 hr 2 min", "2 hr".
 */
export function formatDuration(totalSeconds: number): string {
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.round((totalSeconds % 3600) / 60);

  // Carry rounding overflow (e.g. 7199 s → 1 hr 60 min → 2 hr)
  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }

  if (hours === 0) return `${minutes} min`;

  return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
}

/**
 * Format a track length in seconds as the `"m:ss"` label shown in the
 * repertoire table.
 *
 * Seconds are always two digits, so 190 renders as `"3:10"` and 185 as
 * `"3:05"`. Minutes are not padded and are not capped at 60 — a 75-minute
 * recording shows as `"75:00"` rather than `"1:15:00"`, because the column is
 * a track length and hour-long tracks are not a case worth a third segment.
 *
 * Negative or non-finite input renders as `"0:00"` rather than throwing;
 * the value comes from the API and a broken row should not blank the table.
 */
export function formatTrackDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00';

  const whole = Math.round(totalSeconds);
  const minutes = Math.floor(whole / 60);
  const seconds = whole % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Sum an array of formatted duration strings into a single formatted total.
 */
export function sumFormattedDurations(durations: string[]): string {
  const totalSeconds = durations?.reduce((sum, d) => sum + parseFormattedDuration(d), 0) ?? 0;

  return formatDuration(totalSeconds);
}

/**
 * Sum track lengths in seconds into a human-readable total — `"1 hr 2 min"`.
 *
 * Used for the repertoire page header. Individual rows use
 * `formatTrackDuration` instead, which produces the `"m:ss"` form.
 */
export function sumTrackDurations(durationsInSeconds: number[]): string {
  const totalSeconds = durationsInSeconds?.reduce((sum, s) => sum + s, 0) ?? 0;

  return formatDuration(totalSeconds);
}

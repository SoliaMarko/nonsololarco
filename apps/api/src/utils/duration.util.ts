/**
 * Parse a "m:ss" duration string into total seconds.
 * Returns 0 for invalid input.
 */
export function parseDuration(duration: string): number {
  const parts = duration.split(':');

  if (parts.length !== 2) return 0;

  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);

  if (isNaN(minutes) || isNaN(seconds)) return 0;

  return minutes * 60 + seconds;
}

/**
 * Format total seconds into a human-readable duration.
 *
 * Examples:
 *  - 180  → "3 min"
 *  - 3720 → "1 hr 2 min"
 *  - 7380 → "2 hr 3 min"
 *  - 0    → "0 min"
 */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);

  if (hours === 0) return `${minutes} min`;

  return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
}

/**
 * Sum an array of "m:ss" duration strings into a formatted total.
 */
export function sumDurations(durations: string[]): string {
  const totalSeconds = durations.reduce((sum, d) => sum + parseDuration(d), 0);

  return formatDuration(totalSeconds);
}

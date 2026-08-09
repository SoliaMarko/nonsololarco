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
 * Parse a raw "m:ss" track duration into total seconds.
 */
export function parseRawDuration(duration: string): number {
  const parts = duration.split(':');

  if (parts.length !== 2) return 0;

  const minutes = parseInt(parts[0] ?? '0', 10);
  const seconds = parseInt(parts[1] ?? '0', 10);

  return (isNaN(minutes) ? 0 : minutes) * 60 + (isNaN(seconds) ? 0 : seconds);
}

/**
 * Sum an array of formatted duration strings into a single formatted total.
 */
export function sumFormattedDurations(durations: string[]): string {
  const totalSeconds = durations?.reduce((sum, d) => sum + parseFormattedDuration(d), 0) ?? 0;

  return formatDuration(totalSeconds);
}

/**
 * Sum an array of raw "m:ss" track durations into a formatted total.
 */
export function sumRawDurations(durations: string[]): string {
  const totalSeconds = durations?.reduce((sum, d) => sum + parseRawDuration(d), 0) ?? 0;

  return formatDuration(totalSeconds);
}

/**
 * Formats a second count as human-readable text — `"3 hr 20 min"`, or
 * `"45 min"` under an hour, or `"0 min"` for zero.
 *
 * Rounds to the nearest minute, carrying 60 up to the next hour so callers
 * never see `"2 hr 60 min"`.
 *
 * Used for aggregate totals the server computes (a band's total repertoire
 * length). Individual track lengths are returned as raw `durationSeconds` and
 * formatted by the client.
 *
 * @example
 * formatDuration(180)  // "3 min"
 * formatDuration(3720) // "1 hr 2 min"
 * formatDuration(7199) // "2 hr"  — 119.98 min rounds to 120, carried
 */
export function formatDuration(totalSeconds: number): string {
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.round((totalSeconds % 3600) / 60);

  // Carry rounding overflow, e.g. 7199 s → 1 hr 60 min → 2 hr
  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }

  if (hours === 0) return `${minutes} min`;

  return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
}

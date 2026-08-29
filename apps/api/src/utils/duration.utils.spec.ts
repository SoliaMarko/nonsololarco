import { formatDuration } from './duration.util';

describe('formatDuration', () => {
  it('formats a sub-hour total as minutes only', () => {
    expect(formatDuration(180)).toBe('3 min');
    expect(formatDuration(2700)).toBe('45 min');
  });

  it('formats a whole number of hours without a minutes part', () => {
    expect(formatDuration(3600)).toBe('1 hr');
    expect(formatDuration(7200)).toBe('2 hr');
  });

  it('formats hours and minutes together', () => {
    expect(formatDuration(3720)).toBe('1 hr 2 min');
    expect(formatDuration(7380)).toBe('2 hr 3 min');
  });

  it('returns "0 min" for zero', () => {
    expect(formatDuration(0)).toBe('0 min');
  });

  it('rounds to the nearest minute', () => {
    // 3 min 29 s rounds down, 3 min 31 s rounds up
    expect(formatDuration(209)).toBe('3 min');
    expect(formatDuration(211)).toBe('4 min');
  });

  it('carries a rounded 60 minutes up to the next hour', () => {
    // 7199 s is 1 hr 59.98 min — the minutes round to 60 and must carry,
    // otherwise callers see "1 hr 60 min"
    expect(formatDuration(7199)).toBe('2 hr');
    expect(formatDuration(3599)).toBe('1 hr');
  });
});

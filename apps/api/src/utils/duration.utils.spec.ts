import { formatDuration, parseDuration, sumDurations } from './duration.util';

describe('parseDuration', () => {
  it('parses standard m:ss format', () => {
    expect(parseDuration('3:10')).toBe(190);
    expect(parseDuration('0:45')).toBe(45);
    expect(parseDuration('5:00')).toBe(300);
  });

  it('parses durations over 9 minutes', () => {
    expect(parseDuration('12:30')).toBe(750);
  });

  it('returns 0 for empty string', () => {
    expect(parseDuration('')).toBe(0);
  });

  it('returns 0 for missing colon', () => {
    expect(parseDuration('310')).toBe(0);
  });

  it('returns 0 for non-numeric parts', () => {
    expect(parseDuration('ab:cd')).toBe(0);
    expect(parseDuration(':30')).toBe(0);
    expect(parseDuration('3:')).toBe(0);
  });

  it('returns 0 for extra segments', () => {
    expect(parseDuration('1:02:30')).toBe(0);
  });
});

describe('formatDuration', () => {
  it('formats seconds-only as minutes', () => {
    expect(formatDuration(180)).toBe('3 min');
    expect(formatDuration(60)).toBe('1 min');
  });

  it('formats zero seconds', () => {
    expect(formatDuration(0)).toBe('0 min');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(3720)).toBe('1 hr 2 min');
    expect(formatDuration(7380)).toBe('2 hr 3 min');
  });

  it('formats exact hours without trailing "0 min"', () => {
    expect(formatDuration(3600)).toBe('1 hr');
    expect(formatDuration(7200)).toBe('2 hr');
  });

  it('rounds partial minutes', () => {
    expect(formatDuration(91)).toBe('2 min');
    expect(formatDuration(29)).toBe('0 min');
  });
});

describe('sumDurations', () => {
  it('sums multiple durations', () => {
    expect(sumDurations(['3:10', '2:50'])).toBe('6 min');
  });

  it('returns "0 min" for empty array', () => {
    expect(sumDurations([])).toBe('0 min');
  });

  it('handles single duration', () => {
    expect(sumDurations(['4:30'])).toBe('5 min');
  });

  it('sums into hours when total is large', () => {
    // 20 x "3:00" = 60 min = 1 hr
    const durations = Array.from({ length: 20 }, () => '3:00');
    expect(sumDurations(durations)).toBe('1 hr');
  });

  it('skips invalid entries gracefully', () => {
    expect(sumDurations(['3:00', 'bad', '2:00'])).toBe('5 min');
  });
});

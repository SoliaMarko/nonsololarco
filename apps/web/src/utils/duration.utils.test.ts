import { describe, expect, it } from 'vitest';

import {
  formatDuration,
  formatTrackDuration,
  parseFormattedDuration,
  sumFormattedDurations,
  sumTrackDurations,
} from './duration.utils';

describe('formatTrackDuration', () => {
  it('renders seconds padded to two digits', () => {
    expect(formatTrackDuration(190)).toBe('3:10');
    expect(formatTrackDuration(185)).toBe('3:05');
    expect(formatTrackDuration(180)).toBe('3:00');
  });

  it('renders under a minute with a zero minutes part', () => {
    expect(formatTrackDuration(45)).toBe('0:45');
    expect(formatTrackDuration(5)).toBe('0:05');
  });

  it('returns "0:00" for zero', () => {
    expect(formatTrackDuration(0)).toBe('0:00');
  });

  it('does not cap minutes at 60', () => {
    // A long recording stays in m:ss rather than growing an hours segment
    expect(formatTrackDuration(4500)).toBe('75:00');
  });

  it('rounds fractional seconds to the nearest second', () => {
    expect(formatTrackDuration(190.4)).toBe('3:10');
    expect(formatTrackDuration(190.6)).toBe('3:11');
  });

  it('falls back to "0:00" for negative or non-finite input', () => {
    // The value comes from the API; one broken row should not blank the table
    expect(formatTrackDuration(-5)).toBe('0:00');
    expect(formatTrackDuration(NaN)).toBe('0:00');
    expect(formatTrackDuration(Infinity)).toBe('0:00');
  });
});

describe('sumTrackDurations', () => {
  it('sums seconds into a human-readable total', () => {
    expect(sumTrackDurations([190, 170])).toBe('6 min');
  });

  it('returns "0 min" for an empty list', () => {
    expect(sumTrackDurations([])).toBe('0 min');
  });

  it('crosses into hours', () => {
    // 20 tracks of 3 min each
    expect(sumTrackDurations(Array(20).fill(180))).toBe('1 hr');
  });
});

describe('formatDuration', () => {
  it('formats sub-hour totals as minutes', () => {
    expect(formatDuration(180)).toBe('3 min');
  });

  it('formats whole hours without a minutes part', () => {
    expect(formatDuration(3600)).toBe('1 hr');
  });

  it('formats hours and minutes together', () => {
    expect(formatDuration(3720)).toBe('1 hr 2 min');
  });

  it('carries a rounded 60 minutes up to the next hour', () => {
    expect(formatDuration(7199)).toBe('2 hr');
  });
});

describe('parseFormattedDuration', () => {
  it('parses hours and minutes back into seconds', () => {
    expect(parseFormattedDuration('1 hr 2 min')).toBe(3720);
    expect(parseFormattedDuration('45 min')).toBe(2700);
    expect(parseFormattedDuration('2 hr')).toBe(7200);
  });

  it('returns 0 for text with no recognisable parts', () => {
    expect(parseFormattedDuration('')).toBe(0);
    expect(parseFormattedDuration('soon')).toBe(0);
  });
});

describe('sumFormattedDurations', () => {
  it('round-trips a list of formatted totals', () => {
    expect(sumFormattedDurations(['45 min', '1 hr 15 min'])).toBe('2 hr');
  });

  it('returns "0 min" for an empty list', () => {
    expect(sumFormattedDurations([])).toBe('0 min');
  });
});

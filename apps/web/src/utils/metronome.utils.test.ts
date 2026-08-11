import { describe, expect, it } from 'vitest';

import { MT_MAX, MT_MIN, byNewestFirst, clampBpm, formatSessionDate, tempoName } from './metronome.utils';

describe('tempoName', () => {
  it('returns Largo for BPM below 60', () => {
    expect(tempoName(40)).toBe('Largo · широко');
    expect(tempoName(59)).toBe('Largo · широко');
  });

  it('returns Adagio for BPM 60–79', () => {
    expect(tempoName(60)).toBe('Adagio · повільно');
    expect(tempoName(79)).toBe('Adagio · повільно');
  });

  it('returns Andante for BPM 80–107', () => {
    expect(tempoName(80)).toBe('Andante · кроком');
    expect(tempoName(92)).toBe('Andante · кроком');
    expect(tempoName(107)).toBe('Andante · кроком');
  });

  it('returns Moderato for BPM 108–119', () => {
    expect(tempoName(108)).toBe('Moderato · помірно');
    expect(tempoName(119)).toBe('Moderato · помірно');
  });

  it('returns Allegro for BPM 120–167', () => {
    expect(tempoName(120)).toBe('Allegro · жваво');
    expect(tempoName(167)).toBe('Allegro · жваво');
  });

  it('returns Presto for BPM 168–199', () => {
    expect(tempoName(168)).toBe('Presto · швидко');
    expect(tempoName(199)).toBe('Presto · швидко');
  });

  it('returns Prestissimo for BPM 200+', () => {
    expect(tempoName(200)).toBe('Prestissimo');
    expect(tempoName(240)).toBe('Prestissimo');
  });
});

describe('clampBpm', () => {
  it('returns the value when within range', () => {
    expect(clampBpm(120)).toBe(120);
    expect(clampBpm(MT_MIN)).toBe(MT_MIN);
    expect(clampBpm(MT_MAX)).toBe(MT_MAX);
  });

  it('clamps to MT_MIN when below range', () => {
    expect(clampBpm(0)).toBe(MT_MIN);
    expect(clampBpm(-10)).toBe(MT_MIN);
    expect(clampBpm(39)).toBe(MT_MIN);
  });

  it('clamps to MT_MAX when above range', () => {
    expect(clampBpm(241)).toBe(MT_MAX);
    expect(clampBpm(999)).toBe(MT_MAX);
  });
});

describe('formatSessionDate', () => {
  it('formats an ISO date as day + short Ukrainian month', () => {
    expect(formatSessionDate('2026-06-04T18:30:00.000Z')).toBe('4 ЧЕРВ');
    expect(formatSessionDate('2026-05-28T20:05:00.000Z')).toBe('28 ТРА');
  });

  it('returns an em dash for an unparseable value', () => {
    expect(formatSessionDate('not a date')).toBe('—');
    expect(formatSessionDate('')).toBe('—');
  });
});

describe('byNewestFirst', () => {
  const older = { startedAt: '2026-05-02T19:10:00.000Z' };
  const newer = { startedAt: '2026-06-04T18:30:00.000Z' };

  it('sorts the most recent session first', () => {
    expect([older, newer].sort(byNewestFirst)).toEqual([newer, older]);
  });

  it('treats equal timestamps as equal', () => {
    expect(byNewestFirst(older, { ...older })).toBe(0);
  });
});

describe('constants', () => {
  it('defines the expected BPM range', () => {
    expect(MT_MIN).toBe(40);
    expect(MT_MAX).toBe(240);
  });
});

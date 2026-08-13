import { describe, expect, it } from 'vitest';

import { MT_MAX, MT_MIN, byNewestFirst, clampBpm, tempoName } from './metronome.utils';

describe('tempoName', () => {
  it('returns Largo for BPM below 60', () => {
    expect(tempoName(40)).toBe('largo');
    expect(tempoName(59)).toBe('largo');
  });

  it('returns Adagio for BPM 60–79', () => {
    expect(tempoName(60)).toBe('adagio');
    expect(tempoName(79)).toBe('adagio');
  });

  it('returns Andante for BPM 80–107', () => {
    expect(tempoName(80)).toBe('andante');
    expect(tempoName(92)).toBe('andante');
    expect(tempoName(107)).toBe('andante');
  });

  it('returns Moderato for BPM 108–119', () => {
    expect(tempoName(108)).toBe('moderato');
    expect(tempoName(119)).toBe('moderato');
  });

  it('returns Allegro for BPM 120–167', () => {
    expect(tempoName(120)).toBe('allegro');
    expect(tempoName(167)).toBe('allegro');
  });

  it('returns Presto for BPM 168–199', () => {
    expect(tempoName(168)).toBe('presto');
    expect(tempoName(199)).toBe('presto');
  });

  it('returns Prestissimo for BPM 200+', () => {
    expect(tempoName(200)).toBe('prestissimo');
    expect(tempoName(240)).toBe('prestissimo');
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

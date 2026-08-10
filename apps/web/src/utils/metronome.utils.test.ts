import { describe, expect, it } from 'vitest';

import { MT_MAX, MT_MIN, clampBpm, tempoName } from './metronome.utils';

describe('tempoName', () => {
  it('returns Largo for BPM below 60', () => {
    expect(tempoName(40)).toBe('Largo · широко');
    expect(tempoName(59)).toBe('Largo · широко');
  });

  it('returns Adagio for BPM 60–71', () => {
    expect(tempoName(60)).toBe('Adagio · повільно');
    expect(tempoName(71)).toBe('Adagio · повільно');
  });

  it('returns Andante for BPM 72–91', () => {
    expect(tempoName(72)).toBe('Andante · кроком');
    expect(tempoName(91)).toBe('Andante · кроком');
  });

  it('returns Moderato for BPM 92–119', () => {
    expect(tempoName(92)).toBe('Moderato · помірно');
    expect(tempoName(119)).toBe('Moderato · помірно');
  });

  it('returns Allegro for BPM 120–155', () => {
    expect(tempoName(120)).toBe('Allegro · жваво');
    expect(tempoName(155)).toBe('Allegro · жваво');
  });

  it('returns Presto for BPM 156–199', () => {
    expect(tempoName(156)).toBe('Presto · швидко');
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

describe('constants', () => {
  it('defines the expected BPM range', () => {
    expect(MT_MIN).toBe(40);
    expect(MT_MAX).toBe(240);
  });
});

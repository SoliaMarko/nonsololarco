import { describe, expect, it } from 'vitest';

import { buildBandColorMap, getBandVinylColor } from './vinyl.utils';

describe('buildBandColorMap', () => {
  it('assigns distinct colors to each band', () => {
    const map = buildBandColorMap(['band-a', 'band-b', 'band-c']);

    expect(map.size).toBe(3);

    const colors = [...map.values()];
    const unique = new Set(colors);
    expect(unique.size).toBe(3);
  });

  it('is deterministic regardless of input order', () => {
    const map1 = buildBandColorMap(['band-b', 'band-a']);
    const map2 = buildBandColorMap(['band-a', 'band-b']);

    expect(map1.get('band-a')).toBe(map2.get('band-a'));
    expect(map1.get('band-b')).toBe(map2.get('band-b'));
  });

  it('ignores pseudo-band IDs (empty string, "solo")', () => {
    const map = buildBandColorMap(['', 'solo', 'band-a']);

    expect(map.size).toBe(1);
    expect(map.has('')).toBe(false);
    expect(map.has('solo')).toBe(false);
    expect(map.has('band-a')).toBe(true);
  });

  it('deduplicates identical ids', () => {
    const map = buildBandColorMap(['band-a', 'band-a', 'band-a']);

    expect(map.size).toBe(1);
  });

  it('prevents adjacent bands from sharing a color when the palette wraps', () => {
    const ids = Array.from({ length: 15 }, (_, i) => `band-${String(i).padStart(2, '0')}`);
    const map = buildBandColorMap(ids);
    const sorted = [...ids].sort();
    const colors = sorted.map((id) => map.get(id));

    for (let i = 1; i < colors.length; i++) {
      expect(colors[i]).not.toBe(colors[i - 1]);
    }
  });

  it('returns an empty map for empty input', () => {
    const map = buildBandColorMap([]);
    expect(map.size).toBe(0);
  });
});

describe('getBandVinylColor', () => {
  const map = buildBandColorMap(['band-a', 'band-b']);

  it('returns the assigned color for a known band', () => {
    const color = getBandVinylColor(map, 'band-a');
    expect(color).not.toBe('solo');
    expect(typeof color).toBe('string');
  });

  it('returns "solo" for null or undefined bandId', () => {
    expect(getBandVinylColor(map, null)).toBe('solo');
    expect(getBandVinylColor(map, undefined)).toBe('solo');
  });

  it('returns "solo" for the "solo" pseudo-band', () => {
    expect(getBandVinylColor(map, 'solo')).toBe('solo');
  });

  it('returns "solo" for the empty-string pseudo-band', () => {
    expect(getBandVinylColor(map, '')).toBe('solo');
  });

  it('returns "solo" for an unknown band id', () => {
    expect(getBandVinylColor(map, 'band-unknown')).toBe('solo');
  });
});

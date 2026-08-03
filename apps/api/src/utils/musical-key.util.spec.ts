import { toDisplayMusicalKey, toPrismaMusicalKey } from './musical-key.util';

describe('toDisplayMusicalKey', () => {
  it('passes through natural (non-sharp) keys unchanged', () => {
    expect(toDisplayMusicalKey('Am')).toBe('Am');
    expect(toDisplayMusicalKey('C')).toBe('C');
    expect(toDisplayMusicalKey('Bm')).toBe('Bm');
  });

  it('converts sharp major keys to "#" notation', () => {
    expect(toDisplayMusicalKey('CSharp')).toBe('C#');
    expect(toDisplayMusicalKey('GSharp')).toBe('G#');
  });

  it('converts sharp minor keys to "#m" notation', () => {
    expect(toDisplayMusicalKey('FSharpm')).toBe('F#m');
    expect(toDisplayMusicalKey('ASharpm')).toBe('A#m');
  });
});

describe('toPrismaMusicalKey', () => {
  it('passes through natural (non-sharp) keys unchanged', () => {
    expect(toPrismaMusicalKey('Am')).toBe('Am');
    expect(toPrismaMusicalKey('C')).toBe('C');
  });

  it('converts "#" notation to the Prisma-safe identifier', () => {
    expect(toPrismaMusicalKey('C#')).toBe('CSharp');
    expect(toPrismaMusicalKey('F#m')).toBe('FSharpm');
  });

  it('throws for an unknown key', () => {
    expect(() => toPrismaMusicalKey('H')).toThrow('Unknown musical key: "H"');
  });

  it('round-trips every key through both conversions', () => {
    const allDisplayKeys = [
      'C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'D#', 'D#m', 'E', 'Em', 'F', 'Fm',
      'F#', 'F#m', 'G', 'Gm', 'G#', 'G#m', 'A', 'Am', 'A#', 'A#m', 'B', 'Bm',
    ];

    for (const display of allDisplayKeys) {
      const prismaKey = toPrismaMusicalKey(display);
      expect(toDisplayMusicalKey(prismaKey)).toBe(display);
    }
  });
});

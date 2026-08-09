import { MusicalKey } from '@nonsololarco/db';

/**
 * Prisma enum member names can't contain "#" (not a valid identifier), so
 * sharps are stored as e.g. `CSharp` / `CSharpm` and mapped back to the
 * familiar "C#" / "C#m" notation here, at the API boundary. Everything
 * downstream of this file (DTOs, the frontend) only ever sees "#" notation.
 */
const PRISMA_TO_DISPLAY_MUSICAL_KEY: Record<MusicalKey, string> = {
  C: 'C',
  Cm: 'Cm',
  CSharp: 'C#',
  CSharpm: 'C#m',
  D: 'D',
  Dm: 'Dm',
  DSharp: 'D#',
  DSharpm: 'D#m',
  E: 'E',
  Em: 'Em',
  F: 'F',
  Fm: 'Fm',
  FSharp: 'F#',
  FSharpm: 'F#m',
  G: 'G',
  Gm: 'Gm',
  GSharp: 'G#',
  GSharpm: 'G#m',
  A: 'A',
  Am: 'Am',
  ASharp: 'A#',
  ASharpm: 'A#m',
  B: 'B',
  Bm: 'Bm',
};

const DISPLAY_TO_PRISMA_MUSICAL_KEY: Record<string, MusicalKey> =
  Object.fromEntries(
    Object.entries(PRISMA_TO_DISPLAY_MUSICAL_KEY).map(
      ([prismaKey, display]) => [display, prismaKey as MusicalKey],
    ),
  );

/** Converts a Prisma-stored musical key (e.g. `CSharp`) to display notation (`C#`). */
export function toDisplayMusicalKey(key: MusicalKey): string {
  return PRISMA_TO_DISPLAY_MUSICAL_KEY[key];
}

/** Converts a display-notation musical key (e.g. `C#`) to the Prisma enum value (`CSharp`). */
export function toPrismaMusicalKey(display: string): MusicalKey {
  const key = DISPLAY_TO_PRISMA_MUSICAL_KEY[display];

  if (!key) {
    throw new Error(`Unknown musical key: "${display}"`);
  }

  return key;
}

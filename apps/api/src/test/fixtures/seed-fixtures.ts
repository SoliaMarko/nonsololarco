/**
 * Deterministic test fixtures for integration tests.
 *
 * Every ID, name, and value is hardcoded so assertions can reference them
 * directly without querying the DB for "the user we just created". No faker,
 * no randomness — tests must be reproducible.
 */
import { PrismaClient } from '@nonsololarco/db';

// ---------------------------------------------------------------------------
// IDs — exported so tests can reference them in assertions
// ---------------------------------------------------------------------------

export const USER_SOLOMIIA = 'user-sol-fixture';
export const USER_ANNA = 'user-anna-fixture';

export const BAND_QUIET_YARD = 'band-quiet-yard-fixture';
export const BAND_NIGHT_OWLS = 'band-night-owls-fixture';

export const TRACK_BAND_1 = 'track-band-1';
export const TRACK_BAND_2 = 'track-band-2';
export const TRACK_BAND_3 = 'track-band-3';
export const TRACK_SOLO_1 = 'track-solo-1';
export const TRACK_SOLO_2 = 'track-solo-2';
export const TRACK_OWLS_1 = 'track-owls-1';

// ---------------------------------------------------------------------------
// Seed helpers — each seeds one entity type
// ---------------------------------------------------------------------------

async function seedUsers(prisma: PrismaClient): Promise<void> {
  await prisma.user.createMany({
    data: [
      { id: USER_SOLOMIIA, name: 'Solomiia', email: 'sol@test.local' },
      { id: USER_ANNA, name: 'Anna', email: 'anna@test.local' },
    ],
  });
}

async function seedBands(prisma: PrismaClient): Promise<void> {
  await prisma.band.createMany({
    data: [
      { id: BAND_QUIET_YARD, name: 'Quiet Yard' },
      { id: BAND_NIGHT_OWLS, name: 'Night Owls' },
    ],
  });

  await prisma.bandMember.createMany({
    data: [
      { userId: USER_SOLOMIIA, bandId: BAND_QUIET_YARD, role: 'vocalist' },
      { userId: USER_ANNA, bandId: BAND_QUIET_YARD, role: 'guitarist' },
      { userId: USER_ANNA, bandId: BAND_NIGHT_OWLS, role: 'vocalist' },
    ],
  });
}

async function seedQuietYardTracks(prisma: PrismaClient): Promise<void> {
  await prisma.track.createMany({
    data: [
      {
        id: TRACK_BAND_1,
        order: 1,
        title: 'Yard in the fog',
        side: 'a',
        musicalKey: 'Am',
        bpm: 68,
        status: 'ready',
        durationSeconds: 190,
        leadMemberId: USER_SOLOMIIA,
        bandId: BAND_QUIET_YARD,
      },
      {
        id: TRACK_BAND_2,
        order: 2,
        title: 'Walls of brick',
        side: 'a',
        musicalKey: 'CSharp',
        bpm: 80,
        status: 'learning',
        durationSeconds: 175,
        leadMemberId: USER_ANNA,
        bandId: BAND_QUIET_YARD,
      },
      {
        id: TRACK_BAND_3,
        order: 3,
        title: 'Archived melody',
        side: 'b',
        musicalKey: 'Dm',
        bpm: 120,
        status: 'archived',
        durationSeconds: 240,
        leadMemberId: USER_SOLOMIIA,
        bandId: BAND_QUIET_YARD,
      },
    ],
  });
}

async function seedSoloTracks(prisma: PrismaClient): Promise<void> {
  await prisma.track.createMany({
    data: [
      {
        id: TRACK_SOLO_1,
        order: 1,
        title: 'Alone in the rain',
        side: 'a',
        musicalKey: 'Em',
        bpm: 72,
        status: 'new',
        durationSeconds: 260,
        leadMemberId: USER_SOLOMIIA,
        bandId: null,
      },
      {
        id: TRACK_SOLO_2,
        order: 2,
        title: 'Morning light',
        side: 'a',
        musicalKey: 'G',
        bpm: 90,
        status: 'ready',
        durationSeconds: 150,
        leadMemberId: USER_SOLOMIIA,
        bandId: null,
      },
    ],
  });
}

async function seedNightOwlsTracks(prisma: PrismaClient): Promise<void> {
  await prisma.track.createMany({
    data: [
      {
        id: TRACK_OWLS_1,
        order: 1,
        title: 'Midnight whisper',
        side: 'a',
        musicalKey: 'FSharp',
        bpm: 95,
        status: 'learning',
        durationSeconds: 225,
        leadMemberId: USER_ANNA,
        bandId: BAND_NIGHT_OWLS,
      },
    ],
  });
}

async function seedPerformers(prisma: PrismaClient): Promise<void> {
  await prisma.trackPerformer.createMany({
    data: [
      // Anna also performs on Yard in the fog (Solomiia leads)
      { trackId: TRACK_BAND_1, userId: USER_ANNA },
      // Solomiia also performs on Walls of brick (Anna leads)
      { trackId: TRACK_BAND_2, userId: USER_SOLOMIIA },
    ],
  });
}

// ---------------------------------------------------------------------------
// Main seed — composes the helpers above
// ---------------------------------------------------------------------------

/** Seeds all fixtures in FK-safe order. */
export async function seedFixtures(prisma: PrismaClient): Promise<void> {
  await seedUsers(prisma);
  await seedBands(prisma);
  await seedQuietYardTracks(prisma);
  await seedSoloTracks(prisma);
  await seedNightOwlsTracks(prisma);
  await seedPerformers(prisma);
}

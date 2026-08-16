import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

import { MusicalKey, PrismaClient, TrackSide, TrackStatus } from '../generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // --- Users ---
  // Upserted by email (already @unique) so re-running the seed never
  // duplicates rows or errors on a second run.
  // Use the real OAuth user if they already exist, otherwise create a seed user.
  // This ensures tracks are linked to the actual logged-in account.
  const devEmail = process.env.SEED_USER_EMAIL;
  const existingUser = devEmail
    ? await prisma.user.findUnique({ where: { email: devEmail } })
    : null;

  const solomiia = existingUser
    ? existingUser
    : await prisma.user.upsert({
        where: { email: 'solomiia@example.com' },
        update: {},
        create: { email: 'solomiia@example.com', name: 'Solomiia' },
      });
  const anna = await prisma.user.upsert({
    where: { email: 'anna@example.com' },
    update: {},
    create: { email: 'anna@example.com', name: 'Anna' },
  });
  const jared = await prisma.user.upsert({
    where: { email: 'jared@example.com' },
    update: {},
    create: { email: 'jared@example.com', name: 'Jared' },
  });
  const artem = await prisma.user.upsert({
    where: { email: 'artem@example.com' },
    update: {},
    create: { email: 'artem@example.com', name: 'Artem' },
  });

  // --- Bands ---
  // Band has no natural unique field, so seed rows get fixed, readable ids
  // and are upserted by id. Bands created through the app still get a
  // random cuid() as usual — this fixed-id pattern is only for seed data.
  const quietYard = await prisma.band.upsert({
    where: { id: 'band-quiet-yard' },
    update: {},
    create: { id: 'band-quiet-yard', name: 'Quiet Yard' },
  });
  const nightShift = await prisma.band.upsert({
    where: { id: 'band-night-shift' },
    update: {},
    create: { id: 'band-night-shift', name: 'Night Shift' },
  });
  const brokenGlass = await prisma.band.upsert({
    where: { id: 'band-broken-glass' },
    update: {},
    create: { id: 'band-broken-glass', name: 'Broken Glass' },
  });
  const dreamyGarden = await prisma.band.upsert({
    where: { id: 'band-dreamy-garden' },
    update: {},
    create: { id: 'band-dreamy-garden', name: 'Dreamy Garden' },
  });
  const pumpkinSquare = await prisma.band.upsert({
    where: { id: 'band-pumpkin-square' },
    update: {},
    create: { id: 'band-pumpkin-square', name: 'Pumpkin Square' },
  });
  const jellyfish = await prisma.band.upsert({
    where: { id: 'band-jellyfish' },
    update: {},
    create: { id: 'band-jellyfish', name: 'Jellyfish' },
  });

  // --- Band memberships ---
  // BandMember already has a @@unique([userId, bandId]), so upsert on that
  // composite key is idempotent without needing a fixed id.
  const memberships = [
    { userId: solomiia.id, bandId: quietYard.id, role: 'back vocal' },
    { userId: anna.id, bandId: quietYard.id, role: 'keys' },
    { userId: jared.id, bandId: quietYard.id, role: 'guitar' },
    { userId: artem.id, bandId: quietYard.id, role: 'drums' },

    { userId: solomiia.id, bandId: nightShift.id, role: 'covers' },
    { userId: anna.id, bandId: nightShift.id, role: 'vocal' },
    { userId: jared.id, bandId: nightShift.id, role: 'guitar' },
    { userId: artem.id, bandId: nightShift.id, role: 'bass' },

    { userId: solomiia.id, bandId: brokenGlass.id, role: 'back vocal' },
    { userId: anna.id, bandId: brokenGlass.id, role: 'keys' },
    { userId: jared.id, bandId: brokenGlass.id, role: 'guitar' },
    { userId: artem.id, bandId: brokenGlass.id, role: 'drums' },

    { userId: solomiia.id, bandId: dreamyGarden.id, role: 'covers' },
    { userId: anna.id, bandId: dreamyGarden.id, role: 'vocal' },
    { userId: jared.id, bandId: dreamyGarden.id, role: 'acoustic' },
    { userId: artem.id, bandId: dreamyGarden.id, role: 'keys' },

    { userId: solomiia.id, bandId: pumpkinSquare.id, role: 'back vocal' },
    { userId: anna.id, bandId: pumpkinSquare.id, role: 'vocal' },
    { userId: jared.id, bandId: pumpkinSquare.id, role: 'guitar' },
    { userId: artem.id, bandId: pumpkinSquare.id, role: 'drums' },

    { userId: solomiia.id, bandId: jellyfish.id, role: 'covers' },
    { userId: artem.id, bandId: jellyfish.id, role: 'keys' },
  ];

  for (const membership of memberships) {
    await prisma.bandMember.upsert({
      where: {
        userId_bandId: {
          userId: membership.userId,
          bandId: membership.bandId,
        },
      },
      update: { role: membership.role },
      create: membership,
    });
  }

  // --- Tracks ---
  // Fixed ids (like bands above) so re-running the seed upserts in place
  // instead of creating duplicates.
  type TrackSeed = {
    id: string;
    order: number;
    title: string;
    leadMemberId: string;
    bandId?: string;
    side: TrackSide;
    musicalKey: MusicalKey;
    bpm: number;
    status: TrackStatus;
    duration: string;
  };

  const tracks: TrackSeed[] = [
    // Quiet Yard (6 tracks, 5 ready)
    {
      id: 'track-quiet-yard-1',
      order: 1,
      title: 'Yard in the fog',
      leadMemberId: solomiia.id,
      bandId: quietYard.id,
      side: 'a',
      musicalKey: 'Am',
      bpm: 68,
      status: 'ready',
      duration: '3:10',
    },
    {
      id: 'track-quiet-yard-2',
      order: 2,
      title: 'Walls of brick',
      leadMemberId: anna.id,
      bandId: quietYard.id,
      side: 'a',
      musicalKey: 'Dm',
      bpm: 80,
      status: 'ready',
      duration: '2:55',
    },
    {
      id: 'track-quiet-yard-3',
      order: 3,
      title: 'Lamps in the kitchen',
      leadMemberId: jared.id,
      bandId: quietYard.id,
      side: 'a',
      musicalKey: 'C',
      bpm: 96,
      status: 'ready',
      duration: '3:05',
    },
    {
      id: 'track-quiet-yard-4',
      order: 4,
      title: 'Outside of time',
      leadMemberId: artem.id,
      bandId: quietYard.id,
      side: 'a',
      musicalKey: 'Em',
      bpm: 74,
      status: 'ready',
      duration: '3:40',
    },
    {
      id: 'track-quiet-yard-5',
      order: 5,
      title: 'First snow',
      leadMemberId: solomiia.id,
      bandId: quietYard.id,
      side: 'b',
      musicalKey: 'G',
      bpm: 72,
      status: 'ready',
      duration: '3:15',
    },
    {
      id: 'track-quiet-yard-6',
      order: 6,
      title: 'Yards of childhood',
      leadMemberId: anna.id,
      bandId: quietYard.id,
      side: 'b',
      musicalKey: 'F',
      bpm: 88,
      status: 'archived',
      duration: '3:00',
    },

    // Night Shift (8 tracks, 3 ready)
    {
      id: 'track-night-shift-1',
      order: 1,
      title: 'Smoke over the city',
      leadMemberId: solomiia.id,
      bandId: nightShift.id,
      side: 'a',
      musicalKey: 'F',
      bpm: 96,
      status: 'ready',
      duration: '4:05',
    },
    {
      id: 'track-night-shift-2',
      order: 2,
      title: 'Falling stars',
      leadMemberId: solomiia.id,
      bandId: nightShift.id,
      side: 'a',
      musicalKey: 'G',
      bpm: 84,
      status: 'new',
      duration: '4:30',
    },
    {
      id: 'track-night-shift-3',
      order: 3,
      title: 'Midnight bus',
      leadMemberId: anna.id,
      bandId: nightShift.id,
      side: 'a',
      musicalKey: 'Dm',
      bpm: 78,
      status: 'learning',
      duration: '3:55',
    },
    {
      id: 'track-night-shift-4',
      order: 4,
      title: 'Cold neon',
      leadMemberId: jared.id,
      bandId: nightShift.id,
      side: 'a',
      musicalKey: 'Am',
      bpm: 68,
      status: 'learning',
      duration: '3:40',
    },
    {
      id: 'track-night-shift-5',
      order: 5,
      title: 'Echoes in the tunnel',
      leadMemberId: artem.id,
      bandId: nightShift.id,
      side: 'b',
      musicalKey: 'Em',
      bpm: 90,
      status: 'ready',
      duration: '4:10',
    },
    {
      id: 'track-night-shift-6',
      order: 6,
      title: 'Paper lanterns',
      leadMemberId: jared.id,
      bandId: nightShift.id,
      side: 'b',
      musicalKey: 'C',
      bpm: 76,
      status: 'learning',
      duration: '3:25',
    },
    {
      id: 'track-night-shift-7',
      order: 7,
      title: 'Last ferry home',
      leadMemberId: anna.id,
      bandId: nightShift.id,
      side: 'b',
      musicalKey: 'F',
      bpm: 82,
      status: 'ready',
      duration: '4:00',
    },
    {
      id: 'track-night-shift-8',
      order: 8,
      title: 'Streetlight confessions',
      leadMemberId: artem.id,
      bandId: nightShift.id,
      side: 'b',
      musicalKey: 'G',
      bpm: 88,
      status: 'archived',
      duration: '4:15',
    },

    // Broken Glass (6 tracks, 5 ready)
    {
      id: 'track-broken-glass-1',
      order: 1,
      title: 'Cracked windows',
      leadMemberId: solomiia.id,
      bandId: brokenGlass.id,
      side: 'a',
      musicalKey: 'E',
      bpm: 112,
      status: 'ready',
      duration: '2:58',
    },
    {
      id: 'track-broken-glass-2',
      order: 2,
      title: 'Glass hearts',
      leadMemberId: solomiia.id,
      bandId: brokenGlass.id,
      side: 'a',
      musicalKey: 'GSharp',
      bpm: 106,
      status: 'ready',
      duration: '3:05',
    },
    {
      id: 'track-broken-glass-3',
      order: 3,
      title: 'Shattered dawn',
      leadMemberId: anna.id,
      bandId: brokenGlass.id,
      side: 'a',
      musicalKey: 'Bm',
      bpm: 98,
      status: 'ready',
      duration: '3:20',
    },
    {
      id: 'track-broken-glass-4',
      order: 4,
      title: 'Splinters',
      leadMemberId: jared.id,
      bandId: brokenGlass.id,
      side: 'b',
      musicalKey: 'A',
      bpm: 120,
      status: 'ready',
      duration: '2:45',
    },
    {
      id: 'track-broken-glass-5',
      order: 5,
      title: 'Mirror fragments',
      leadMemberId: artem.id,
      bandId: brokenGlass.id,
      side: 'b',
      musicalKey: 'Dm',
      bpm: 92,
      status: 'ready',
      duration: '3:30',
    },
    {
      id: 'track-broken-glass-6',
      order: 6,
      title: 'Transparent walls',
      leadMemberId: anna.id,
      bandId: brokenGlass.id,
      side: 'b',
      musicalKey: 'FSharpm',
      bpm: 86,
      status: 'new',
      duration: '3:15',
    },

    // Dreamy Garden (14 tracks, 5 ready)
    {
      id: 'track-dreamy-garden-1',
      order: 1,
      title: 'Garden at dusk',
      leadMemberId: solomiia.id,
      bandId: dreamyGarden.id,
      side: 'a',
      musicalKey: 'A',
      bpm: 74,
      status: 'ready',
      duration: '3:41',
    },
    {
      id: 'track-dreamy-garden-2',
      order: 2,
      title: 'Morning dew',
      leadMemberId: solomiia.id,
      bandId: dreamyGarden.id,
      side: 'a',
      musicalKey: 'G',
      bpm: 64,
      status: 'ready',
      duration: '4:20',
    },
    {
      id: 'track-dreamy-garden-3',
      order: 3,
      title: 'Secret meadow',
      leadMemberId: anna.id,
      bandId: dreamyGarden.id,
      side: 'a',
      musicalKey: 'F',
      bpm: 68,
      status: 'new',
      duration: '3:50',
    },
    {
      id: 'track-dreamy-garden-4',
      order: 4,
      title: 'Petals in the wind',
      leadMemberId: jared.id,
      bandId: dreamyGarden.id,
      side: 'a',
      musicalKey: 'C',
      bpm: 72,
      status: 'learning',
      duration: '4:05',
    },
    {
      id: 'track-dreamy-garden-5',
      order: 5,
      title: 'Overgrown path',
      leadMemberId: artem.id,
      bandId: dreamyGarden.id,
      side: 'a',
      musicalKey: 'Em',
      bpm: 80,
      status: 'learning',
      duration: '3:55',
    },
    {
      id: 'track-dreamy-garden-6',
      order: 6,
      title: 'Greenhouse waltz',
      leadMemberId: anna.id,
      bandId: dreamyGarden.id,
      side: 'a',
      musicalKey: 'Dm',
      bpm: 58,
      status: 'ready',
      duration: '4:30',
    },
    {
      id: 'track-dreamy-garden-7',
      order: 7,
      title: 'Sunflower row',
      leadMemberId: jared.id,
      bandId: dreamyGarden.id,
      side: 'a',
      musicalKey: 'D',
      bpm: 76,
      status: 'learning',
      duration: '3:35',
    },
    {
      id: 'track-dreamy-garden-8',
      order: 8,
      title: 'Willow shade',
      leadMemberId: solomiia.id,
      bandId: dreamyGarden.id,
      side: 'b',
      musicalKey: 'Am',
      bpm: 66,
      status: 'ready',
      duration: '4:10',
    },
    {
      id: 'track-dreamy-garden-9',
      order: 9,
      title: 'Rain on the roses',
      leadMemberId: artem.id,
      bandId: dreamyGarden.id,
      side: 'b',
      musicalKey: 'Bm',
      bpm: 70,
      status: 'learning',
      duration: '3:45',
    },
    {
      id: 'track-dreamy-garden-10',
      order: 10,
      title: 'Ivy walls',
      leadMemberId: anna.id,
      bandId: dreamyGarden.id,
      side: 'b',
      musicalKey: 'G',
      bpm: 84,
      status: 'new',
      duration: '3:20',
    },
    {
      id: 'track-dreamy-garden-11',
      order: 11,
      title: 'Mossy stones',
      leadMemberId: jared.id,
      bandId: dreamyGarden.id,
      side: 'b',
      musicalKey: 'F',
      bpm: 62,
      status: 'archived',
      duration: '4:15',
    },
    {
      id: 'track-dreamy-garden-12',
      order: 12,
      title: 'Firefly clearing',
      leadMemberId: artem.id,
      bandId: dreamyGarden.id,
      side: 'b',
      musicalKey: 'C',
      bpm: 78,
      status: 'learning',
      duration: '3:30',
    },
    {
      id: 'track-dreamy-garden-13',
      order: 13,
      title: 'Late bloom',
      leadMemberId: solomiia.id,
      bandId: dreamyGarden.id,
      side: 'b',
      musicalKey: 'E',
      bpm: 88,
      status: 'ready',
      duration: '3:50',
    },
    {
      id: 'track-dreamy-garden-14',
      order: 14,
      title: 'Frost on the leaves',
      leadMemberId: anna.id,
      bandId: dreamyGarden.id,
      side: 'b',
      musicalKey: 'A',
      bpm: 56,
      status: 'new',
      duration: '5:20',
    },

    // Pumpkin Square (9 tracks, 7 ready)
    {
      id: 'track-pumpkin-square-1',
      order: 1,
      title: 'October wind',
      leadMemberId: solomiia.id,
      bandId: pumpkinSquare.id,
      side: 'a',
      musicalKey: 'CSharp',
      bpm: 100,
      status: 'ready',
      duration: '3:19',
    },
    {
      id: 'track-pumpkin-square-2',
      order: 2,
      title: 'Autumn leaves',
      leadMemberId: solomiia.id,
      bandId: pumpkinSquare.id,
      side: 'a',
      musicalKey: 'D',
      bpm: 96,
      status: 'ready',
      duration: '3:25',
    },
    {
      id: 'track-pumpkin-square-3',
      order: 3,
      title: 'Harvest moon',
      leadMemberId: anna.id,
      bandId: pumpkinSquare.id,
      side: 'a',
      musicalKey: 'G',
      bpm: 78,
      status: 'ready',
      duration: '3:50',
    },
    {
      id: 'track-pumpkin-square-4',
      order: 4,
      title: 'Scarecrow waltz',
      leadMemberId: jared.id,
      bandId: pumpkinSquare.id,
      side: 'a',
      musicalKey: 'Am',
      bpm: 66,
      status: 'ready',
      duration: '4:00',
    },
    {
      id: 'track-pumpkin-square-5',
      order: 5,
      title: 'Cider press',
      leadMemberId: artem.id,
      bandId: pumpkinSquare.id,
      side: 'a',
      musicalKey: 'F',
      bpm: 84,
      status: 'ready',
      duration: '3:10',
    },
    {
      id: 'track-pumpkin-square-6',
      order: 6,
      title: 'Foggy orchard',
      leadMemberId: anna.id,
      bandId: pumpkinSquare.id,
      side: 'b',
      musicalKey: 'Em',
      bpm: 72,
      status: 'ready',
      duration: '3:35',
    },
    {
      id: 'track-pumpkin-square-7',
      order: 7,
      title: 'Bonfire stories',
      leadMemberId: jared.id,
      bandId: pumpkinSquare.id,
      side: 'b',
      musicalKey: 'Dm',
      bpm: 90,
      status: 'ready',
      duration: '3:45',
    },
    {
      id: 'track-pumpkin-square-8',
      order: 8,
      title: 'Pumpkin lantern',
      leadMemberId: solomiia.id,
      bandId: pumpkinSquare.id,
      side: 'b',
      musicalKey: 'C',
      bpm: 104,
      status: 'new',
      duration: '2:55',
    },
    {
      id: 'track-pumpkin-square-9',
      order: 9,
      title: 'First frost',
      leadMemberId: artem.id,
      bandId: pumpkinSquare.id,
      side: 'b',
      musicalKey: 'B',
      bpm: 68,
      status: 'archived',
      duration: '4:20',
    },

    // Jellyfish (2 tracks, 0 ready)
    {
      id: 'track-jellyfish-1',
      order: 1,
      title: 'Deep current',
      leadMemberId: solomiia.id,
      bandId: jellyfish.id,
      side: 'a',
      musicalKey: 'Fm',
      bpm: 54,
      status: 'new',
      duration: '5:10',
    },
    {
      id: 'track-jellyfish-2',
      order: 2,
      title: 'Bioluminescence',
      leadMemberId: artem.id,
      bandId: jellyfish.id,
      side: 'a',
      musicalKey: 'Cm',
      bpm: 48,
      status: 'learning',
      duration: '4:50',
    },

    // Solo tracks (no band) — Solomiia's personal repertoire
    {
      id: 'track-solo-1',
      order: 1,
      title: 'Alone on the rooftop',
      leadMemberId: solomiia.id,
      side: 'a',
      musicalKey: 'Am',
      bpm: 72,
      status: 'ready',
      duration: '3:45',
    },
    {
      id: 'track-solo-2',
      order: 2,
      title: 'Morning pages',
      leadMemberId: solomiia.id,
      side: 'a',
      musicalKey: 'G',
      bpm: 66,
      status: 'ready',
      duration: '4:10',
    },
    {
      id: 'track-solo-3',
      order: 3,
      title: 'Unfinished letter',
      leadMemberId: solomiia.id,
      side: 'a',
      musicalKey: 'Dm',
      bpm: 80,
      status: 'learning',
      duration: '3:30',
    },
    {
      id: 'track-solo-4',
      order: 4,
      title: 'Paper airplane',
      leadMemberId: solomiia.id,
      side: 'b',
      musicalKey: 'C',
      bpm: 94,
      status: 'new',
      duration: '2:55',
    },
  ];

  for (const { id, ...data } of tracks) {
    await prisma.track.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
  }

  // --- Track performers (additional members beyond the lead) ---
  // The lead member is implicitly a performer — these rows add other participants.
  const performers: { trackId: string; userId: string }[] = [
    // Quiet Yard — solomiia performs on tracks she doesn't lead
    { trackId: 'track-quiet-yard-2', userId: solomiia.id },
    { trackId: 'track-quiet-yard-3', userId: solomiia.id },
    { trackId: 'track-quiet-yard-4', userId: anna.id },

    // Night Shift — multiple performers on several tracks
    { trackId: 'track-night-shift-3', userId: solomiia.id },
    { trackId: 'track-night-shift-4', userId: solomiia.id },
    { trackId: 'track-night-shift-5', userId: solomiia.id },
    { trackId: 'track-night-shift-7', userId: jared.id },

    // Broken Glass
    { trackId: 'track-broken-glass-3', userId: solomiia.id },
    { trackId: 'track-broken-glass-4', userId: anna.id },
    { trackId: 'track-broken-glass-5', userId: jared.id },

    // Dreamy Garden — solomiia on several she doesn't lead
    { trackId: 'track-dreamy-garden-3', userId: solomiia.id },
    { trackId: 'track-dreamy-garden-4', userId: solomiia.id },
    { trackId: 'track-dreamy-garden-6', userId: solomiia.id },
    { trackId: 'track-dreamy-garden-9', userId: anna.id },
    { trackId: 'track-dreamy-garden-12', userId: solomiia.id },

    // Pumpkin Square
    { trackId: 'track-pumpkin-square-3', userId: solomiia.id },
    { trackId: 'track-pumpkin-square-4', userId: solomiia.id },
    { trackId: 'track-pumpkin-square-7', userId: anna.id },
  ];

  for (const performer of performers) {
    await prisma.trackPerformer.upsert({
      where: {
        trackId_userId: {
          trackId: performer.trackId,
          userId: performer.userId,
        },
      },
      update: {},
      create: performer,
    });
  }

  const counts = await Promise.all([
    prisma.user.count(),
    prisma.band.count(),
    prisma.bandMember.count(),
    prisma.track.count(),
    prisma.trackPerformer.count(),
  ]);

  console.log(
    `Seeded: ${counts[0]} users, ${counts[1]} bands, ${counts[2]} memberships, ${counts[3]} tracks, ${counts[4]} performers`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

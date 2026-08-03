import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TrackStatus } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // --- Users ---
  const solomiia = await prisma.user.create({
    data: { name: "Solomiia" },
  });
  const anna = await prisma.user.create({
    data: { name: "Anna" },
  });
  const jared = await prisma.user.create({
    data: { name: "Jared" },
  });
  const artem = await prisma.user.create({
    data: { name: "Artem" },
  });

  // --- Bands ---
  const quietYard = await prisma.band.create({
    data: { name: "Quiet Yard" },
  });
  const nightShift = await prisma.band.create({
    data: { name: "Night Shift" },
  });
  const brokenGlass = await prisma.band.create({
    data: { name: "Broken Glass" },
  });
  const dreamyGarden = await prisma.band.create({
    data: { name: "Dreamy Garden" },
  });
  const pumpkinSquare = await prisma.band.create({
    data: { name: "Pumpkin Square" },
  });
  const jellyfish = await prisma.band.create({
    data: { name: "Jellyfish" },
  });

  // --- Band memberships ---
  const memberships = [
    { userId: solomiia.id, bandId: quietYard.id, role: "back vocal" },
    { userId: anna.id, bandId: quietYard.id, role: "keys" },
    { userId: jared.id, bandId: quietYard.id, role: "guitar" },
    { userId: artem.id, bandId: quietYard.id, role: "drums" },

    { userId: solomiia.id, bandId: nightShift.id, role: "covers" },
    { userId: anna.id, bandId: nightShift.id, role: "vocal" },
    { userId: jared.id, bandId: nightShift.id, role: "guitar" },
    { userId: artem.id, bandId: nightShift.id, role: "bass" },

    { userId: solomiia.id, bandId: brokenGlass.id, role: "back vocal" },
    { userId: anna.id, bandId: brokenGlass.id, role: "keys" },
    { userId: jared.id, bandId: brokenGlass.id, role: "guitar" },
    { userId: artem.id, bandId: brokenGlass.id, role: "drums" },

    { userId: solomiia.id, bandId: dreamyGarden.id, role: "covers" },
    { userId: anna.id, bandId: dreamyGarden.id, role: "vocal" },
    { userId: jared.id, bandId: dreamyGarden.id, role: "acoustic" },
    { userId: artem.id, bandId: dreamyGarden.id, role: "keys" },

    { userId: solomiia.id, bandId: pumpkinSquare.id, role: "back vocal" },
    { userId: anna.id, bandId: pumpkinSquare.id, role: "vocal" },
    { userId: jared.id, bandId: pumpkinSquare.id, role: "guitar" },
    { userId: artem.id, bandId: pumpkinSquare.id, role: "drums" },

    { userId: solomiia.id, bandId: jellyfish.id, role: "covers" },
    { userId: artem.id, bandId: jellyfish.id, role: "keys" },
  ];

  await prisma.bandMember.createMany({ data: memberships });

  // --- Tracks ---
  // Helper to keep track definitions compact
  type TrackSeed = {
    order: number;
    title: string;
    leadMemberId: string;
    bandId: string;
    side: string;
    musicalKey: string;
    bpm: number;
    status: TrackStatus;
    duration: string;
  };

  const tracks: TrackSeed[] = [
    // Quiet Yard (6 tracks, 5 ready)
    {
      order: 1,
      title: "Yard in the fog",
      leadMemberId: solomiia.id,
      bandId: quietYard.id,
      side: "a",
      musicalKey: "Am",
      bpm: 68,
      status: "ready",
      duration: "3:10",
    },
    {
      order: 2,
      title: "Walls of brick",
      leadMemberId: anna.id,
      bandId: quietYard.id,
      side: "a",
      musicalKey: "Dm",
      bpm: 80,
      status: "ready",
      duration: "2:55",
    },
    {
      order: 3,
      title: "Lamps in the kitchen",
      leadMemberId: jared.id,
      bandId: quietYard.id,
      side: "a",
      musicalKey: "C",
      bpm: 96,
      status: "ready",
      duration: "3:05",
    },
    {
      order: 4,
      title: "Outside of time",
      leadMemberId: artem.id,
      bandId: quietYard.id,
      side: "a",
      musicalKey: "Em",
      bpm: 74,
      status: "ready",
      duration: "3:40",
    },
    {
      order: 5,
      title: "First snow",
      leadMemberId: solomiia.id,
      bandId: quietYard.id,
      side: "b",
      musicalKey: "G",
      bpm: 72,
      status: "ready",
      duration: "3:15",
    },
    {
      order: 6,
      title: "Yards of childhood",
      leadMemberId: anna.id,
      bandId: quietYard.id,
      side: "b",
      musicalKey: "F",
      bpm: 88,
      status: "learning",
      duration: "3:00",
    },

    // Night Shift (8 tracks, 3 ready)
    {
      order: 1,
      title: "Smoke over the city",
      leadMemberId: solomiia.id,
      bandId: nightShift.id,
      side: "a",
      musicalKey: "F",
      bpm: 96,
      status: "ready",
      duration: "4:05",
    },
    {
      order: 2,
      title: "Falling stars",
      leadMemberId: solomiia.id,
      bandId: nightShift.id,
      side: "a",
      musicalKey: "G",
      bpm: 84,
      status: "new",
      duration: "4:30",
    },
    {
      order: 3,
      title: "Midnight bus",
      leadMemberId: anna.id,
      bandId: nightShift.id,
      side: "a",
      musicalKey: "Dm",
      bpm: 78,
      status: "learning",
      duration: "3:55",
    },
    {
      order: 4,
      title: "Cold neon",
      leadMemberId: jared.id,
      bandId: nightShift.id,
      side: "a",
      musicalKey: "Am",
      bpm: 68,
      status: "learning",
      duration: "3:40",
    },
    {
      order: 5,
      title: "Echoes in the tunnel",
      leadMemberId: artem.id,
      bandId: nightShift.id,
      side: "b",
      musicalKey: "Em",
      bpm: 90,
      status: "ready",
      duration: "4:10",
    },
    {
      order: 6,
      title: "Paper lanterns",
      leadMemberId: jared.id,
      bandId: nightShift.id,
      side: "b",
      musicalKey: "C",
      bpm: 76,
      status: "learning",
      duration: "3:25",
    },
    {
      order: 7,
      title: "Last ferry home",
      leadMemberId: anna.id,
      bandId: nightShift.id,
      side: "b",
      musicalKey: "F",
      bpm: 82,
      status: "ready",
      duration: "4:00",
    },
    {
      order: 8,
      title: "Streetlight confessions",
      leadMemberId: artem.id,
      bandId: nightShift.id,
      side: "b",
      musicalKey: "G",
      bpm: 88,
      status: "learning",
      duration: "4:15",
    },

    // Broken Glass (6 tracks, 5 ready)
    {
      order: 1,
      title: "Cracked windows",
      leadMemberId: solomiia.id,
      bandId: brokenGlass.id,
      side: "a",
      musicalKey: "E",
      bpm: 112,
      status: "ready",
      duration: "2:58",
    },
    {
      order: 2,
      title: "Glass hearts",
      leadMemberId: solomiia.id,
      bandId: brokenGlass.id,
      side: "a",
      musicalKey: "G#",
      bpm: 106,
      status: "ready",
      duration: "3:05",
    },
    {
      order: 3,
      title: "Shattered dawn",
      leadMemberId: anna.id,
      bandId: brokenGlass.id,
      side: "a",
      musicalKey: "Bm",
      bpm: 98,
      status: "ready",
      duration: "3:20",
    },
    {
      order: 4,
      title: "Splinters",
      leadMemberId: jared.id,
      bandId: brokenGlass.id,
      side: "b",
      musicalKey: "A",
      bpm: 120,
      status: "ready",
      duration: "2:45",
    },
    {
      order: 5,
      title: "Mirror fragments",
      leadMemberId: artem.id,
      bandId: brokenGlass.id,
      side: "b",
      musicalKey: "Dm",
      bpm: 92,
      status: "ready",
      duration: "3:30",
    },
    {
      order: 6,
      title: "Transparent walls",
      leadMemberId: anna.id,
      bandId: brokenGlass.id,
      side: "b",
      musicalKey: "F#m",
      bpm: 86,
      status: "new",
      duration: "3:15",
    },

    // Dreamy Garden (14 tracks, 5 ready)
    {
      order: 1,
      title: "Garden at dusk",
      leadMemberId: solomiia.id,
      bandId: dreamyGarden.id,
      side: "a",
      musicalKey: "A",
      bpm: 74,
      status: "ready",
      duration: "3:41",
    },
    {
      order: 2,
      title: "Morning dew",
      leadMemberId: solomiia.id,
      bandId: dreamyGarden.id,
      side: "a",
      musicalKey: "G",
      bpm: 64,
      status: "ready",
      duration: "4:20",
    },
    {
      order: 3,
      title: "Secret meadow",
      leadMemberId: anna.id,
      bandId: dreamyGarden.id,
      side: "a",
      musicalKey: "F",
      bpm: 68,
      status: "new",
      duration: "3:50",
    },
    {
      order: 4,
      title: "Petals in the wind",
      leadMemberId: jared.id,
      bandId: dreamyGarden.id,
      side: "a",
      musicalKey: "C",
      bpm: 72,
      status: "learning",
      duration: "4:05",
    },
    {
      order: 5,
      title: "Overgrown path",
      leadMemberId: artem.id,
      bandId: dreamyGarden.id,
      side: "a",
      musicalKey: "Em",
      bpm: 80,
      status: "learning",
      duration: "3:55",
    },
    {
      order: 6,
      title: "Greenhouse waltz",
      leadMemberId: anna.id,
      bandId: dreamyGarden.id,
      side: "a",
      musicalKey: "Dm",
      bpm: 58,
      status: "ready",
      duration: "4:30",
    },
    {
      order: 7,
      title: "Sunflower row",
      leadMemberId: jared.id,
      bandId: dreamyGarden.id,
      side: "a",
      musicalKey: "D",
      bpm: 76,
      status: "learning",
      duration: "3:35",
    },
    {
      order: 8,
      title: "Willow shade",
      leadMemberId: solomiia.id,
      bandId: dreamyGarden.id,
      side: "b",
      musicalKey: "Am",
      bpm: 66,
      status: "ready",
      duration: "4:10",
    },
    {
      order: 9,
      title: "Rain on the roses",
      leadMemberId: artem.id,
      bandId: dreamyGarden.id,
      side: "b",
      musicalKey: "Bm",
      bpm: 70,
      status: "learning",
      duration: "3:45",
    },
    {
      order: 10,
      title: "Ivy walls",
      leadMemberId: anna.id,
      bandId: dreamyGarden.id,
      side: "b",
      musicalKey: "G",
      bpm: 84,
      status: "new",
      duration: "3:20",
    },
    {
      order: 11,
      title: "Mossy stones",
      leadMemberId: jared.id,
      bandId: dreamyGarden.id,
      side: "b",
      musicalKey: "F",
      bpm: 62,
      status: "learning",
      duration: "4:15",
    },
    {
      order: 12,
      title: "Firefly clearing",
      leadMemberId: artem.id,
      bandId: dreamyGarden.id,
      side: "b",
      musicalKey: "C",
      bpm: 78,
      status: "learning",
      duration: "3:30",
    },
    {
      order: 13,
      title: "Late bloom",
      leadMemberId: solomiia.id,
      bandId: dreamyGarden.id,
      side: "b",
      musicalKey: "E",
      bpm: 88,
      status: "ready",
      duration: "3:50",
    },
    {
      order: 14,
      title: "Frost on the leaves",
      leadMemberId: anna.id,
      bandId: dreamyGarden.id,
      side: "b",
      musicalKey: "A",
      bpm: 56,
      status: "new",
      duration: "5:20",
    },

    // Pumpkin Square (9 tracks, 7 ready)
    {
      order: 1,
      title: "October wind",
      leadMemberId: solomiia.id,
      bandId: pumpkinSquare.id,
      side: "a",
      musicalKey: "C#",
      bpm: 100,
      status: "ready",
      duration: "3:19",
    },
    {
      order: 2,
      title: "Autumn leaves",
      leadMemberId: solomiia.id,
      bandId: pumpkinSquare.id,
      side: "a",
      musicalKey: "D",
      bpm: 96,
      status: "ready",
      duration: "3:25",
    },
    {
      order: 3,
      title: "Harvest moon",
      leadMemberId: anna.id,
      bandId: pumpkinSquare.id,
      side: "a",
      musicalKey: "G",
      bpm: 78,
      status: "ready",
      duration: "3:50",
    },
    {
      order: 4,
      title: "Scarecrow waltz",
      leadMemberId: jared.id,
      bandId: pumpkinSquare.id,
      side: "a",
      musicalKey: "Am",
      bpm: 66,
      status: "ready",
      duration: "4:00",
    },
    {
      order: 5,
      title: "Cider press",
      leadMemberId: artem.id,
      bandId: pumpkinSquare.id,
      side: "a",
      musicalKey: "F",
      bpm: 84,
      status: "ready",
      duration: "3:10",
    },
    {
      order: 6,
      title: "Foggy orchard",
      leadMemberId: anna.id,
      bandId: pumpkinSquare.id,
      side: "b",
      musicalKey: "Em",
      bpm: 72,
      status: "ready",
      duration: "3:35",
    },
    {
      order: 7,
      title: "Bonfire stories",
      leadMemberId: jared.id,
      bandId: pumpkinSquare.id,
      side: "b",
      musicalKey: "Dm",
      bpm: 90,
      status: "ready",
      duration: "3:45",
    },
    {
      order: 8,
      title: "Pumpkin lantern",
      leadMemberId: solomiia.id,
      bandId: pumpkinSquare.id,
      side: "b",
      musicalKey: "C",
      bpm: 104,
      status: "new",
      duration: "2:55",
    },
    {
      order: 9,
      title: "First frost",
      leadMemberId: artem.id,
      bandId: pumpkinSquare.id,
      side: "b",
      musicalKey: "B",
      bpm: 68,
      status: "learning",
      duration: "4:20",
    },

    // Jellyfish (2 tracks, 0 ready)
    {
      order: 1,
      title: "Deep current",
      leadMemberId: solomiia.id,
      bandId: jellyfish.id,
      side: "a",
      musicalKey: "Fm",
      bpm: 54,
      status: "new",
      duration: "5:10",
    },
    {
      order: 2,
      title: "Bioluminescence",
      leadMemberId: artem.id,
      bandId: jellyfish.id,
      side: "a",
      musicalKey: "Cm",
      bpm: 48,
      status: "learning",
      duration: "4:50",
    },
  ];

  await prisma.track.createMany({ data: tracks });

  const counts = await Promise.all([
    prisma.user.count(),
    prisma.band.count(),
    prisma.bandMember.count(),
    prisma.track.count(),
  ]);

  console.log(
    `Seeded: ${counts[0]} users, ${counts[1]} bands, ${counts[2]} memberships, ${counts[3]} tracks`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

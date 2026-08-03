// The Prisma client generates outside src/ (see schema.prisma's generator
// output path) specifically so this relative import resolves correctly both
// when this file runs as source (ts-node/tsx) and after it's compiled to
// dist/index.js — "../generated/..." means the same thing from either
// location, since src/ and dist/ are siblings of generated/.
export { PrismaClient, Prisma } from "../generated/prisma/client.js";
export type {
  User,
  Band,
  BandMember,
  Track,
} from "../generated/prisma/client.js";
export { TrackStatus, TrackSide, MusicalKey } from "../generated/prisma/client.js";

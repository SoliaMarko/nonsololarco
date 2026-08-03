import "dotenv/config";
import { defineConfig } from "prisma/config";

// `prisma generate` (schema-only codegen, no DB connection) runs via this
// package's postinstall hook on every `pnpm install` across the whole
// workspace — including environments that never touch this package at
// runtime (e.g. Vercel building apps/web). Using env("DATABASE_URL") here
// would throw in those environments since they have no reason to set it.
// Real runtime connections go through NestJS's ConfigService.getOrThrow
// in PrismaService, which still fails loudly if actually misconfigured.
const DATABASE_URL_PLACEHOLDER =
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? DATABASE_URL_PLACEHOLDER,
  },
});

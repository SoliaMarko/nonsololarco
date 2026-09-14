/**
 * Integration test helper — spins up a real PostgreSQL container via
 * testcontainers, runs Prisma migrations, and provides a connected
 * PrismaClient for each test file.
 *
 * Usage in a test file:
 *
 *   import { getTestPrisma, setupIntegration } from 'src/test/setup-integration';
 *
 *   setupIntegration();
 *
 *   it('works with real DB', async () => {
 *     const prisma = getTestPrisma();
 *     // ... use prisma as usual
 *   });
 *
 * Each test file gets its own container (via `singleFork` in vitest config)
 * so tests don't interfere. Tables are truncated between tests via the
 * `cleanDatabase` helper — faster than restarting the container.
 */
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@nonsololarco/db';

let container: StartedPostgreSqlContainer;
let prisma: PrismaClient;

/** Returns the PrismaClient connected to the test container. */
export function getTestPrisma(): PrismaClient {
  if (!prisma) {
    throw new Error(
      'Call setupIntegration() in beforeAll before using getTestPrisma()',
    );
  }
  return prisma;
}

/** Root of the @nonsololarco/db package, where the Prisma CLI is installed. */
const DB_PACKAGE_ROOT = resolve(__dirname, '../../../../packages/db');

/** Path to the Prisma schema file (relative to monorepo root). */
const SCHEMA_PATH = resolve(DB_PACKAGE_ROOT, 'prisma/schema.prisma');

/**
 * Truncates all application tables in the correct order (respecting FK
 * constraints) so each test starts with a clean slate. Much faster than
 * dropping and recreating the schema.
 */
export async function cleanDatabase(): Promise<void> {
  const p = getTestPrisma();
  // Order matters: children before parents to avoid FK violations.
  await p.$executeRawUnsafe('TRUNCATE "track_performers" CASCADE');
  await p.$executeRawUnsafe('TRUNCATE "tracks" CASCADE');
  await p.$executeRawUnsafe('TRUNCATE "band_members" CASCADE');
  await p.$executeRawUnsafe('TRUNCATE "bands" CASCADE');
  await p.$executeRawUnsafe('TRUNCATE "accounts" CASCADE');
  await p.$executeRawUnsafe('TRUNCATE "users" CASCADE');
}

/**
 * Call this at the top level of an integration test file to wire up
 * container lifecycle to vitest's beforeAll/afterAll/afterEach hooks.
 */
export function setupIntegration(): void {
  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('nonsololarco_test')
      .withUsername('test')
      .withPassword('test')
      .start();

    const databaseUrl = container.getConnectionUri();

    // Run Prisma migrations against the test container.
    //
    // `cwd` must be the db package: `prisma` is a dependency of
    // @nonsololarco/db, not of this app, so running from apps/api gives
    // "sh: prisma: command not found". pnpm does not hoist it, and adding a
    // second copy here just to satisfy a path would let the two versions
    // drift.
    //
    // stdio is inherited on failure so the Prisma error is readable; with
    // 'pipe' the output is swallowed and every migration problem looks the
    // same from the test runner.
    try {
      execSync(`npx prisma migrate deploy --schema="${SCHEMA_PATH}"`, {
        cwd: DB_PACKAGE_ROOT,
        env: { ...process.env, DATABASE_URL: databaseUrl },
        stdio: 'pipe',
      });
    } catch (error) {
      const details =
        error instanceof Error && 'stderr' in error
          ? String((error as { stderr?: Buffer }).stderr ?? '')
          : String(error);

      throw new Error(`Prisma migrate deploy failed:\n${details}`);
    }

    // Connect a PrismaClient directly (not through NestJS DI — we're
    // testing the service layer, not the framework wiring).
    // This project uses @prisma/adapter-pg, so we pass an adapter
    // rather than datasourceUrl.
    const adapter = new PrismaPg({ connectionString: databaseUrl });
    prisma = new PrismaClient({ adapter });
    await prisma.$connect();
  });

  afterEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma?.$disconnect();
    await container?.stop();
  });
}

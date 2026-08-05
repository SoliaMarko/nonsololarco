import { createHmac } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@nonsololarco/db';
import { test as setup, expect } from '@playwright/test';

import { STORAGE_STATE } from './constants';

const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;
const SEED_EMAIL = process.env.E2E_USER_EMAIL ?? 'solomiia@example.com';

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Mints the same JWT the API's Google/GitHub callback would issue.
 * The app authenticates from an httpOnly `token` cookie carrying `{ sub }`,
 * so signing one directly is the only way to start a spec signed in.
 */
function signToken(userId: string, secret: string): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(
    JSON.stringify({ sub: userId, iat: now, exp: now + 60 * 60 }),
  );
  const signature = base64url(
    createHmac('sha256', secret).update(`${header}.${payload}`).digest(),
  );

  return `${header}.${payload}.${signature}`;
}

setup('authenticate as the seeded user', async ({ context, page }) => {
  expect(
    JWT_SECRET,
    'JWT_SECRET must be set — e2e signs its own token. Copy it from your root .env.',
  ).toBeTruthy();
  expect(DATABASE_URL, 'DATABASE_URL must be set to look up the seeded user.').toBeTruthy();

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: DATABASE_URL! }),
  });
  const user = await prisma.user.findUnique({ where: { email: SEED_EMAIL } });
  await prisma.$disconnect();

  expect(
    user,
    `No user with email ${SEED_EMAIL}. Run the seed first, or set E2E_USER_EMAIL.`,
  ).toBeTruthy();

  await context.addCookies([
    {
      name: 'token',
      value: signToken(user!.id, JWT_SECRET!),
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);

  // Prove the cookie actually authenticates before saving it — otherwise
  // every spec fails with a confusing redirect instead of a clear error here.
  await page.goto('/repertoire');
  await expect(page).not.toHaveURL(/\/login/);

  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });
  await context.storageState({ path: STORAGE_STATE });
});

import { PrismaClient } from '@nonsololarco/db';
import { test as setup } from '@playwright/test';
import { PrismaPg } from '@prisma/adapter-pg';
import { createHmac } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { STORAGE_STATE } from './constants';

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
  const payload = base64url(JSON.stringify({ sub: userId, iat: now, exp: now + 60 * 60 }));
  const signature = base64url(createHmac('sha256', secret).update(`${header}.${payload}`).digest());

  return `${header}.${payload}.${signature}`;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be set — e2e auth setup requires it.`);
  }
  return value;
}

setup('authenticate as the seeded user', async ({ context, page }) => {
  const jwtSecret = requireEnv('JWT_SECRET');
  const databaseUrl = requireEnv('DATABASE_URL');

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
  const user = await prisma.user.findUnique({ where: { email: SEED_EMAIL } });
  await prisma.$disconnect();

  if (!user) {
    throw new Error(`No user with email ${SEED_EMAIL}. Run the seed first, or set E2E_USER_EMAIL.`);
  }

  const webUrl = process.env.E2E_WEB_URL ?? 'http://localhost:3000';
  const cookieDomain = new URL(webUrl).hostname;

  await context.addCookies([
    {
      name: 'token',
      value: signToken(user.id, jwtSecret),
      domain: cookieDomain,
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);

  await page.goto('/repertoire');

  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });
  await context.storageState({ path: STORAGE_STATE });
});

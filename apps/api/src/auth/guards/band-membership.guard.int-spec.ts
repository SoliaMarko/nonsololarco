/**
 * Tenant isolation for BandMembershipGuard, against a real PostgreSQL database.
 *
 * This is the test the unit spec cannot replace. There, `findUnique` is a mock
 * returning whatever it was told, so it proves the guard calls Prisma the way
 * the author intended — not that the database agrees. Here the membership rows
 * are real, so a wrong `where` clause, a mis-declared compound key, or a
 * migration that dropped `@@unique([userId, bandId])` all fail visibly.
 *
 * CLAUDE.md names tenant isolation — that user A cannot read user B's data —
 * as requiring integration coverage for exactly this reason.
 */
import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import {
  BAND_NIGHT_OWLS,
  BAND_QUIET_YARD,
  seedFixtures,
  USER_ANNA,
  USER_SOLOMIIA,
} from 'src/test/fixtures/seed-fixtures';
import { getTestPrisma, setupIntegration } from 'src/test/setup-integration';

import { PrismaService } from '../../prisma';
import { BandMembershipGuard } from './band-membership.guard';

setupIntegration();

let guard: BandMembershipGuard;

beforeEach(async () => {
  const prisma = getTestPrisma();
  await seedFixtures(prisma);

  // Cast is safe: the guard only calls prisma.bandMember.findUnique.
  guard = new BandMembershipGuard(prisma as unknown as PrismaService);
});

function contextFor(userId: string, bandId: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ params: { id: bandId }, user: { id: userId } }),
    }),
  } as unknown as ExecutionContext;
}

// The fixtures give the two memberships this needs:
//   Solomiia → Quiet Yard only
//   Anna     → Quiet Yard and Night Owls
describe('tenant isolation', () => {
  it('lets a member into their own band', async () => {
    await expect(
      guard.canActivate(contextFor(USER_SOLOMIIA, BAND_QUIET_YARD)),
    ).resolves.toBe(true);
  });

  it('keeps a user out of a band they do not belong to', async () => {
    // Solomiia has no membership in Night Owls. This is the case the endpoint
    // allowed before the guard existed.
    await expect(
      guard.canActivate(contextFor(USER_SOLOMIIA, BAND_NIGHT_OWLS)),
    ).rejects.toThrow(ForbiddenException);
  });

  it('lets a user into every band they do belong to', async () => {
    await expect(
      guard.canActivate(contextFor(USER_ANNA, BAND_QUIET_YARD)),
    ).resolves.toBe(true);

    await expect(
      guard.canActivate(contextFor(USER_ANNA, BAND_NIGHT_OWLS)),
    ).resolves.toBe(true);
  });

  it('does not reveal whether an unknown band exists', async () => {
    await expect(
      guard.canActivate(contextFor(USER_SOLOMIIA, 'band-that-does-not-exist')),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects a user id that does not exist', async () => {
    await expect(
      guard.canActivate(
        contextFor('user-that-does-not-exist', BAND_QUIET_YARD),
      ),
    ).rejects.toThrow(ForbiddenException);
  });
});

describe('membership changes take effect immediately', () => {
  it('denies access once the membership row is removed', async () => {
    const prisma = getTestPrisma();

    await expect(
      guard.canActivate(contextFor(USER_SOLOMIIA, BAND_QUIET_YARD)),
    ).resolves.toBe(true);

    await prisma.bandMember.delete({
      where: {
        userId_bandId: { userId: USER_SOLOMIIA, bandId: BAND_QUIET_YARD },
      },
    });

    // Nothing is cached, so a user removed from a band loses access on their
    // next request rather than at the end of some TTL.
    await expect(
      guard.canActivate(contextFor(USER_SOLOMIIA, BAND_QUIET_YARD)),
    ).rejects.toThrow(ForbiddenException);
  });

  it('grants access as soon as a membership is added', async () => {
    const prisma = getTestPrisma();

    await expect(
      guard.canActivate(contextFor(USER_SOLOMIIA, BAND_NIGHT_OWLS)),
    ).rejects.toThrow(ForbiddenException);

    await prisma.bandMember.create({
      data: { userId: USER_SOLOMIIA, bandId: BAND_NIGHT_OWLS, role: 'keys' },
    });

    await expect(
      guard.canActivate(contextFor(USER_SOLOMIIA, BAND_NIGHT_OWLS)),
    ).resolves.toBe(true);
  });
});

describe('wiring mistakes', () => {
  it('fails loudly rather than silently denying when the user is missing', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ params: { id: BAND_QUIET_YARD } }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

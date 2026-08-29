import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma';
import { BandMembershipGuard } from './band-membership.guard';

interface MockPrisma {
  bandMember: { findUnique: ReturnType<typeof vi.fn> };
}

/** Builds an ExecutionContext carrying the given params and user. */
function makeContext(
  params: Record<string, string | undefined>,
  user?: { id: string },
): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ params, user }),
    }),
  } as unknown as ExecutionContext;
}

describe('BandMembershipGuard', () => {
  let prisma: MockPrisma;
  let guard: BandMembershipGuard;

  beforeEach(() => {
    prisma = { bandMember: { findUnique: vi.fn() } };
    guard = new BandMembershipGuard(prisma as unknown as PrismaService);
  });

  it('allows a member through', async () => {
    prisma.bandMember.findUnique.mockResolvedValue({ id: 'membership-1' });

    const allowed = await guard.canActivate(
      makeContext({ id: 'band-1' }, { id: 'user-1' }),
    );

    expect(allowed).toBe(true);
  });

  it('queries the compound unique key, not a scan', async () => {
    prisma.bandMember.findUnique.mockResolvedValue({ id: 'membership-1' });

    await guard.canActivate(makeContext({ id: 'band-1' }, { id: 'user-1' }));

    expect(prisma.bandMember.findUnique).toHaveBeenCalledWith({
      where: { userId_bandId: { userId: 'user-1', bandId: 'band-1' } },
      select: { id: true },
    });
  });

  it('rejects a non-member with 403', async () => {
    prisma.bandMember.findUnique.mockResolvedValue(null);

    await expect(
      guard.canActivate(makeContext({ id: 'band-2' }, { id: 'user-1' })),
    ).rejects.toThrow(ForbiddenException);
  });

  // A band that does not exist has no membership row either, so it takes the
  // same path. That is deliberate: answering 404 would let any authenticated
  // caller probe which band ids are real.
  it('rejects an unknown band with 403 rather than revealing it is absent', async () => {
    prisma.bandMember.findUnique.mockResolvedValue(null);

    await expect(
      guard.canActivate(
        makeContext({ id: 'does-not-exist' }, { id: 'user-1' }),
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('accepts the bandId param name used by write routes', async () => {
    prisma.bandMember.findUnique.mockResolvedValue({ id: 'membership-1' });

    await guard.canActivate(
      makeContext({ bandId: 'band-1' }, { id: 'user-1' }),
    );

    expect(prisma.bandMember.findUnique).toHaveBeenCalledWith({
      where: { userId_bandId: { userId: 'user-1', bandId: 'band-1' } },
      select: { id: true },
    });
  });

  it('prefers bandId when a route somehow carries both', async () => {
    prisma.bandMember.findUnique.mockResolvedValue({ id: 'membership-1' });

    await guard.canActivate(
      makeContext(
        { bandId: 'band-explicit', id: 'something-else' },
        { id: 'user-1' },
      ),
    );

    expect(prisma.bandMember.findUnique).toHaveBeenCalledWith({
      where: { userId_bandId: { userId: 'user-1', bandId: 'band-explicit' } },
      select: { id: true },
    });
  });

  describe('wiring mistakes fail loudly', () => {
    it('throws when no user is on the request', async () => {
      await expect(
        guard.canActivate(makeContext({ id: 'band-1' })),
      ).rejects.toThrow(InternalServerErrorException);

      // Never silently a 403 — that would look like a permission problem and
      // send someone debugging the wrong thing.
      expect(prisma.bandMember.findUnique).not.toHaveBeenCalled();
    });

    it('throws when the route has no band id param', async () => {
      await expect(
        guard.canActivate(makeContext({ trackId: 't-1' }, { id: 'user-1' })),
      ).rejects.toThrow(InternalServerErrorException);

      expect(prisma.bandMember.findUnique).not.toHaveBeenCalled();
    });

    it('treats an empty band id as missing', async () => {
      await expect(
        guard.canActivate(makeContext({ id: '' }, { id: 'user-1' })),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});

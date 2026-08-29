import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Request } from 'express';

import { PrismaService } from '../../prisma';
import type { SessionUser } from '../decorators/current-user.decorator';

// `params` is deliberately not redeclared: Express types it as
// ParamsDictionary, and narrowing an index signature in an extending interface
// is a type error. Values are validated in readBandId instead.
interface BandRequest extends Request {
  user?: SessionUser;
}

/**
 * Route params the band id may arrive under.
 *
 * `:id` is what `bands/:id/repertoire` uses today; `:bandId` is the form
 * `docs/RECIPE-endpoint.md` uses for future write routes. Accepting both means
 * a new route cannot silently skip the check by naming its param differently.
 */
const BAND_ID_PARAMS = ['bandId', 'id'] as const;

/**
 * Allows the request only if the current user belongs to the band in the route.
 *
 * `JwtAuthGuard` answers "is this a real user". This answers "may this user
 * see this band" — the question nothing asked before, which meant any signed-in
 * account could read the full repertoire of any band by id alone.
 *
 * Always used **after** `JwtAuthGuard`:
 *
 * ```ts
 * @UseGuards(JwtAuthGuard, BandMembershipGuard)
 * ```
 *
 * **A missing membership and a missing band both give 403, deliberately.**
 * Answering 404 for a band that does not exist would let any authenticated
 * caller probe which ids are real. There is nothing a non-member is entitled to
 * learn about a band, including whether it exists, so both cases return the
 * same response. See `docs/architecture/api-repertoire.md`.
 */
@Injectable()
export class BandMembershipGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<BandRequest>();
    const userId = request.user?.id;

    if (!userId) {
      // JwtAuthGuard should have populated this. Reaching here means the guard
      // order is wrong, which is a wiring bug rather than a rejected caller —
      // failing loudly beats quietly returning 403 for every request.
      throw new InternalServerErrorException(
        'BandMembershipGuard requires JwtAuthGuard to run first',
      );
    }

    const bandId = this.readBandId(request);

    const membership = await this.prisma.bandMember.findUnique({
      where: { userId_bandId: { userId, bandId } },
      select: { id: true },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this band');
    }

    return true;
  }

  /**
   * Reads the band id from whichever param name the route used.
   *
   * Express types a route param as `string | string[]`, so a non-string is
   * rejected rather than coerced — an array would otherwise stringify into a
   * comma-joined id that matches no band and reads as a puzzling 403.
   */
  private readBandId(request: BandRequest): string {
    for (const name of BAND_ID_PARAMS) {
      const value: unknown = request.params[name];

      if (typeof value === 'string' && value.length > 0) return value;
    }

    // The guard was applied to a route with no band in its path. Silently
    // allowing that would make the guard decorative on exactly the route
    // someone thought they were protecting.
    throw new InternalServerErrorException(
      `BandMembershipGuard found no band id; expected one of: ${BAND_ID_PARAMS.join(', ')}`,
    );
  }
}

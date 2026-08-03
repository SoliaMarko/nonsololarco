import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import type { EnvConfig } from '../../config/env.validation';
import { PrismaService } from '../../prisma';

interface JwtPayload {
  sub: string; // userId
}

interface AuthCookies {
  token?: string;
}

type AuthRequest = Request & {
  cookies: AuthCookies;
};

// Extracts the JWT from the httpOnly "token" cookie instead of the
// Authorization header, since we're using cookie-based auth.
function extractJwtFromCookie(req: AuthRequest): string | null {
  return req?.cookies?.token ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService<EnvConfig, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET', { infer: true }),
    });
  }

  // Runs after the JWT signature/expiry is verified.
  // Whatever we return here becomes `request.user`.
  // Only select the fields the app actually needs — never expose passwordHash.
  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

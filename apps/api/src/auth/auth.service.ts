import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Shared by every OAuth strategy (Google, GitHub, ...).
  // Finds an existing user linked to this provider account, or creates
  // a new User + Account pair if this is their first time signing in.
  async findOrCreateOAuthUser(params: {
    provider: string;
    providerAccountId: string;
    email: string;
    name: string;
  }) {
    const { provider, providerAccountId, email, name } = params;

    const existingAccount = await this.prisma.account.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId } },
      include: { user: true },
    });

    if (existingAccount) {
      return existingAccount.user;
    }

    // No account yet for this provider — check if a user with this email
    // already exists (e.g. they signed up with a different provider before),
    // otherwise create a brand new user.
    // Both writes must succeed or fail together to avoid orphaned User rows.
    const user = await this.prisma.$transaction(async (tx) => {
      const u = await tx.user.upsert({
        where: { email },
        update: {},
        create: { email, name },
      });

      await tx.account.create({
        data: { provider, providerAccountId, userId: u.id },
      });

      return u;
    });

    return user;
  }

  // Issues our own JWT after a successful OAuth login.
  signJwt(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }
}

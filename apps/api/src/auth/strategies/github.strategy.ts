import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';

import type { EnvConfig } from '../../config/env.validation';
import { OAuthStateStore } from '../oauth-state.store';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(config: ConfigService<EnvConfig, true>) {
    super({
      clientID: config.get('GITHUB_CLIENT_ID', { infer: true }),
      clientSecret: config.get('GITHUB_CLIENT_SECRET', { infer: true }),
      callbackURL: config.get('GITHUB_CALLBACK_URL', { infer: true }),
      scope: ['user:email'],
      store: new OAuthStateStore(config.get('JWT_SECRET', { infer: true })),
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: Error | null, user?: Record<string, string> | false) => void,
  ) {
    // GitHub doesn't always include email in the profile directly —
    // it can be private, so emails[0] may be undefined for some users.
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || profile.username;

    if (!email) {
      return done(
        new UnauthorizedException(
          'Your GitHub account has no public email. Please add one in GitHub settings and try again.',
        ),
        false,
      );
    }

    if (!name) {
      return done(
        new UnauthorizedException('GitHub account has no display name'),
        false,
      );
    }

    done(null, {
      provider: 'github',
      providerAccountId: profile.id,
      email,
      name,
    });
  }
}

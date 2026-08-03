import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import type { EnvConfig } from '../../config/env.validation';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService<EnvConfig, true>) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID', { infer: true }),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET', { infer: true }),
      callbackURL: config.get('GOOGLE_CALLBACK_URL', { infer: true }),
      scope: ['email', 'profile'],
    });
  }

  // Called by Passport after Google redirects back with a successful login.
  // Whatever we pass to `done()` becomes `request.user` in the callback route.
  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;

    if (!email) {
      return done(
        new UnauthorizedException('Google account has no email'),
        false,
      );
    }

    if (!name) {
      return done(
        new UnauthorizedException('Google account has no display name'),
        false,
      );
    }

    done(null, {
      provider: 'google',
      providerAccountId: profile.id,
      email,
      name,
    });
  }
}

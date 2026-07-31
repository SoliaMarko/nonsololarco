import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
      scope: ['user:email'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, user: any) => void,
  ) {
    // GitHub doesn't always include email in the profile directly —
    // it can be private, so emails[0] may be undefined for some users.
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || profile.username;

    done(null, {
      provider: 'github',
      providerAccountId: profile.id,
      email,
      name,
    });
  }
}

import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response } from 'express';

import type { EnvConfig } from '../config/env.validation';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import type { SessionUser } from './decorators/current-user.decorator';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface OAuthUser {
  provider: string;
  providerAccountId: string;
  email: string;
  name: string;
}

interface OAuthRequest extends Request {
  user: OAuthUser;
}

const TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

@Controller('auth')
export class AuthController {
  private readonly frontendUrl: string;
  private readonly cookieOptions: CookieOptions;

  constructor(
    private readonly authService: AuthService,
    config: ConfigService<EnvConfig, true>,
  ) {
    this.frontendUrl =
      config.get('FRONTEND_URL', { infer: true }) ?? 'http://localhost:3000';

    // Fail closed: only skip Secure for explicit local dev/test. Any unset
    // or unrecognized NODE_ENV (e.g. a staging deploy someone forgot to
    // configure) still gets Secure — better to break locally-over-HTTP than
    // to silently ship a cookie that works over plain HTTP in the wild.
    const nodeEnv = config.get('NODE_ENV', { infer: true });
    const isLocalEnv = nodeEnv === 'development' || nodeEnv === 'test';
    const isProduction = nodeEnv === 'production';
    const cookieDomain: string | undefined = config.get('COOKIE_DOMAIN', {
      infer: true,
    });

    this.cookieOptions = {
      httpOnly: true,
      secure: !isLocalEnv,
      sameSite: 'lax',
      domain: cookieDomain || (isProduction ? '.nonsololarco.com' : undefined),
      path: '/',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: SessionUser) {
    return { id: user.id, name: user.name, email: user.email };
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token', this.cookieOptions);
    res.json({ ok: true });
  }

  // Kicks off the Google OAuth flow — redirects the browser to Google's
  // consent screen. The guard handles the redirect, this method never runs.
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: OAuthRequest, @Res() res: Response) {
    await this.handleOAuthCallback(req, res);
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  githubLogin() {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubCallback(@Req() req: OAuthRequest, @Res() res: Response) {
    await this.handleOAuthCallback(req, res);
  }

  private async handleOAuthCallback(req: OAuthRequest, res: Response) {
    const { provider, providerAccountId, email, name } = req.user;

    const user = await this.authService.findOrCreateOAuthUser({
      provider,
      providerAccountId,
      email,
      name,
    });

    const token = this.authService.signJwt(user.id);

    res.cookie('token', token, {
      ...this.cookieOptions,
      maxAge: TOKEN_MAX_AGE,
    });
    res.redirect(this.frontendUrl);
  }
}

import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { CookieOptions, Request, Response } from 'express';

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

const isProduction = process.env.NODE_ENV === 'production';

const TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  domain: isProduction ? '.nonsololarco.com' : undefined,
  path: '/',
};

const TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: SessionUser) {
    return { id: user.id, name: user.name, email: user.email };
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token', TOKEN_COOKIE_OPTIONS);
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
      ...TOKEN_COOKIE_OPTIONS,
      maxAge: TOKEN_MAX_AGE,
    });
    res.redirect(process.env.FRONTEND_URL ?? 'http://localhost:3000');
  }
}

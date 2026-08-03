import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { User } from '@nonsololarco/db';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User) {
    return { id: user.id, name: user.name, email: user.email };
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain:
        process.env.NODE_ENV === 'production' ? '.nonsololarco.com' : undefined,
      path: '/',
    });

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
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain:
        process.env.NODE_ENV === 'production' ? '.nonsololarco.com' : undefined,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(process.env.FRONTEND_URL ?? 'http://localhost:3000');
  }
}

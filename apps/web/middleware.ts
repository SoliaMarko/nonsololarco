import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const PUBLIC_PATHS = ['/login', '/signup'];

// A file extension at the very end of the path — matches static assets
// served from /public (favicon.ico, robots.txt, images, ...). Anchored to
// the end so a protected route like /profile/j.doe isn't treated as public.
const STATIC_ASSET_PATTERN = /\.[a-zA-Z0-9]+$/;

/**
 * Checks whether the path (with the locale prefix stripped) is public.
 *
 * Locale prefix is always present because intlMiddleware runs first and
 * redirects bare paths to `/{locale}/...`. We strip it before matching
 * against PUBLIC_PATHS so that `/en/login` and `/it/login` both resolve.
 */
function isPublicPath(pathname: string): boolean {
  // Strip locale prefix: "/en/login" → "/login", "/uk" → "/"
  const withoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';

  return (
    PUBLIC_PATHS.includes(withoutLocale) ||
    pathname === '/_next' ||
    pathname.startsWith('/_next/') ||
    pathname === '/api' ||
    pathname.startsWith('/api/') ||
    STATIC_ASSET_PATTERN.test(pathname)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let next-intl handle locale detection and prefix first
  const intlResponse = intlMiddleware(request);

  if (isPublicPath(pathname)) {
    return intlResponse;
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    const locale = pathname.match(/^\/([a-z]{2})(?=\/|$)/)?.[1] ?? 'en';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

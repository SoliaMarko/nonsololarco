import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { defaultLocale, locales } from '@/i18n/config';
import { routing } from '@/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const PUBLIC_PATHS = ['/login', '/signup', '/metronome'];

/**
 * Files served straight from /public.
 *
 * Matched against a known extension list rather than "any trailing dot
 * segment": a route segment can legitimately contain a dot (`/profile/j.doe`)
 * and must not be waved through as an asset.
 */
const STATIC_ASSET_PATTERN =
  /\.(?:avif|bmp|css|gif|ico|jpe?g|js|json|mjs|mp[34]|otf|pdf|png|svg|ttf|txt|webm|webmanifest|webp|woff2?|xml)$/i;

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
    pathname.startsWith('/api/')
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Assets in /public have no locale, so they must bypass next-intl entirely
  // rather than be let through as "public paths". Handing one to the intl
  // middleware redirects /illustrations/lamp.png to /en/illustrations/lamp.png,
  // which does not exist — the asset 404s while the page holding it renders
  // perfectly, which is a confusing way to spend an afternoon.
  if (STATIC_ASSET_PATTERN.test(pathname)) {
    return NextResponse.next();
  }

  // Let next-intl handle locale detection and prefix first
  const intlResponse = intlMiddleware(request);

  if (isPublicPath(pathname)) {
    return intlResponse;
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    const extracted = pathname.match(/^\/([a-z]{2})(?=\/|$)/)?.[1];
    let locale: string;

    if (extracted && (locales as readonly string[]).includes(extracted)) {
      locale = extracted;
    } else {
      // No locale in path — honour Accept-Language so the login page
      // renders in the visitor's preferred language.
      const preferred = request.headers
        .get('Accept-Language')
        ?.split(',')
        .map((entry) => (entry.split(';')[0] ?? '').trim().substring(0, 2))
        .find((code) => (locales as readonly string[]).includes(code));

      locale = preferred ?? defaultLocale;
    }

    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

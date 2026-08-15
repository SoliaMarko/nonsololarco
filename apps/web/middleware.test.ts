import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/* ------------------------------------------------------------------ */
/*  Mocks                                                              */
/* ------------------------------------------------------------------ */

const intlMiddlewareResponse = NextResponse.next();

vi.mock('next-intl/middleware', () => ({
  default: () => () => intlMiddlewareResponse,
}));

vi.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en', 'it', 'uk'],
    defaultLocale: 'en',
    localePrefix: 'always',
  },
}));

// Import after mocks are set up
const { middleware } = await import('./middleware');

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function createRequest(
  path: string,
  options?: { acceptLanguage?: string; token?: string },
): NextRequest {
  const url = new URL(path, 'http://localhost:3000');
  const headers = new Headers();
  if (options?.acceptLanguage) {
    headers.set('Accept-Language', options.acceptLanguage);
  }

  const req = new NextRequest(url, { headers });

  if (options?.token) {
    // NextRequest cookies are read-only in tests, so we create a request
    // with the cookie header directly.
    const headersWithCookie = new Headers(headers);
    headersWithCookie.set('Cookie', `token=${options.token}`);
    return new NextRequest(url, { headers: headersWithCookie });
  }

  return req;
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

beforeEach(() => {
  vi.clearAllMocks();
});

describe('middleware', () => {
  describe('public paths', () => {
    it('allows /en/login without a token', () => {
      const response = middleware(createRequest('/en/login'));

      // Should return the intl response, not a redirect
      expect(response.headers.get('Location')).toBeNull();
    });

    it('allows /it/signup without a token', () => {
      const response = middleware(createRequest('/it/signup'));

      expect(response.headers.get('Location')).toBeNull();
    });

    it('allows static assets without a token', () => {
      const response = middleware(createRequest('/favicon.ico'));

      expect(response.headers.get('Location')).toBeNull();
    });

    it('allows /_next/ paths without a token', () => {
      const response = middleware(createRequest('/_next/static/chunk.js'));

      expect(response.headers.get('Location')).toBeNull();
    });

    it('allows /api/ paths without a token', () => {
      const response = middleware(createRequest('/api/auth/callback'));

      expect(response.headers.get('Location')).toBeNull();
    });
  });

  describe('protected paths', () => {
    it('redirects to /en/login when there is no token', () => {
      const response = middleware(createRequest('/en/repertoire'));

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/en/login');
    });

    it('preserves the locale prefix in the login redirect', () => {
      const response = middleware(createRequest('/uk/repertoire'));

      expect(response.headers.get('Location')).toContain('/uk/login');
    });

    it('defaults to /en/login when no locale prefix is present', () => {
      const response = middleware(createRequest('/repertoire'));

      expect(response.headers.get('Location')).toContain('/en/login');
    });

    it('honours Accept-Language for unprefixed protected paths', () => {
      const response = middleware(
        createRequest('/repertoire', { acceptLanguage: 'it-IT,it;q=0.9,en;q=0.8' }),
      );

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/it/login');
    });

    it('allows access when a token cookie is present', () => {
      const response = middleware(
        createRequest('/en/repertoire', { token: 'valid-jwt' }),
      );

      expect(response.headers.get('Location')).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('does not treat /en/profile/j.doe as a static asset', () => {
      const response = middleware(createRequest('/en/profile/j.doe'));

      // Without a token this should redirect — the .doe extension looks
      // like a file but the regex is anchored so it shouldn't match paths
      // with a real segment before the dot.
      expect(response.status).toBe(307);
    });

    it('treats /en as a protected path', () => {
      const response = middleware(createRequest('/en'));

      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('/en/login');
    });
  });
});

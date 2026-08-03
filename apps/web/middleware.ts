import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup'];

// A file extension at the very end of the path — matches static assets
// served from /public (favicon.ico, robots.txt, images, ...). Anchored to
// the end so a protected route like /profile/j.doe isn't treated as public.
const STATIC_ASSET_PATTERN = /\.[a-zA-Z0-9]+$/;

function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_PATHS.includes(pathname) ||
    pathname === '/_next' ||
    pathname.startsWith('/_next/') ||
    pathname === '/api' ||
    pathname.startsWith('/api/') ||
    STATIC_ASSET_PATTERN.test(pathname)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { LOCALE_CODES } from './lib/locales';

const PROTECTED_SEGMENTS = ['report', 'mchango', 'map', 'dashboard', 'reports', 'transparency', 'calculator'];

function isKnownLocale(segment: string): boolean {
  return (LOCALE_CODES as readonly string[]).includes(segment);
}

function isProtectedPath(pathname: string): boolean {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length < 2) return false;
  const locale = parts[0];
  const segment = parts[1];
  return isKnownLocale(locale) && PROTECTED_SEGMENTS.includes(segment);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect bare root to default locale
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  const firstSegment = pathname.split('/').filter(Boolean)[0] ?? '';
  const pathnameHasLocale = isKnownLocale(firstSegment);

  // Only prefix with /en if the first segment is NOT already a known locale.
  // This prevents accidentally double-prefixing paths like /fr/page → /en/fr/page.
  if (!pathnameHasLocale && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  // Require login for protected segments
  if (isProtectedPath(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });
    if (!token) {
      const locale = firstSegment || 'en';
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

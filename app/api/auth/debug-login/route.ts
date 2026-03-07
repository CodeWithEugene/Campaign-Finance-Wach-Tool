import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * POST /api/auth/debug-login — run the same auth flow as NextAuth and return the real error.
 * Body: { "email": "...", "password": "..." }
 * Only enabled when NODE_ENV=development or DEBUG_AUTH=1. Remove or restrict in production.
 */
export async function POST(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development' || process.env.DEBUG_AUTH === '1';
  if (!isDev) {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const email = ((body?.email as string) || '').trim().toLowerCase();
    const password = (body?.password as string) || '';

    const convexUrl = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;

    const result: Record<string, unknown> = {
      hasEmail: !!email,
      hasPassword: !!password,
      hasConvexUrl: !!convexUrl,
      convexUrl: convexUrl ? `${convexUrl.slice(0, 40)}...` : null,
      adminResult: null,
      userResult: null,
      error: null,
    };

    if (!email || !password) {
      return NextResponse.json({ ...result, error: 'Missing email or password' });
    }
    if (!convexUrl) {
      return NextResponse.json({ ...result, error: 'NEXT_PUBLIC_CONVEX_URL (or CONVEX_URL) is not set' });
    }

    const { ConvexHttpClient } = await import('convex/browser');
    const { api } = await import('@/convex/_generated/api');
    const client = new ConvexHttpClient(convexUrl);

    try {
      const admin = await client.action(api.auth.verifyAdmin, { email, password });
      result.adminResult = admin ? 'ok' : null;
      if (admin) return NextResponse.json({ ...result, ok: true, role: 'admin' });
    } catch (e) {
      result.adminError = e instanceof Error ? e.message : String(e);
    }

    try {
      const user = await client.action(api.auth.verifyUser, { email, password });
      result.userResult = user ? 'ok' : null;
      if (user) return NextResponse.json({ ...result, ok: true, role: 'user' });
    } catch (e) {
      result.userError = e instanceof Error ? e.message : String(e);
    }

    result.error = 'Invalid email or password (or Convex errors above)';
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json(
      { error: message, stack: process.env.NODE_ENV === 'development' ? stack : undefined },
      { status: 500 }
    );
  }
}

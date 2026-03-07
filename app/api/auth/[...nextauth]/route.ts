import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/auth';

const handler = NextAuth(authOptions);

function isErrorPageRequest(req: Request): boolean {
  try {
    const pathname = new URL(req.url).pathname;
    return pathname.endsWith('/error') || pathname.includes('/auth/error');
  } catch {
    return false;
  }
}

function withAuthConfig(
  req: Request,
  method: 'GET' | 'POST',
  fn: (req: Request) => Promise<Response>
) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    if (method === 'GET' && isErrorPageRequest(req)) {
      const base = new URL(req.url).origin;
      return NextResponse.redirect(`${base}/en/login?error=Configuration`);
    }
    return NextResponse.json(
      { error: 'Sign-in is temporarily unavailable. Server is missing NEXTAUTH_SECRET.' },
      { status: 500 }
    );
  }
  return fn(req);
}

export async function GET(req: Request) {
  try {
    const res = await withAuthConfig(req, 'GET', (r) => handler(r));
    if (res.status === 500 && isErrorPageRequest(req)) {
      const base = new URL(req.url).origin;
      return NextResponse.redirect(`${base}/en/login?error=SigninFailed`);
    }
    return res;
  } catch (err) {
    if (isErrorPageRequest(req)) {
      const base = new URL(req.url).origin;
      return NextResponse.redirect(`${base}/en/login?error=SigninFailed`);
    }
    throw err;
  }
}
export function POST(req: Request) {
  return withAuthConfig(req, 'POST', (r) => handler(r));
}

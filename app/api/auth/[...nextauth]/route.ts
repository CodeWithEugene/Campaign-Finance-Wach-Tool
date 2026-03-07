import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/auth';

const handler = NextAuth(authOptions);

function withAuthConfig(
  req: Request,
  method: 'GET' | 'POST',
  fn: (req: Request) => Promise<Response>
) {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'Sign-in is temporarily unavailable. Server is missing NEXTAUTH_SECRET.' },
      { status: 500 }
    );
  }
  return fn(req);
}

export function GET(req: Request) {
  return withAuthConfig(req, 'GET', (r) => handler(r));
}
export function POST(req: Request) {
  return withAuthConfig(req, 'POST', (r) => handler(r));
}

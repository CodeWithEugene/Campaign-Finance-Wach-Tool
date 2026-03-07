import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getServerSession } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = ((credentials?.email as string) || '').trim().toLowerCase();
        const password = (credentials?.password as string) || '';
        if (!email || !password) return null;

        // Prefer CONVEX_URL (server-only) so auth always uses the deployment you deployed to.
        const convexUrl = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
        if (!convexUrl) return null;

        try {
          const { ConvexHttpClient } = await import('convex/browser');
          const { api } = await import('@/convex/_generated/api');
          const client = new ConvexHttpClient(convexUrl);

          // 1. Try admin (from Convex admins table)
          const admin = await client.action(api.auth.verifyAdmin, { email, password });
          if (admin) return admin;

          // 2. Try Convex user
          const user = await client.action(api.auth.verifyUser, { email, password });
          if (user) return { id: user.id, email: user.email, name: user.name ?? 'User', role: 'user' };
        } catch (err) {
          console.error('[auth] Convex auth failed:', err);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role ?? 'user';
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: `/${process.env.NEXTAUTH_SIGNIN_LOCALE ?? 'en'}/login`,
  },
  // Do NOT set NEXTAUTH_URL in this file — Next-auth auto-detects the URL from the
  // request in production (Vercel sets NEXTAUTH_URL automatically via VERCEL_URL).
  // Only set NEXTAUTH_URL in .env for local dev (http://localhost:3000).
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
};

export function auth() {
  return getServerSession(authOptions);
}

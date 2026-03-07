import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string) || '';
        const password = (credentials?.password as string) || '';
        if (!email || !password) return null;

        // 1. Try admin (env-based)
        const adminEmail = process.env.ADMIN_EMAIL?.trim();
        const adminHash = process.env.ADMIN_PASSWORD_HASH?.trim();
        if (adminEmail && adminHash && email.toLowerCase() === adminEmail.toLowerCase()) {
          try {
            const ok = await bcrypt.compare(password, adminHash);
            if (ok) return { id: 'admin', email: adminEmail, name: 'Admin', role: 'admin' };
          } catch (err) {
            console.error('[auth] Admin bcrypt compare failed (check ADMIN_PASSWORD_HASH is a valid bcrypt hash):', err);
          }
        }

        // 2. Try Convex user (dynamic import to avoid build-time dependency)
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
        if (convexUrl) {
          try {
            const { ConvexHttpClient } = await import('convex/browser');
            const { api } = await import('@/convex/_generated/api');
            const client = new ConvexHttpClient(convexUrl);
            const user = await client.action(api.auth.verifyUser, { email, password });
            if (user) return { id: user.id, email: user.email, name: user.name ?? 'User', role: 'user' };
          } catch (err) {
            console.error('[auth] Convex verifyUser failed:', err);
          }
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

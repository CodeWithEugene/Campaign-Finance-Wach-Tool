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
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;
        if (adminEmail && adminHash && email === adminEmail) {
          try {
            const ok = await bcrypt.compare(password, adminHash);
            if (ok) return { id: 'admin', email: adminEmail, name: 'Admin', role: 'admin' };
          } catch {
            // Invalid hash format (e.g. plain text in ADMIN_PASSWORD_HASH) — treat as failed login
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
          } catch {
            // ignore
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
  pages: { signIn: '/en/login' },
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
};

export function auth() {
  return getServerSession(authOptions);
}

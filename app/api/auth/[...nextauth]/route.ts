import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = process.env.ADMIN_EMAIL;
        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!email || !hash) return null;
        if (credentials?.email !== email) return null;
        const ok = await bcrypt.compare(
          (credentials?.password as string) || '',
          hash
        );
        if (!ok) return null;
        return { id: 'admin', email, name: 'Admin' };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = 'admin';
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string;
      return session;
    },
  },
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
});

export const { GET, POST } = handlers;

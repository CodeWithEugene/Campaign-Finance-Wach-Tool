'use node';

import { action } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import bcrypt from 'bcryptjs';

const DUMMY_BCRYPT_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LFa.Palt/ie';

/** Verify admin credentials against admins table. Returns admin info for NextAuth or null. */
export const verifyAdmin = action({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args): Promise<{ id: string; email: string; name: string; role: 'admin' } | null> => {
    const admin = await ctx.runQuery(internal.admins.getByEmail, { email: args.email });

    if (!admin) {
      await bcrypt.compare(args.password, DUMMY_BCRYPT_HASH);
      return null;
    }

    const ok = await bcrypt.compare(args.password, admin.passwordHash);
    if (!ok) return null;

    return {
      id: 'admin',
      email: admin.email,
      name: admin.name ?? 'Admin',
      role: 'admin',
    };
  },
});

/** Verify user credentials. Returns user info for NextAuth or null. */
export const verifyUser = action({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args): Promise<{ id: string; email: string; name: string | null } | null> => {
    const user = await ctx.runQuery(internal.users.getByEmail, { email: args.email });

    if (!user) {
      await bcrypt.compare(args.password, DUMMY_BCRYPT_HASH);
      return null;
    }

    const ok = await bcrypt.compare(args.password, user.passwordHash);
    if (!ok) return null;

    return {
      id: user._id,
      email: user.email,
      name: user.name ?? null,
    };
  },
});

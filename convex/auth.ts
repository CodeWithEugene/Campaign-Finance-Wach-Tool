'use node';

import { action } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import bcrypt from 'bcryptjs';

/** Verify user credentials. Returns user info for NextAuth or null. */
export const verifyUser = action({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args): Promise<{ id: string; email: string; name: string | null } | null> => {
    const user = await ctx.runQuery(internal.users.getByEmail, { email: args.email });

    if (!user) {
      // Still run a bcrypt compare against a real (pre-computed) dummy hash so that
      // the response time is the same whether or not the user exists — prevents
      // timing-based email enumeration attacks.
      // This IS a valid bcrypt hash (generated offline) so bcryptjs won't throw.
      const DUMMY_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LFa.Palt/ie';
      await bcrypt.compare(args.password, DUMMY_HASH);
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

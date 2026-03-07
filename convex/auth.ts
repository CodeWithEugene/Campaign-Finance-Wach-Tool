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
    if (!user) return null;
    const ok = await bcrypt.compare(args.password, user.passwordHash);
    if (!ok) return null;
    return {
      id: user._id,
      email: user.email,
      name: user.name ?? null,
    };
  },
});

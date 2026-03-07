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

    // Always run bcrypt.compare to prevent timing-based user enumeration.
    // If user doesn't exist, compare against a dummy hash (result will always be false).
    const DUMMY_HASH = '$2a$10$dummyhashusedtoblindtimingoracles.......invalid';
    const hash = user?.passwordHash ?? DUMMY_HASH;
    const ok = await bcrypt.compare(args.password, hash);

    if (!user || !ok) return null;

    return {
      id: user._id,
      email: user.email,
      name: user.name ?? null,
    };
  },
});

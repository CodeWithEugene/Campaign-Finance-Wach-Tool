import { internalQuery } from './_generated/server';
import { v } from 'convex/values';

/** Internal only: get admin by email (used by auth actions only — never exposed to browser). */
export const getByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('admins')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
  },
});

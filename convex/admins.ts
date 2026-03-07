import { query } from './_generated/server';
import { v } from 'convex/values';

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('admins')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
  },
});

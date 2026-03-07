import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const subscribe = mutation({
  args: {
    email: v.string(),
    preferences: v.optional(
      v.object({
        alerts: v.optional(v.boolean()),
        digest: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('newsletter_subscribers')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        optedIn: true,
        preferences: args.preferences ?? existing.preferences,
      });
      return existing._id;
    }
    return await ctx.db.insert('newsletter_subscribers', {
      email: args.email,
      preferences: args.preferences ?? { alerts: true, digest: true },
      optedIn: true,
      subscribedAt: now,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('newsletter_subscribers').collect();
  },
});

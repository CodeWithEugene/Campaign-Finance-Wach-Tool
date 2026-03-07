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

/** Seed dummy newsletter subscribers. Run: npx convex run newsletter:seedDummyData */
export const seedDummyData = mutation({
  args: {},
  handler: async (ctx) => {
    const emails = [
      'eugenegabriel.ke@gmail.com',
      'alerts@example.com',
      'digest@example.com',
    ];
    const now = Date.now();
    let count = 0;
    for (const email of emails) {
      const existing = await ctx.db
        .query('newsletter_subscribers')
        .withIndex('by_email', (q) => q.eq('email', email))
        .first();
      if (!existing) {
        await ctx.db.insert('newsletter_subscribers', {
          email,
          preferences: { alerts: true, digest: true },
          optedIn: true,
          subscribedAt: now,
        });
        count++;
      }
    }
    return { ok: true, count, message: `Inserted ${count} newsletter subscribers.` };
  },
});

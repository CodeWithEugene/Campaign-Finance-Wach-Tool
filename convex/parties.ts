import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const parties = await ctx.db.query('parties').order('asc').collect();
    if (parties.length > 0) return parties;
    return [];
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('parties').first();
    if (existing) return 'already_seeded';
    await ctx.db.insert('parties', { slug: 'uda', name: 'United Democratic Alliance', order: 1 });
    await ctx.db.insert('parties', { slug: 'odm', name: 'Orange Democratic Movement', order: 2 });
    await ctx.db.insert('parties', { slug: 'jubilee', name: 'Jubilee Party', order: 3 });
    return 'seeded';
  },
});

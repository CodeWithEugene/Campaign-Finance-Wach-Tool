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

const DEFAULT_PARTIES = [
  { slug: 'uda', name: 'United Democratic Alliance', order: 1 },
  { slug: 'odm', name: 'Orange Democratic Movement', order: 2 },
  { slug: 'jubilee', name: 'Jubilee Party', order: 3 },
  { slug: 'wdm-k', name: 'Wiper Democratic Movement - Kenya', order: 4 },
];

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    let added = 0;
    for (const p of DEFAULT_PARTIES) {
      const existing = await ctx.db.query('parties').withIndex('by_slug', (q) => q.eq('slug', p.slug)).first();
      if (!existing) {
        await ctx.db.insert('parties', p);
        added++;
      }
    }
    return added > 0 ? 'seeded' : 'already_seeded';
  },
});

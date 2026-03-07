import { mutation, query, internalMutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {
    partyId: v.optional(v.string()),
    status: v.optional(v.union(v.literal('pending'), v.literal('success'), v.literal('failed'), v.literal('abandoned'))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let q;
    if (args.partyId)
      q = ctx.db.query('contributions').withIndex('by_party', (e) => e.eq('partyId', args.partyId!));
    else if (args.status)
      q = ctx.db.query('contributions').withIndex('by_status', (e) => e.eq('status', args.status!));
    else
      q = ctx.db.query('contributions').withIndex('by_created');
    return await q.order('desc').take(args.limit ?? 100);
  },
});

export const create = mutation({
  args: {
    amount: v.number(),
    partyId: v.string(),
    partyName: v.string(),
    paystackReference: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('contributions', {
      amount: args.amount,
      partyId: args.partyId,
      partyName: args.partyName,
      paystackReference: args.paystackReference,
      status: 'pending',
      email: args.email,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Internal-only mutation called from the Paystack webhook action.
 * Made internal so that browser clients cannot directly flip contribution statuses.
 */
export const updateFromWebhook = internalMutation({
  args: {
    paystackReference: v.string(),
    status: v.union(v.literal('success'), v.literal('failed'), v.literal('abandoned')),
  },
  handler: async (ctx, args) => {
    const list = await ctx.db
      .query('contributions')
      .filter((q) => q.eq(q.field('paystackReference'), args.paystackReference))
      .take(1);
    if (list.length === 0) return null;
    const id = list[0]._id;
    await ctx.db.patch(id, {
      status: args.status,
      updatedAt: Date.now(),
    });
    return id;
  },
});

export const getByReference = query({
  args: { paystackReference: v.string() },
  handler: async (ctx, args) => {
    const list = await ctx.db
      .query('contributions')
      .filter((q) => q.eq(q.field('paystackReference'), args.paystackReference))
      .take(1);
    return list[0] ?? null;
  },
});

export const totalsByParty = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    // Limit to the most recent successful contributions to avoid unbounded full-table scans
    const cap = Math.min(args.limit ?? 5000, 10000);
    const all = await ctx.db
      .query('contributions')
      .withIndex('by_status', (q) => q.eq('status', 'success'))
      .order('desc')
      .take(cap);
    const byParty: Record<string, { total: number; count: number }> = {};
    for (const c of all) {
      if (!byParty[c.partyId]) byParty[c.partyId] = { total: 0, count: 0 };
      byParty[c.partyId].total += c.amount;
      byParty[c.partyId].count += 1;
    }
    return byParty;
  },
});

const PARTIES = [
  { partyId: 'uda', partyName: 'United Democratic Alliance' },
  { partyId: 'odm', partyName: 'Orange Democratic Movement' },
  { partyId: 'jubilee', partyName: 'Jubilee Party' },
];

/** Seed dummy successful contributions for Mchango/transparency pages. Run: npx convex run contributions:seedDummyData */
export const seedDummyData = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const amounts = [500, 1000, 2000, 5000, 10000, 25000, 50000, 100000]; // KES
    let count = 0;
    for (let i = 0; i < 36; i++) {
      const party = PARTIES[i % PARTIES.length];
      await ctx.db.insert('contributions', {
        amount: amounts[i % amounts.length],
        partyId: party.partyId,
        partyName: party.partyName,
        status: 'success',
        email: i % 3 === 0 ? 'eugenegabriel.ke@gmail.com' : undefined,
        createdAt: now - (i * 1000 * 60 * 60 * 24),
        updatedAt: now - (i * 1000 * 60 * 60 * 24),
      });
      count++;
    }
    return { ok: true, count, message: `Inserted ${count} dummy contributions.` };
  },
});

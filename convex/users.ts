import { internalQuery, mutation } from './_generated/server';
import { v } from 'convex/values';

/** Internal: get user by email (used only by auth action). */
export const getByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
  },
});

/** Create a new user (called from signup API after hashing password). */
export const createUser = mutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
    if (existing) throw new Error('Email already registered');
    const now = Date.now();
    await ctx.db.insert('users', {
      email: args.email,
      passwordHash: args.passwordHash,
      name: args.name,
      createdAt: now,
    });
    return { ok: true };
  },
});

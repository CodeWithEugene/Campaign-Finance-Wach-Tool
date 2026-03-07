import { internalQuery, mutation } from './_generated/server';
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

/** Default admin: admin@cfwt.com / Admin123! — run once to seed (e.g. from Convex dashboard). */
const DEFAULT_ADMIN_EMAIL = 'admin@cfwt.com';
const DEFAULT_ADMIN_NAME = 'Admin';
const DEFAULT_ADMIN_PASSWORD_HASH = '$2a$10$4FnXBPVVpwKG4nEVDyoifufuyUN6GIM.qDBdx3TgD5Bw0RwXevy1q';

/** Insert the default admin if no admin exists. Safe to run multiple times. */
export const seedDefaultAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query('admins')
      .withIndex('by_email', (q) => q.eq('email', DEFAULT_ADMIN_EMAIL))
      .first();
    if (existing) return { ok: true, message: 'Admin already exists' };
    const now = Date.now();
    await ctx.db.insert('admins', {
      email: DEFAULT_ADMIN_EMAIL,
      passwordHash: DEFAULT_ADMIN_PASSWORD_HASH,
      name: DEFAULT_ADMIN_NAME,
      createdAt: now,
    });
    return { ok: true, message: 'Default admin created (admin@cfwt.com / Admin123!)' };
  },
});

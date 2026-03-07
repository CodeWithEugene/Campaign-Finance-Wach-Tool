import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: { userId: v.string(), unreadOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query('notifications')
      .withIndex('by_user', (e) => e.eq('userId', args.userId));
    if (args.unreadOnly) {
      q = ctx.db
        .query('notifications')
        .withIndex('by_user_unread', (e) =>
          e.eq('userId', args.userId).eq('read', false)
        );
    }
    return await q.order('desc').take(50);
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    body: v.optional(v.string()),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId || args.userId.trim() === '') {
      throw new Error('userId is required');
    }
    return await ctx.db.insert('notifications', {
      ...args,
      read: false,
      createdAt: Date.now(),
    });
  },
});

export const markRead = mutation({
  args: { id: v.id('notifications'), userId: v.string() },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.id);
    if (!notification) throw new Error('Notification not found');
    // Verify the caller owns this notification
    if (notification.userId !== args.userId) {
      throw new Error('Not authorized to modify this notification');
    }
    await ctx.db.patch(args.id, { read: true });
    return args.id;
  },
});

export const markAllRead = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    if (!args.userId || args.userId.trim() === '') {
      throw new Error('userId is required');
    }
    const list = await ctx.db
      .query('notifications')
      .withIndex('by_user_unread', (e) =>
        e.eq('userId', args.userId).eq('read', false)
      )
      .collect();
    for (const n of list) await ctx.db.patch(n._id, { read: true });
    return list.length;
  },
});

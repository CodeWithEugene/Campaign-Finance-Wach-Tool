import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { reportCategoryValidator, reportStatusValidator } from './schema';

export const list = query({
  args: {
    status: v.optional(reportStatusValidator),
    category: v.optional(reportCategoryValidator),
    county: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const q = args.status
      ? ctx.db.query('reports').withIndex('by_status', (e) => e.eq('status', args.status!))
      : args.category
        ? ctx.db.query('reports').withIndex('by_category', (e) => e.eq('category', args.category!))
        : args.county
          ? ctx.db.query('reports').withIndex('by_county', (e) => e.eq('county', args.county!))
          : ctx.db.query('reports').withIndex('by_created');
    return await q.order('desc').take(args.limit ?? 100);
  },
});

export const search = query({
  args: {
    searchTerm: v.string(),
    status: v.optional(reportStatusValidator),
    category: v.optional(reportCategoryValidator),
    county: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const q = ctx.db.query('reports').withSearchIndex('search_title', (idx) => {
      const withSearch = idx.search('title', args.searchTerm);
      if (args.status && args.category && args.county) return withSearch.eq('status', args.status).eq('category', args.category).eq('county', args.county);
      if (args.status && args.category) return withSearch.eq('status', args.status).eq('category', args.category);
      if (args.status && args.county) return withSearch.eq('status', args.status).eq('county', args.county);
      if (args.category && args.county) return withSearch.eq('category', args.category).eq('county', args.county);
      if (args.status) return withSearch.eq('status', args.status);
      if (args.category) return withSearch.eq('category', args.category);
      if (args.county) return withSearch.eq('county', args.county);
      return withSearch;
    });
    return await q.take(args.limit ?? 50);
  },
});

export const get = query({
  args: { id: v.id('reports') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: reportCategoryValidator,
    location: v.string(),
    county: v.optional(v.string()),
    anonymous: v.boolean(),
    email: v.optional(v.string()),
    mediaIds: v.optional(v.array(v.id('_storage'))),
    source: v.optional(v.union(v.literal('web'), v.literal('ussd'), v.literal('sms'))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('reports', {
      ...args,
      status: 'submitted',
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id('reports'),
    status: reportStatusValidator,
    adminEmail: v.string(),
    internalNotes: v.optional(v.string()),
    publicVerificationNote: v.optional(v.string()),
    assignToSelf: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.id);
    if (!report) throw new Error('Report not found');
    const prevStatus = report.status;
    const now = Date.now();
    const auditEntry = {
      at: now,
      by: args.adminEmail,
      action: 'status_change',
      fromStatus: prevStatus,
      toStatus: args.status,
    };
    const auditLog = [...(report.auditLog ?? []), auditEntry];
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: now,
      auditLog,
      ...(args.internalNotes !== undefined && { internalNotes: args.internalNotes }),
      ...(args.publicVerificationNote !== undefined && {
        publicVerificationNote: args.publicVerificationNote,
      }),
      ...(args.assignToSelf && { assignedTo: args.adminEmail }),
    });
    return args.id;
  },
});

export const assign = mutation({
  args: {
    id: v.id('reports'),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.id);
    if (!report) throw new Error('Report not found');
    const now = Date.now();
    const auditLog = [
      ...(report.auditLog ?? []),
      { at: now, by: args.adminEmail, action: 'assigned' },
    ];
    await ctx.db.patch(args.id, {
      assignedTo: args.adminEmail,
      updatedAt: now,
      auditLog,
    });
    return args.id;
  },
});

export const addNote = mutation({
  args: {
    id: v.id('reports'),
    adminEmail: v.string(),
    internalNotes: v.optional(v.string()),
    publicVerificationNote: v.optional(v.string()),
    linkedReportIds: v.optional(v.array(v.id('reports'))),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.id);
    if (!report) throw new Error('Report not found');
    const now = Date.now();
    const updates: Record<string, unknown> = { updatedAt: now };
    if (args.internalNotes !== undefined) updates.internalNotes = args.internalNotes;
    if (args.publicVerificationNote !== undefined)
      updates.publicVerificationNote = args.publicVerificationNote;
    if (args.linkedReportIds !== undefined) updates.linkedReportIds = args.linkedReportIds;
    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

export const listForMap = query({
  args: {
    status: v.optional(reportStatusValidator),
    category: v.optional(reportCategoryValidator),
  },
  handler: async (ctx, args) => {
    const q = args.status
      ? ctx.db.query('reports').withIndex('by_status', (e) => e.eq('status', args.status!))
      : args.category
        ? ctx.db.query('reports').withIndex('by_category', (e) => e.eq('category', args.category!))
        : ctx.db.query('reports').withIndex('by_created');
    const reports = await q.order('desc').take(500);
    return reports.map((r) => ({
      _id: r._id,
      title: r.title,
      category: r.category,
      location: r.location,
      county: r.county,
      status: r.status,
      latitude: undefined,
      longitude: undefined,
    }));
  },
});

export const dashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('reports').collect();
    const byStatus: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const byCounty: Record<string, number> = {};
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    let thisWeek = 0;
    let thisMonth = 0;
    for (const r of all) {
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
      byCategory[r.category] = (byCategory[r.category] ?? 0) + 1;
      if (r.county) byCounty[r.county] = (byCounty[r.county] ?? 0) + 1;
      if (r.createdAt >= now - oneWeek) thisWeek++;
      if (r.createdAt >= now - oneMonth) thisMonth++;
    }
    return {
      total: all.length,
      thisWeek,
      thisMonth,
      byStatus,
      byCategory,
      topCounties: Object.entries(byCounty)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count })),
      recentReports: all
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 10)
        .map((r) => ({
          _id: r._id,
          title: r.title,
          category: r.category,
          createdAt: r.createdAt,
        })),
    };
  },
});

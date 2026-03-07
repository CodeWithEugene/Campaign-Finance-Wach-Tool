import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const reportCategories = [
  'vote-buying',
  'illegal-donations',
  'misuse-public-resources',
  'undeclared-spending',
  'bribery',
  'other',
] as const;

export const reportStatuses = [
  'submitted',
  'under_review',
  'verified',
  'unverified',
  'needs_more_info',
] as const;

export type ReportStatus = (typeof reportStatuses)[number];
export type ReportCategory = (typeof reportCategories)[number];

export const reportCategoryValidator = v.union(
  v.literal('vote-buying'),
  v.literal('illegal-donations'),
  v.literal('misuse-public-resources'),
  v.literal('undeclared-spending'),
  v.literal('bribery'),
  v.literal('other')
);

export const reportStatusValidator = v.union(
  v.literal('submitted'),
  v.literal('under_review'),
  v.literal('verified'),
  v.literal('unverified'),
  v.literal('needs_more_info')
);

export default defineSchema({
  reports: defineTable({
    title: v.string(),
    description: v.string(),
    category: reportCategoryValidator,
    location: v.string(),
    county: v.optional(v.string()),
    anonymous: v.boolean(),
    email: v.optional(v.string()),
    status: reportStatusValidator,
    mediaIds: v.optional(v.array(v.id('_storage'))),
    source: v.optional(v.union(v.literal('web'), v.literal('ussd'), v.literal('sms'))),
    assignedTo: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    publicVerificationNote: v.optional(v.string()),
    linkedReportIds: v.optional(v.array(v.id('reports'))),
    auditLog: v.optional(
      v.array(
        v.object({
          at: v.number(),
          by: v.string(),
          action: v.string(),
          fromStatus: v.optional(v.string()),
          toStatus: v.optional(v.string()),
        })
      )
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_status', ['status'])
    .index('by_category', ['category'])
    .index('by_county', ['county'])
    .index('by_created', ['createdAt'])
    .searchIndex('search_title', {
      searchField: 'title',
      filterFields: ['status', 'category', 'county'],
    }),

  contributions: defineTable({
    amount: v.number(),
    partyId: v.string(),
    partyName: v.string(),
    paystackReference: v.optional(v.string()),
    status: v.union(
      v.literal('pending'),
      v.literal('success'),
      v.literal('failed'),
      v.literal('abandoned')
    ),
    email: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_party', ['partyId'])
    .index('by_status', ['status'])
    .index('by_created', ['createdAt']),

  parties: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
  }).index('by_slug', ['slug']),

  newsletter_subscribers: defineTable({
    email: v.string(),
    preferences: v.optional(v.object({
      alerts: v.optional(v.boolean()),
      digest: v.optional(v.boolean()),
    })),
    optedIn: v.boolean(),
    subscribedAt: v.number(),
  }).index('by_email', ['email']),

  admins: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_email', ['email']),

  users: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_email', ['email']),

  notifications: defineTable({
    userId: v.string(),
    title: v.string(),
    body: v.optional(v.string()),
    link: v.optional(v.string()),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_unread', ['userId', 'read']),
});

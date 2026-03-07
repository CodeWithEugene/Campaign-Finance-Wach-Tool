/** Convex action that the Paystack webhook Next.js route invokes (server-to-server). */
'use node';

import { action } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';

export const processPaystackWebhook = action({
  args: {
    paystackReference: v.string(),
    status: v.union(v.literal('success'), v.literal('failed'), v.literal('abandoned')),
  },
  handler: async (ctx, args): Promise<Id<'contributions'> | null> => {
    return await ctx.runMutation(internal.contributions.updateFromWebhook, args);
  },
});

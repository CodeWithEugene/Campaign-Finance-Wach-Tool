'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

// Use a placeholder URL when env is missing so ConvexProvider always wraps the tree.
// This prevents "Could not find Convex client" during Next.js static prerender (e.g. on Vercel).
// At runtime without a real URL, Convex features will not work; set NEXT_PUBLIC_CONVEX_URL for production.
const convexUrl =
  typeof process.env.NEXT_PUBLIC_CONVEX_URL === 'string' && process.env.NEXT_PUBLIC_CONVEX_URL
    ? process.env.NEXT_PUBLIC_CONVEX_URL
    : 'https://placeholder.convex.cloud';
const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

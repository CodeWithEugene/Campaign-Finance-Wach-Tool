/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Resets per-IP counters after the window expires.
 *
 * For production at scale, replace with a Redis/Upstash-backed limiter.
 */

interface RateRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateRecord>();

export interface RateLimitOptions {
  /** Max allowed requests in the window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
}

export function checkRateLimit(
  ip: string,
  key: string,
  { limit, windowMs }: RateLimitOptions
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const storeKey = `${key}:${ip}`;
  let record = store.get(storeKey);

  if (!record || now >= record.resetAt) {
    record = { count: 0, resetAt: now + windowMs };
    store.set(storeKey, record);
  }

  record.count += 1;
  const allowed = record.count <= limit;
  const remaining = Math.max(0, limit - record.count);
  return { allowed, remaining, resetAt: record.resetAt };
}

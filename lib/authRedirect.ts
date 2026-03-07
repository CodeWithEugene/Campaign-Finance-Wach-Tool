/**
 * Safe callback URL for post-login/signup redirects.
 * Prevents open redirects: only allow relative paths (e.g. /en/dashboard).
 */
export function getSafeCallbackUrl(callbackUrl: string | null, locale: string): string {
  const fallback = `/${locale}`;
  if (!callbackUrl || typeof callbackUrl !== 'string') return fallback;
  const trimmed = callbackUrl.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback;
  return trimmed;
}

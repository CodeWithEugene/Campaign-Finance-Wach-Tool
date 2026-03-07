'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { getSafeCallbackUrl } from '@/lib/authRedirect';

function getErrorMessage(errorParam: string | null): string {
  if (errorParam === 'Configuration') return 'Sign-in is temporarily unavailable. Please try again later or contact support.';
  if (errorParam === 'SigninFailed') return 'Sign-in failed. Please try again.';
  if (errorParam === 'Credentials') return 'Invalid email or password.';
  return '';
}

function LoginForm() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get('callbackUrl'), locale);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const err = searchParams.get('error');
    if (err) setError(getErrorMessage(err));
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) {
      setLoading(false);
      const isConfigError =
        res.error === 'Configuration' ||
        res.error?.toLowerCase().includes('configuration') ||
        res.url?.includes('error=Configuration');
      setError(
        isConfigError
          ? 'Sign-in is temporarily unavailable. Please try again later or contact support.'
          : 'Invalid email or password.'
      );
      return;
    }
    await router.push(callbackUrl);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="fade-in-up">
        <h1 className="font-display font-black text-2xl mb-2">Sign in</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Sign in to access reports, map, dashboard, and more.
        </p>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
              />
            </div>
            {error && <p className="text-sm text-[var(--accent-2)]">{error}</p>}
            <p className="text-xs text-[var(--text-secondary)]">
              By signing in, you agree to our{' '}
              <Link
                href={`/${locale}/terms`}
                className="text-[var(--accent-1)] font-medium hover:underline"
              >
                terms and conditions about data privacy
              </Link>
              .
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--accent-1)] text-white font-bold rounded-lg disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </Card>
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Don&apos;t have an account?{' '}
          <Link
            href={`/${locale}/signup${callbackUrl !== `/${locale}` ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
            className="text-[var(--accent-1)] font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-16 animate-pulse">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

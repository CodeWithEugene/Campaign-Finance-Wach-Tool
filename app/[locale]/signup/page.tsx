'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { validatePassword } from '@/lib/password';
import { getSafeCallbackUrl } from '@/lib/authRedirect';

function SignupForm() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get('callbackUrl'), locale);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const pwValidation = validatePassword(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!pwValidation.valid) {
      setError(pwValidation.error ?? 'Password does not meet requirements.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }
      const signInRes = await signIn('credentials', { email, password, redirect: false });
      if (signInRes?.error) {
        setError('Account created but sign-in failed. Please try signing in.');
        setLoading(false);
        return;
      }
      await router.push(callbackUrl);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="fade-in-up">
        <h1 className="font-display font-black text-2xl mb-2">Sign up</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Create an account to access reports, map, dashboard, and more.
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
              <label className="block text-sm font-medium mb-1">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                minLength={8}
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
                aria-describedby="password-requirements"
              />
              <p id="password-requirements" className="text-xs text-[var(--text-secondary)] mt-1 mb-1">
                Must include:
              </p>
              <ul className="text-xs text-[var(--text-secondary)] list-disc list-inside space-y-0.5">
                <li className={pwValidation.checks.minLength ? 'text-green-600 dark:text-green-400' : ''}>
                  At least 8 characters{pwValidation.checks.minLength ? ' ✓' : ''}
                </li>
                <li className={pwValidation.checks.uppercase ? 'text-green-600 dark:text-green-400' : ''}>
                  One uppercase letter{pwValidation.checks.uppercase ? ' ✓' : ''}
                </li>
                <li className={pwValidation.checks.lowercase ? 'text-green-600 dark:text-green-400' : ''}>
                  One lowercase letter{pwValidation.checks.lowercase ? ' ✓' : ''}
                </li>
                <li className={pwValidation.checks.number ? 'text-green-600 dark:text-green-400' : ''}>
                  One number{pwValidation.checks.number ? ' ✓' : ''}
                </li>
                <li className={pwValidation.checks.special ? 'text-green-600 dark:text-green-400' : ''}>
                  One special character (!@#$%^&* etc.){pwValidation.checks.special ? ' ✓' : ''}
                </li>
              </ul>
            </div>
            {error && <p className="text-sm text-[var(--accent-2)]">{error}</p>}
            <p className="text-xs text-[var(--text-secondary)]">
              By signing up, you agree to our{' '}
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
              disabled={loading || !pwValidation.valid}
              className="w-full py-3 bg-[var(--accent-1)] text-white font-bold rounded-lg disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
        </Card>
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link
            href={`/${locale}/login${callbackUrl !== `/${locale}` ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
            className="text-[var(--accent-1)] font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-16 animate-pulse">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}

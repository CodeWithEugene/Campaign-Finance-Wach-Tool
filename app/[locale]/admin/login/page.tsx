'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';

export default function AdminLoginPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || `/${locale}/admin`;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError('Invalid email or password.');
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="fade-in-up">
        <h1 className="font-display font-black text-2xl mb-2">Admin sign in</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Sign in to review and verify reports.
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
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--accent-1)] text-white font-bold rounded-lg disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

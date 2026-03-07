'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { Mail } from 'lucide-react';

export default function AlertsPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const subscribe = useMutation(api.newsletter.subscribe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await subscribe({ email, preferences: { alerts: true, digest: true } });
      setSubmitted(true);
    } catch {
      setError('Subscription failed. Try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-10 h-10 text-[var(--accent-1)]" />
          <h1 className="font-display font-black text-3xl lg:text-4xl">
            Newsletter Signup
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] mb-8">
          Get alerts for new reports, top categories, and map updates.
        </p>

        {submitted ? (
          <Card>
            <p className="text-[var(--accent-1)] font-medium">
              Thank you! Check your email to confirm your subscription.
            </p>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card>
              {error && <p className="text-sm text-[var(--accent-2)] mb-2">{error}</p>}
              <label className="block mb-2 font-medium">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-1)] outline-none mb-4"
                placeholder="your@email.com"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[var(--accent-1)] text-white font-bold rounded-lg"
              >
                Subscribe
              </button>
            </Card>
          </form>
        )}

        <Link
          href={`/${locale}/alerts/preferences`}
          className="inline-block mt-6 text-[var(--accent-1)] hover:underline"
        >
          Manage digest preferences →
        </Link>
      </div>
    </div>
  );
}

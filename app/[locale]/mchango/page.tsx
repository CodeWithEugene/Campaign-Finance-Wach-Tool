'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/Card';

export default function MchangoPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const parties = useQuery(api.parties.list);
  const seedParties = useMutation(api.parties.seed);

  useEffect(() => {
    if (parties && parties.length === 0) {
      seedParties().catch(() => {});
    }
  }, [parties, seedParties]);
  const [party, setParty] = useState('');
  const [amount, setAmount] = useState(100);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const minAmount = 100;
  const maxAmount = 1000000;
  const partyList = (parties ?? []).length > 0 ? parties! : [
    { slug: 'uda', name: 'United Democratic Alliance' },
    { slug: 'odm', name: 'Orange Democratic Movement' },
    { slug: 'jubilee', name: 'Jubilee Party' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!party) return;
    setSubmitting(true);
    setError('');
    try {
      const partyName = partyList.find((p) => p.slug === party)?.name ?? party;
      const res = await fetch('/api/mchango/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          partyId: party,
          partyName,
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not start payment');
        setSubmitting(false);
        return;
      }
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }
      setError('Invalid response from server');
    } catch {
      setError('Network error');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div>
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Mchango — Crowdfunding
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Contribute to political parties or candidates transparently via Paystack
          (M-Pesa, cards).
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <label className="block mb-2 font-medium">
              Select party or candidate <span className="text-[var(--accent-2)]">*</span>
            </label>
            <select
              value={party}
              onChange={(e) => setParty(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-1)] outline-none"
            >
              <option value="">Choose...</option>
              {partyList.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </Card>

          <Card>
            <label className="block mb-2 font-medium">
              Amount (KES) <span className="text-[var(--accent-2)]">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={minAmount}
              max={maxAmount}
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-1)] outline-none"
            />
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Min: KES {minAmount.toLocaleString()} — Max: KES {maxAmount.toLocaleString()}
            </p>
          </Card>

          <Card>
            <h3 className="font-display font-bold mb-2">Summary</h3>
            <p className="text-[var(--text-secondary)]">
              Amount: KES {amount.toLocaleString()}
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Contributions must comply with Kenyan law. No foreign donations.
            </p>
          </Card>

          {error && <p className="text-sm text-[var(--accent-2)]">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !party}
            className="w-full py-4 bg-[var(--accent-1)] text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting ? 'Processing...' : 'Proceed to Paystack'}
          </button>
        </form>
      </div>
    </div>
  );
}

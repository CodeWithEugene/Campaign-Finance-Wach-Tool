'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';

const parties = [
  { id: 'uda', name: 'United Democratic Alliance' },
  { id: 'odm', name: 'Orange Democratic Movement' },
  { id: 'jubilee', name: 'Jubilee Party' },
];

export default function MchangoPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const [party, setParty] = useState('');
  const [amount, setAmount] = useState(100);
  const [submitting, setSubmitting] = useState(false);

  const minAmount = 100;
  const maxAmount = 1000000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!party) return;
    setSubmitting(true);
    try {
      // In production, integrate Paystack here
      // For now, simulate success
      await new Promise((r) => setTimeout(r, 1500));
      router.push(`/${locale}/mchango/success?amount=${amount}&party=${party}`);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
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
              {parties.map((p) => (
                <option key={p.id} value={p.id}>
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

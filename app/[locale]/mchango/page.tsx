'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Script from 'next/script';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { PartyCardsScroll } from '@/components/mchango/PartyCardsScroll';

// Paystack Inline JS type declaration
declare global {
  interface Window {
    PaystackPop: {
      setup(options: {
        key: string;
        email: string;
        amount: number; // in kobo (KES × 100)
        currency?: string;
        ref: string;
        metadata?: Record<string, unknown>;
        onClose: () => void;
        callback: (response: { reference: string }) => void;
      }): { openIframe(): void };
    };
  }
}

export default function MchangoPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const router = useRouter();
  const paystackReady = useRef(false);

  const parties = useQuery(api.parties.list);
  const totalsByParty = useQuery(api.contributions.totalsByParty, {}) ?? {};
  const seedParties = useMutation(api.parties.seed);
  const formSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parties && parties.length === 0) {
      seedParties().catch(() => {});
    }
  }, [parties, seedParties]);

  const handleDonateFromCard = (slug: string) => {
    setParty(slug);
    setError('');
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [party, setParty] = useState('');
  const [amount, setAmount] = useState(100);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [cancelled, setCancelled] = useState(false);

  const minAmount = 100;
  const maxAmount = 1000000;
  const partyList =
    (parties ?? []).length > 0
      ? parties!
      : [
          { slug: 'uda', name: 'United Democratic Alliance' },
          { slug: 'odm', name: 'Orange Democratic Movement' },
          { slug: 'jubilee', name: 'Jubilee Party' },
        ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!party || !email) return;
    setSubmitting(true);
    setError('');
    setCancelled(false);

    try {
      const partyName = partyList.find((p) => p.slug === party)?.name ?? party;
      const res = await fetch('/api/mchango/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, partyId: party, partyName, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not start payment');
        setSubmitting(false);
        return;
      }

      const { reference, publicKey } = data as { reference: string; publicKey: string };

      if (!reference || !publicKey || !window.PaystackPop) {
        setError('Payment service unavailable. Please try again.');
        setSubmitting(false);
        return;
      }

      // Open Paystack checkout as an in-page popup
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email,
        amount: amount * 100, // Paystack expects kobo / cents
        currency: 'KES',
        ref: reference,
        metadata: { partyId: party, partyName },
        callback(response) {
          // Payment completed — navigate to success page
          router.push(
            `/${locale}/mchango/success?reference=${response.reference}&party=${encodeURIComponent(party)}&amount=${amount}`
          );
        },
        onClose() {
          // User closed the popup without paying
          setSubmitting(false);
          setCancelled(true);
        },
      });

      handler.openIframe();
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Paystack Inline JS — loads once, lightweight */}
      <Script
        src="https://js.paystack.co/v1/inline.js"
        strategy="lazyOnload"
        onLoad={() => { paystackReady.current = true; }}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-2xl mx-auto mb-10">
          <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
            Mchango — Crowdfunding
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            Contribute to political parties or candidates transparently via Paystack
            (M-Pesa, cards).
          </p>
        </div>

        <div className="max-w-full overflow-hidden">
          <PartyCardsScroll
            parties={partyList}
            totalsByParty={totalsByParty}
            onDonate={handleDonateFromCard}
            locale={locale}
          />
        </div>

        <div ref={formSectionRef} className="max-w-2xl mx-auto mt-10">
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
              Email address <span className="text-[var(--accent-2)]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-1)] outline-none"
            />
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Your receipt will be sent here.
            </p>
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
              required
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
          {cancelled && !error && (
            <p className="text-sm text-[var(--text-secondary)]">
              Payment cancelled. You can try again below.
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !party || !email}
            className="w-full py-4 bg-[var(--accent-1)] text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting ? 'Opening checkout...' : 'Proceed to Paystack'}
          </button>
        </form>
        </div>
      </div>
    </>
  );
}

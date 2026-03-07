'use client';

import { Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const partyNames: Record<string, string> = {
  uda: 'United Democratic Alliance',
  odm: 'Orange Democratic Movement',
  jubilee: 'Jubilee Party',
};

function MchangoSuccessContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const amount = searchParams.get('amount') || '0';
  const party = searchParams.get('party') || '';
  const reference = searchParams.get('reference') || '';

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="text-center fade-in-up">
        <CheckCircle className="w-20 h-20 text-[var(--accent-1)] mx-auto mb-6" />
        <h1 className="font-display font-black text-3xl mb-4">
          Thank You!
        </h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Your contribution has been received.
        </p>
        <Card className="mb-8 text-left">
          <p className="font-mono font-bold">Amount: KES {Number(amount).toLocaleString()}</p>
          <p className="text-[var(--text-secondary)] mt-2">
            Recipient: {partyNames[party] || party}
          </p>
          {reference && (
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Reference: {reference}
            </p>
          )}
        </Card>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/mchango`}
            className="px-6 py-3 bg-[var(--accent-1)] text-white font-bold rounded-lg"
          >
            Contribute Again
          </Link>
          <Link
            href={`/${locale}/mchango/transparency`}
            className="px-6 py-3 border border-[var(--border-color)] font-bold rounded-lg hover:border-[var(--accent-1)]"
          >
            View Transparency Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MchangoSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto px-4 py-12 text-center">Loading...</div>}>
      <MchangoSuccessContent />
    </Suspense>
  );
}

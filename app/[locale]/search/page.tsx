'use client';

import { Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { VerificationBadge } from '@/components/shared/VerificationBadge';

function SearchContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const q = searchParams.get('q')?.trim() || '';
  const reports = useQuery(
    api.reports.search,
    q.length >= 2 ? { searchTerm: q, limit: 50 } : 'skip'
  );

  const displayStatus = (s: string) =>
    s === 'verified' ? 'verified' : s === 'under_review' ? 'under_review' : 'unverified';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="font-display font-black text-2xl mb-6">
        Search reports
      </h1>
      {!q && (
        <p className="text-[var(--text-secondary)]">
          Use the search box in the header and enter at least 2 characters.
        </p>
      )}
      {q && q.length < 2 && (
        <p className="text-[var(--text-secondary)]">
          Enter at least 2 characters to search.
        </p>
      )}
      {q.length >= 2 && (
        <>
          <p className="text-[var(--text-secondary)] mb-6">
            Results for &quot;{q}&quot;
          </p>
          {reports === undefined && <p>Loading...</p>}
          {reports?.length === 0 && reports !== undefined && (
            <p className="text-[var(--text-secondary)]">No reports found.</p>
          )}
          <div className="space-y-4">
            {reports?.map((r) => (
              <Link key={r._id} href={`/${locale}/reports/${r._id}`}>
                <Card className="hover:border-[var(--accent-1)]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-display font-bold">{r.title}</h2>
                    <VerificationBadge status={displayStatus(r.status)} />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {r.category.replace(/-/g, ' ')} • {r.county || r.location} • {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

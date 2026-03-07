'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { Download } from 'lucide-react';

const categoryOptions = [
  { value: '', label: 'All categories' },
  { value: 'vote-buying', label: 'Vote buying' },
  { value: 'illegal-donations', label: 'Illegal donations' },
  { value: 'misuse-public-resources', label: 'Misuse of public resources' },
  { value: 'undeclared-spending', label: 'Undeclared spending' },
  { value: 'bribery', label: 'Bribery' },
  { value: 'other', label: 'Other' },
];

export default function ReportsPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const [category, setCategory] = useState('');
  const reports = useQuery(
    api.reports.list,
    category ? { category: category as 'vote-buying' | 'illegal-donations' | 'misuse-public-resources' | 'undeclared-spending' | 'bribery' | 'other' } : {}
  );

  const exportUrl = () => {
    const params = new URLSearchParams({ format: 'csv' });
    if (category) params.set('category', category);
    return `/api/export/reports?${params.toString()}`;
  };

  const displayStatus = (s: string) =>
    s === 'verified' ? 'verified' : s === 'under_review' ? 'under_review' : 'unverified';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
              Reports
            </h1>
            <p className="text-[var(--text-secondary)]">
              Browse and filter campaign finance reports
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
            >
              {categoryOptions.map((o) => (
                <option key={o.value || 'all'} value={o.value}>{o.label}</option>
              ))}
            </select>
            <a
              href={exportUrl()}
              download
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-1)] text-white font-bold"
              aria-label="Export CSV"
            >
              <Download className="w-4 h-4" /> Export
            </a>
          </div>
        </div>

        <div className="space-y-4">
          {reports === undefined && <p className="text-[var(--text-secondary)]">Loading...</p>}
          {reports?.length === 0 && reports !== undefined && (
            <p className="text-[var(--text-secondary)]">No reports yet.</p>
          )}
          {reports?.map((r) => (
            <Link key={r._id} href={`/${locale}/reports/${r._id}`}>
              <Card className="hover:border-[var(--accent-1)] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="font-display font-bold text-lg">{r.title}</h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {r.category.replace(/-/g, ' ')} • {r.county || r.location} • {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <VerificationBadge status={displayStatus(r.status)} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

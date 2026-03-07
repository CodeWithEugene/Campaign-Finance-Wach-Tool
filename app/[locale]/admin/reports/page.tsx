'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';

const statuses = ['submitted', 'under_review', 'verified', 'unverified', 'needs_more_info'] as const;

export default function AdminReportsListPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const [statusFilter, setStatusFilter] = useState<string>('');
  const reports = useQuery(
    api.reports.list,
    statusFilter ? { status: statusFilter as (typeof statuses)[number] } : {}
  );

  if (reports === undefined) {
    return <div className="py-12 text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-display font-black text-2xl mb-4">Reports</h1>
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {reports.map((r) => (
          <Link key={r._id} href={`/${locale}/admin/reports/${r._id}`}>
            <Card className="hover:border-[var(--accent-1)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display font-bold">{r.title}</h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {r.category} • {r.location} • {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    r.status === 'verified'
                      ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                      : r.status === 'unverified'
                        ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                        : 'bg-gray-500/20'
                  }`}
                >
                  {r.status.replace(/_/g, ' ')}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

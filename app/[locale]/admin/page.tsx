'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminDashboardPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const stats = useQuery(api.reports.dashboardStats);

  if (stats === undefined) {
    return <div className="py-12 text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-display font-black text-2xl mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
          <p className="text-sm text-[var(--text-secondary)]">Total reports</p>
          <p className="font-display font-black text-2xl">{stats.total}</p>
        </div>
        <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
          <p className="text-sm text-[var(--text-secondary)]">This week</p>
          <p className="font-display font-black text-2xl">{stats.thisWeek}</p>
        </div>
        <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
          <p className="text-sm text-[var(--text-secondary)]">This month</p>
          <p className="font-display font-black text-2xl">{stats.thisMonth}</p>
        </div>
        <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
          <p className="text-sm text-[var(--text-secondary)]">Verified</p>
          <p className="font-display font-black text-2xl">{stats.byStatus?.verified ?? 0}</p>
        </div>
      </div>
      <div>
        <h2 className="font-display font-bold text-lg mb-4">Recent reports</h2>
        <ul className="space-y-2">
          {(stats.recentReports ?? []).slice(0, 10).map((r) => (
            <li key={r._id}>
              <Link
                href={`/${locale}/admin/reports/${r._id}`}
                className="text-[var(--accent-1)] hover:underline"
              >
                {r.title}
              </Link>
              <span className="text-[var(--text-secondary)] text-sm ml-2">
                {r.category} • {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

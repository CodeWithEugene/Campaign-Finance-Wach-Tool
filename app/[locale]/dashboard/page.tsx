'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const PIE_COLORS = ['var(--accent-1)', 'var(--accent-2)', 'var(--accent-3)', 'var(--text-secondary)', '#888', '#aaa'];

export default function DashboardPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const stats = useQuery(api.reports.dashboardStats);

  const categoryData = stats?.byCategory
    ? Object.entries(stats.byCategory).map(([name, value], i) => ({
        name: name.replace(/-/g, ' '),
        value,
        color: PIE_COLORS[i % PIE_COLORS.length],
      }))
    : [];

  const statusData = stats?.byStatus
    ? Object.entries(stats.byStatus).map(([name, count]) => ({
        name: name.replace(/_/g, ' '),
        count,
      }))
    : [];

  const topCounties = stats?.topCounties?.slice(0, 5) ?? [];
  const recentReports = stats?.recentReports ?? [];

  if (stats === undefined) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  const hasNoData = stats.total === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {hasNoData && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200">
          <p className="font-medium">No data yet.</p>
          <p className="text-sm mt-1">
            If you deployed to Vercel, set <code className="bg-black/10 px-1 rounded">NEXT_PUBLIC_CONVEX_URL</code> and <code className="bg-black/10 px-1 rounded">CONVEX_URL</code> to your Convex deployment URL (e.g. <code className="bg-black/10 px-1 rounded">https://neighborly-albatross-355.convex.cloud</code>) in Project Settings → Environment Variables, then redeploy.
          </p>
        </div>
      )}
      <div>
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Overview Dashboard
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Campaign finance reports and statistics
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Reports', value: stats.total.toLocaleString(), href: `/${locale}/reports` },
            { label: 'This Month', value: String(stats.thisMonth), href: `/${locale}/reports` },
            { label: 'This Week', value: String(stats.thisWeek), href: `/${locale}/reports` },
            { label: 'Verified', value: String(stats.byStatus?.verified ?? 0), href: `/${locale}/reports` },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="block p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl hover:border-[var(--accent-1)] transition-colors"
            >
              <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
              <p className="font-display font-black text-3xl mt-1">{stat.value}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="font-display font-bold text-xl mb-6">Reports by Category</h2>
            <div className="h-[300px]">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-[var(--text-secondary)]">No data yet.</p>
              )}
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="font-display font-bold text-xl mb-6">Reports by Status</h2>
            <div className="h-[300px]">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                      }}
                    />
                    <Bar dataKey="count" fill="var(--accent-1)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-[var(--text-secondary)]">No data yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="font-display font-bold text-xl mb-6">Top 5 Counties</h2>
            <ul className="space-y-3">
              {topCounties.length === 0 && <p className="text-[var(--text-secondary)]">No data yet.</p>}
              {topCounties.map((c) => (
                <li key={c.name} className="flex justify-between items-center">
                  <Link
                    href={`/${locale}/counties/${c.name.toLowerCase()}`}
                    className="text-[var(--accent-1)] hover:underline"
                  >
                    {c.name}
                  </Link>
                  <span className="font-mono font-bold">{c.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
            <h2 className="font-display font-bold text-xl mb-6">Recent Reports</h2>
            <ul className="space-y-3">
              {recentReports.length === 0 && <p className="text-[var(--text-secondary)]">No reports yet.</p>}
              {recentReports.map((r) => (
                <li key={r._id}>
                  <Link
                    href={`/${locale}/reports/${r._id}`}
                    className="block p-3 rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
                  >
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {r.category.replace(/-/g, ' ')} • {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/reports`}
              className="inline-block mt-4 text-[var(--accent-1)] hover:underline font-medium"
            >
              View all reports →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

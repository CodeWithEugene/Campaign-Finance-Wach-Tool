'use client';

import Link from 'next/link';
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

const categoryData = [
  { name: 'Vote buying', value: 45, color: 'var(--accent-1)' },
  { name: 'Misuse', value: 30, color: 'var(--accent-2)' },
  { name: 'Illegal donations', value: 15, color: 'var(--accent-3)' },
  { name: 'Other', value: 10, color: 'var(--text-secondary)' },
];

const statusData = [
  { name: 'Under review', count: 60 },
  { name: 'Verified', count: 25 },
  { name: 'Unverified', count: 15 },
];

const topCounties = [
  { name: 'Nairobi', count: 45 },
  { name: 'Mombasa', count: 28 },
  { name: 'Kisumu', count: 22 },
  { name: 'Nakuru', count: 18 },
  { name: 'Eldoret', count: 15 },
];

const recentReports = [
  { id: '1', title: 'Vote buying at rally', category: 'Vote buying', date: '2024-01-15' },
  { id: '2', title: 'Government vehicle misuse', category: 'Misuse', date: '2024-01-14' },
  { id: '3', title: 'Undeclared campaign spend', category: 'Undeclared', date: '2024-01-13' },
];

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Overview Dashboard
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Campaign finance reports and statistics
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Reports', value: '1,247', href: '/reports' },
            { label: 'This Month', value: '89', href: '/reports' },
            { label: 'This Week', value: '23', href: '/reports' },
            { label: 'Verified', value: '312', href: '/reports' },
          ].map((stat, i) => (
            <div
              key={stat.label}
             
             
             
            >
              <Link
                href={stat.href}
                className="block p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl hover:border-[var(--accent-1)] transition-colors"
              >
                <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
                <p className="font-display font-black text-3xl mt-1">{stat.value}</p>
              </Link>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div
           
           
           
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6"
          >
            <h2 className="font-display font-bold text-xl mb-6">
              Reports by Category
            </h2>
            <div className="h-[300px]">
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
            </div>
          </div>

          <div
           
           
           
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6"
          >
            <h2 className="font-display font-bold text-xl mb-6">
              Reports by Status
            </h2>
            <div className="h-[300px]">
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
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div
           
           
           
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6"
          >
            <h2 className="font-display font-bold text-xl mb-6">
              Top 5 Counties
            </h2>
            <ul className="space-y-3">
              {topCounties.map((c) => (
                <li key={c.name} className="flex justify-between items-center">
                  <Link
                    href={`/counties/${c.name.toLowerCase()}`}
                    className="text-[var(--accent-1)] hover:underline"
                  >
                    {c.name}
                  </Link>
                  <span className="font-mono font-bold">{c.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
           
           
           
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6"
          >
            <h2 className="font-display font-bold text-xl mb-6">
              Recent Reports
            </h2>
            <ul className="space-y-3">
              {recentReports.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/reports/${r.id}`}
                    className="block p-3 rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
                  >
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {r.category} • {r.date}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/reports"
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

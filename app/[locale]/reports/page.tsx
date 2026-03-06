'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { Download } from 'lucide-react';

const reports = [
  { id: '1', title: 'Vote buying at rally', category: 'Vote buying', county: 'Nairobi', date: '2024-01-15', status: 'verified' as const },
  { id: '2', title: 'Government vehicle misuse', category: 'Misuse', county: 'Mombasa', date: '2024-01-14', status: 'under_review' as const },
  { id: '3', title: 'Undeclared campaign spend', category: 'Undeclared', county: 'Kisumu', date: '2024-01-13', status: 'unverified' as const },
];

export default function ReportsPage() {
  const [category, setCategory] = useState('All');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
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
              <option value="All">All categories</option>
              <option value="Vote buying">Vote buying</option>
              <option value="Misuse">Misuse</option>
              <option value="Undeclared">Undeclared</option>
            </select>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-1)] text-white font-bold"
              aria-label="Export CSV"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {reports.map((r) => (
            <Link key={r.id} href={`/reports/${r.id}`}>
              <Card className="hover:border-[var(--accent-1)] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="font-display font-bold text-lg">{r.title}</h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {r.category} • {r.county} • {r.date}
                    </p>
                  </div>
                  <VerificationBadge status={r.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

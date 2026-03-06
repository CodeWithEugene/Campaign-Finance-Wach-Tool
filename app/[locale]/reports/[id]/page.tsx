'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { Download } from 'lucide-react';

export default function ReportDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const report = {
    id,
    title: 'Vote buying at rally',
    description: 'Cash was distributed to voters at a campaign rally in Nairobi. Witnesses observed envelopes being handed out.',
    category: 'Vote buying',
    county: 'Nairobi',
    date: '2024-01-15',
    status: 'verified' as const,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="fade-in-up">
        <Link
          href="/reports"
          className="inline-block text-[var(--accent-1)] hover:underline mb-6"
        >
          ← Back to reports
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
              {report.title}
            </h1>
            <p className="text-[var(--text-secondary)]">
              {report.category} • {report.county} • {report.date}
            </p>
          </div>
          <div className="flex gap-2">
            <VerificationBadge status={report.status} />
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent-1)]"
              aria-label="Export report"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        <Card className="mb-8">
          <h2 className="font-display font-bold text-lg mb-4">Description</h2>
          <p className="text-[var(--text-secondary)]">{report.description}</p>
        </Card>

        {report.status === 'verified' && (
          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Evidence</h2>
            <p className="text-[var(--text-secondary)]">
              Verified via cross-reference with media report. Link to source
              available to verified reviewers.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

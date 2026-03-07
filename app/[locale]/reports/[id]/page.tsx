'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Card } from '@/components/ui/Card';
import { VerificationBadge } from '@/components/shared/VerificationBadge';
import { Download } from 'lucide-react';

export default function ReportDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const id = params?.id as Id<'reports'>;
  const report = useQuery(api.reports.get, id ? { id } : 'skip');

  const displayStatus = report
    ? report.status === 'verified'
      ? 'verified'
      : report.status === 'under_review'
        ? 'under_review'
        : 'unverified'
    : null;

  if (report === undefined) return <div className="max-w-4xl mx-auto px-4 py-12">Loading...</div>;
  if (report === null) return <div className="max-w-4xl mx-auto px-4 py-12">Report not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="fade-in-up">
        <Link
          href={`/${locale}/reports`}
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
              {report.category.replace(/-/g, ' ')} • {report.county || report.location} • {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            {displayStatus && <VerificationBadge status={displayStatus} />}
            <a
              href="/api/export/reports?format=csv"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent-1)]"
              aria-label="Export report"
            >
              <Download className="w-4 h-4" /> Export
            </a>
          </div>
        </div>

        <Card className="mb-8">
          <h2 className="font-display font-bold text-lg mb-4">Description</h2>
          <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{report.description}</p>
        </Card>

        {report.publicVerificationNote && (
          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Verification note</h2>
            <p className="text-[var(--text-secondary)]">{report.publicVerificationNote}</p>
          </Card>
        )}

        {report.status === 'verified' && !report.publicVerificationNote && (
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

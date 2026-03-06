'use client';

import { Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

function ReportSuccessContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const reportId = searchParams.get('id') || 'N/A';

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="text-center fade-in-up">
        <CheckCircle className="w-20 h-20 text-[var(--accent-1)] mx-auto mb-6" />
        <h1 className="font-display font-black text-3xl mb-4">
          Report Submitted
        </h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Thank you. Your report has been received and will be reviewed.
        </p>
        <Card className="mb-8">
          <p className="font-mono font-bold text-lg">Report ID: {reportId}</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Save this ID for reference.
          </p>
        </Card>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/report`}
            className="px-6 py-3 bg-[var(--accent-1)] text-white font-bold rounded-lg"
          >
            Submit Another Report
          </Link>
          <Link
            href={`/${locale}/reports`}
            className="px-6 py-3 border border-[var(--border-color)] font-bold rounded-lg hover:border-[var(--accent-1)]"
          >
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReportSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto px-4 py-12 text-center">Loading...</div>}>
      <ReportSuccessContent />
    </Suspense>
  );
}

'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Smartphone } from 'lucide-react';

export default function ReportUssdPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <article className="fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="w-10 h-10 text-[var(--accent-1)]" />
          <h1 className="font-display font-black text-3xl lg:text-4xl">
            Report via USSD
          </h1>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Dial from your phone
            </h2>
            <p className="text-2xl font-mono font-bold text-[var(--accent-1)] mb-4">
              *384*1234#
            </p>
            <p className="text-[var(--text-secondary)]">
              Works on any mobile phone — no smartphone or internet required.
            </p>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Menu Flow
            </h2>
            <ol className="space-y-2 text-[var(--text-secondary)] list-decimal list-inside">
              <li>Select language (1 English, 2 Kiswahili)</li>
              <li>Select category (Vote buying, Illegal donations, etc.)</li>
              <li>Enter brief description (max 160 characters)</li>
              <li>Enter county or town</li>
              <li>Confirm and submit</li>
            </ol>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              After Submitting
            </h2>
            <p className="text-[var(--text-secondary)]">
              You will receive a confirmation message with your report ID. We
              will review your report and may follow up if more information is
              needed.
            </p>
          </Card>
        </div>

        <Link
          href="/report"
          className="inline-block mt-8 text-[var(--accent-1)] hover:underline font-medium"
        >
          ← Back to Report Form
        </Link>
      </article>
    </div>
  );
}

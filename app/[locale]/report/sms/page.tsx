'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { MessageSquare } from 'lucide-react';

export default function ReportSmsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <article className="fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-10 h-10 text-[var(--accent-1)]" />
          <h1 className="font-display font-black text-3xl lg:text-4xl">
            Report via SMS
          </h1>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              How to Report
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              Send an SMS to shortcode <strong className="text-[var(--text-primary)]">38383</strong> using this format:
            </p>
            <div className="p-4 bg-[var(--bg-primary)] rounded-lg font-mono text-sm">
              REPORT [category code] [brief description] [location]
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Category Codes
            </h2>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li><strong className="text-[var(--text-primary)]">1</strong> — Vote buying</li>
              <li><strong className="text-[var(--text-primary)]">2</strong> — Illegal donations</li>
              <li><strong className="text-[var(--text-primary)]">3</strong> — Misuse of public resources</li>
              <li><strong className="text-[var(--text-primary)]">4</strong> — Undeclared spending</li>
              <li><strong className="text-[var(--text-primary)]">5</strong> — Bribery of officials</li>
              <li><strong className="text-[var(--text-primary)]">6</strong> — Other</li>
            </ul>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Example
            </h2>
            <p className="text-[var(--text-secondary)] mb-2">
              REPORT 1 Cash given to voters at rally Nairobi
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              You will receive a confirmation with your report ID.
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

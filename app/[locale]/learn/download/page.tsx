'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { FileText } from 'lucide-react';

export default function DownloadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <article className="fade-in-up">
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-6">
          Download Resources
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Campaign Finance Summaries
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              Downloadable PDF summaries for offline reading will be available
              here. These include key information on campaign funding, the PPF
              formula, and legal limits.
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Resources are being prepared. Check back soon.
            </p>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              External Resources
            </h2>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>
                <Link
                  href="https://orpp.or.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-1)] hover:underline"
                >
                  ORPP — Political Parties Fund documents
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.iebc.or.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-1)] hover:underline"
                >
                  IEBC — Election campaign finance
                </Link>
              </li>
            </ul>
          </Card>

          <Link
            href="/learn"
            className="inline-block text-[var(--accent-1)] hover:underline font-medium"
          >
            ← Back to Learn
          </Link>
        </div>
      </article>
    </div>
  );
}

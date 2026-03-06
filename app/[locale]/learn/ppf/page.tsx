'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function PPFPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <article className="fade-in-up">
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-6">
          The 0.3% Political Parties Fund
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              What is the Political Parties Fund?
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              The Political Parties Fund receives 0.3% of National Revenue from
              the Kenyan government. This fund is administered by the Office of
              the Registrar of Political Parties (ORPP) and distributed to
              eligible political parties based on legal criteria.
            </p>
            <p className="text-[var(--text-secondary)]">
              <Link
                href="https://orpp.or.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-1)] hover:underline"
              >
                Visit ORPP (orpp.or.ke)
              </Link>
            </p>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Distribution Formula
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              The fund is distributed as follows:
            </p>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>5% — ORPP administration expenses</li>
              <li>10% — Proportional to elected representatives</li>
              <li>15% — Proportional to Special Interest Groups representatives</li>
              <li>70% — Proportional to total votes in preceding general election</li>
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

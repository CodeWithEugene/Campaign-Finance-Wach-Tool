'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function ExpenditurePeriodPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <article className="fade-in-up">
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-6">
          Expenditure Period & Election Calendar
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Campaign Expenditure Period
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              For the 2017 election, the expenditure period was set as six months
              prior to the general election. Campaign spending is tracked and
              regulated during this period.
            </p>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Kenya Election Calendar
            </h2>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>
                <strong className="text-[var(--text-primary)]">2013</strong> —
                General election
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">2017</strong> —
                General election
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">2022</strong> —
                General election
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">2027</strong> —
                Next general election (planned)
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

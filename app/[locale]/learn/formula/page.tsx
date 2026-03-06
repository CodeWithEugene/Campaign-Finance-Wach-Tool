'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function FormulaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <article className="fade-in-up">
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-6">
          PPF Distribution Formula
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Four-Way Split
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <div className="p-4 bg-[var(--bg-primary)] rounded-lg">
                <strong className="text-[var(--text-primary)]">5%</strong> — ORPP
                administration expenses
              </div>
              <div className="p-4 bg-[var(--bg-primary)] rounded-lg">
                <strong className="text-[var(--text-primary)]">10%</strong> —
                Proportional to elected representatives (MPs, Senators,
                Governors, MCAs) from last general election
              </div>
              <div className="p-4 bg-[var(--bg-primary)] rounded-lg">
                <strong className="text-[var(--text-primary)]">15%</strong> —
                Proportional to Special Interest Groups (SIG) representatives
              </div>
              <div className="p-4 bg-[var(--bg-primary)] rounded-lg">
                <strong className="text-[var(--text-primary)]">70%</strong> —
                Proportional to total votes received in preceding general
                election
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Try the Calculator
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              Use our interactive PPF calculator to estimate allocations for
              different scenarios.
            </p>
            <Link
              href="/calculator"
              className="inline-block px-6 py-3 bg-[var(--accent-1)] text-white font-bold rounded-lg"
            >
              Open Calculator
            </Link>
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

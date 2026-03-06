'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function FundingOverviewPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <article className="fade-in-up">
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-6">
          Campaign Funding Overview
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              How Political Parties and Candidates Receive Funding
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              Political financing in Kenya comes from two main sources:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                <strong className="text-[var(--text-primary)]">
                  Political Parties Fund (PPF)
                </strong>
                — 0.3% of National Revenue, administered by the Office of the
                Registrar of Political Parties (ORPP)
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">
                  Membership, contributions, and donations
                </strong>
                — From members, supporters, and other recognized sources
              </li>
            </ol>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Legal Framework
            </h2>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>
                <Link
                  href="https://new.kenyalaw.org/akn/ke/act/2011/12/eng@2022-12-31"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-1)] hover:underline"
                >
                  Political Parties Act, 2011
                </Link>
              </li>
              <li>
                <Link
                  href="https://new.kenyalaw.org/akn/ke/act/2013/42/eng@2022-12-31"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-1)] hover:underline"
                >
                  Election Campaign Financing Act, 2013
                </Link>
              </li>
              <li>
                Constitution of Kenya Article 88(4)(i) — IEBC mandate to regulate
                campaign spending
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

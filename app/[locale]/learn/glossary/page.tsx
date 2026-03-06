'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';

const terms = [
  { term: 'PPF', def: 'Political Parties Fund — 0.3% of National Revenue distributed to eligible parties' },
  { term: 'ORPP', def: 'Office of the Registrar of Political Parties — administers the PPF' },
  { term: 'IEBC', def: 'Independent Electoral and Boundaries Commission — regulates campaign spending' },
  { term: 'ECF Act', def: 'Election Campaign Financing Act 2013 — regulates campaign fund management' },
  { term: 'SIG', def: 'Special Interest Groups — representatives (youth, women, disability, etc.)' },
];

export default function GlossaryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <article className="fade-in-up">
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-6">
          Glossary
        </h1>

        <div className="space-y-4">
          {terms.map((item) => (
            <Card key={item.term}>
              <dt className="font-display font-bold text-lg text-[var(--accent-1)]">
                {item.term}
              </dt>
              <dd className="mt-2 text-[var(--text-secondary)]">{item.def}</dd>
            </Card>
          ))}
        </div>

        <Link
          href="/learn"
          className="inline-block mt-8 text-[var(--accent-1)] hover:underline font-medium"
        >
          ← Back to Learn
        </Link>
      </article>
    </div>
  );
}

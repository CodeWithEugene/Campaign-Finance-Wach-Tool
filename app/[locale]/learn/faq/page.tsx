'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';

const faqs = [
  {
    q: 'What can parties spend on?',
    a: 'Parties can spend on campaign activities including venues, advertising, media, transportation, and administrative costs. The specific categories are defined in IEBC regulations when they are in force.',
  },
  {
    q: 'Who must disclose?',
    a: 'Political parties and candidates receiving campaign funds must disclose their sources and expenditure to the IEBC as required by the Election Campaign Financing Act.',
  },
  {
    q: 'What are the penalties?',
    a: 'The Act provides for penalties for non-compliance. However, with the current lack of enforcement regulations, the practical application of penalties remains limited.',
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <article className="fade-in-up">
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-6">
          Frequently Asked Questions
        </h1>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <Card key={faq.q}>
              <h2 className="font-display font-bold text-lg mb-2">{faq.q}</h2>
              <p className="text-[var(--text-secondary)]">{faq.a}</p>
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

'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ChevronRight } from 'lucide-react';

const timelineEvents = [
  { year: '2013', title: 'Act Enacted', desc: 'Election Campaign Financing Act No. 42 of 2013 passed' },
  { year: '2014', title: 'In Force', desc: 'Act came into force on January 10, 2014' },
  { year: '2017', title: 'Limits Set', desc: 'Presidential candidates: KSh 4.4 billion' },
  { year: '2021', title: 'Limits Revoked', desc: 'IEBC withdrew limits after Parliament rejected regulations' },
  { year: 'Present', title: 'Current Status', desc: 'No enforceable limits; constitutional mandate remains unfulfilled' },
];

export default function SpendingLimitsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <article className="fade-in-up">
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-6">
          Legal Spending Limits
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Election Campaign Financing Act 2013
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              The Act regulates campaign fund management and expenditure during
              elections. IEBC was authorized to set spending limits for
              candidates and parties.
            </p>
            <p className="text-[var(--text-secondary)]">
              In 2017, presidential candidates were limited to KSh 4.4 billion.
              However, in October 2021, IEBC revoked these limits after
              Parliament rejected campaign-financing regulations.
            </p>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Timeline
            </h2>
            <div className="space-y-4">
              {timelineEvents.map((event, i) => (
                <div
                  key={event.year}
                  className="flex gap-4 items-start"
                >
                  <div className="font-mono font-bold text-[var(--accent-1)] min-w-[60px]">
                    {event.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold">{event.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {event.desc}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Court Petitions
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              Petitions E540/2021 (Katiba Institute) and E546/2021 (TI-Kenya) vs
              IEBC/Speaker called for the Commission to implement regulations.
              The court urged IEBC to proactively come up with spending limit
              regulations.
            </p>
            <p className="text-[var(--text-secondary)]">
              <strong>Constitutional gap:</strong> Article 88(4)(i) still
              requires IEBC to regulate campaign spending. Citizens can demand
              implementation.
            </p>
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

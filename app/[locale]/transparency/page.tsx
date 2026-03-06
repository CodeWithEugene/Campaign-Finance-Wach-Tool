'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';

const parties = [
  { slug: 'uda', name: 'United Democratic Alliance', score: 72 },
  { slug: 'odm', name: 'Orange Democratic Movement', score: 68 },
  { slug: 'jubilee', name: 'Jubilee Party', score: 61 },
];

export default function TransparencyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Transparency Index
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Ranked by disclosure score, PPF compliance, and Mchango transparency
        </p>

        <div className="space-y-6">
          {parties.map((party, i) => (
            <div
              key={party.slug}
             
             
             
            >
              <Link href={`/transparency/${party.slug}`}>
                <Card className="hover:border-[var(--accent-1)] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="font-display font-bold text-xl">{party.name}</h2>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        View breakdown and methodology
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-[var(--text-secondary)]">Score</p>
                        <p className="font-display font-black text-2xl text-[var(--accent-1)]">
                          {party.score}/100
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

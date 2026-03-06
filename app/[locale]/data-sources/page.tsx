'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ExternalLink } from 'lucide-react';

const sources = [
  { name: 'ORPP', url: 'https://orpp.or.ke', desc: 'Political Parties Fund distribution (PDF)' },
  { name: 'OAG', url: 'https://www.oagkenya.go.ke', desc: 'Political parties audit reports' },
  { name: 'IEBC', url: 'https://www.iebc.or.ke', desc: 'Campaign finance regulation' },
];

export default function DataSourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Data Sources
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          We integrate and parse data from official Kenyan sources. Last updated:
          Jan 2024.
        </p>

        <div className="space-y-6">
          {sources.map((source) => (
            <Card key={source.name}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-xl">{source.name}</h2>
                  <p className="text-[var(--text-secondary)] mt-1">{source.desc}</p>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[var(--accent-1)] hover:underline"
                >
                  Visit <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <h2 className="font-display font-bold text-xl mb-4">Data Liberation</h2>
          <p className="text-[var(--text-secondary)]">
            ORPP publishes PPF distribution as PDFs. We parse these documents
            to make the data searchable, comparable, and visual. Data is
            updated when new PDFs are published.
          </p>
        </Card>
      </div>
    </div>
  );
}

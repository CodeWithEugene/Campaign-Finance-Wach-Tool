'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';

const parties = [
  { slug: 'uda', name: 'United Democratic Alliance', ppf: '345.8M', mchango: '12.5M', reports: 45 },
  { slug: 'odm', name: 'Orange Democratic Movement', ppf: '184.7M', mchango: '8.2M', reports: 38 },
  { slug: 'jubilee', name: 'Jubilee Party', ppf: '81.0M', mchango: '5.1M', reports: 22 },
];

export default function PartiesPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="fade-in-up">
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Party Dashboard
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          PPF received, Mchango contributions, and report counts per party
        </p>

        <div className="grid gap-6">
          {parties.map((party) => (
            <div key={party.slug}>
              <Link href={`/${locale}/dashboard/parties/${party.slug}`}>
                <Card className="hover:border-[var(--accent-1)] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="font-display font-bold text-xl">{party.name}</h2>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        View details and transparency index
                      </p>
                    </div>
                    <div className="flex gap-6 sm:gap-8">
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">PPF</p>
                        <p className="font-mono font-bold">{party.ppf}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">Mchango</p>
                        <p className="font-mono font-bold">{party.mchango}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-secondary)]">Reports</p>
                        <p className="font-mono font-bold">{party.reports}</p>
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

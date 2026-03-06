import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { MapPin } from 'lucide-react';

const counties = [
  { slug: 'nairobi', name: 'Nairobi', count: 45, topCategory: 'Vote buying' },
  { slug: 'mombasa', name: 'Mombasa', count: 28, topCategory: 'Misuse' },
  { slug: 'kisumu', name: 'Kisumu', count: 22, topCategory: 'Vote buying' },
  { slug: 'nakuru', name: 'Nakuru', count: 18, topCategory: 'Illegal donations' },
  { slug: 'uasin-gishu', name: 'Uasin Gishu', count: 15, topCategory: 'Misuse' },
];

export default function CountiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          County-Level View
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Reports by Kenya&apos;s 47 counties
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {counties.map((county, i) => (
            <div
              key={county.slug}
             
             
             
            >
              <Link href={`/counties/${county.slug}`}>
                <Card className="hover:border-[var(--accent-1)] transition-colors h-full">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-8 h-8 text-[var(--accent-1)] flex-shrink-0" />
                    <div>
                      <h2 className="font-display font-bold text-lg">{county.name}</h2>
                      <p className="font-mono font-bold text-[var(--accent-1)] mt-1">
                        {county.count} reports
                      </p>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        Top: {county.topCategory}
                      </p>
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

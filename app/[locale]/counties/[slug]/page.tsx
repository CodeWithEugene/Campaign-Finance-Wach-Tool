'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function CountyDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const countyName =
    slug === 'nairobi'
      ? 'Nairobi'
      : slug === 'mombasa'
      ? 'Mombasa'
      : slug === 'kisumu'
      ? 'Kisumu'
      : slug === 'nakuru'
      ? 'Nakuru'
      : slug === 'uasin-gishu'
      ? 'Uasin Gishu'
      : slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="fade-in-up">
        <Link
          href="/counties"
          className="inline-block text-[var(--accent-1)] hover:underline mb-6"
        >
          ← Back to counties
        </Link>

        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          {countyName} County
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Report statistics and ALAC contact
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Reports', value: '45' },
            { label: 'Verified', value: '12' },
            { label: 'Under Review', value: '28' },
            { label: 'Top Category', value: 'Vote buying' },
          ].map((stat) => (
            <Card key={stat.label}>
              <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
              <p className="font-display font-black text-2xl mt-1">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card>
          <h2 className="font-display font-bold text-xl mb-4">
            TI-Kenya ALAC Regions
          </h2>
          <p className="text-[var(--text-secondary)] mb-4">
            For legal advice on campaign finance issues, contact the nearest
            Advocacy and Legal Advice Centre:
          </p>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>Nairobi ALAC</li>
            <li>Mombasa (Coast)</li>
            <li>Eldoret (Rift Valley)</li>
            <li>Kisumu (Western)</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

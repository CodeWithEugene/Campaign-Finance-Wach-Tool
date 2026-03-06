'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function TransparencyPartyPage() {
  const params = useParams();
  const party = params?.party as string;
  const partyName =
    party === 'uda'
      ? 'United Democratic Alliance'
      : party === 'odm'
      ? 'Orange Democratic Movement'
      : party === 'jubilee'
      ? 'Jubilee Party'
      : 'Political Party';

  const components = [
    { label: 'Disclosure score', value: 'Publishes audited accounts', weight: 25 },
    { label: 'PPF compliance', value: 'Audit clean', weight: 25 },
    { label: 'Mchango transparency', value: 'Publishes contribution totals', weight: 20 },
    { label: 'Report verification rate', value: '27% verified', weight: 30 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="fade-in-up">
        <Link
          href="/transparency"
          className="inline-block text-[var(--accent-1)] hover:underline mb-6"
        >
          ← Back to Transparency Index
        </Link>

        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          {partyName}
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Transparency index breakdown and methodology
        </p>

        <Card className="mb-8">
          <h2 className="font-display font-bold text-xl mb-4">Index Components</h2>
          <ul className="space-y-4">
            {components.map((c) => (
              <li key={c.label} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{c.label}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{c.value}</p>
                </div>
                <span className="font-mono font-bold">{c.weight}%</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-xl mb-4">Methodology</h2>
          <p className="text-[var(--text-secondary)]">
            The transparency index is calculated quarterly using weighted
            components: disclosure of audited accounts, PPF compliance, Mchango
            transparency, and report verification rates. Weights are determined
            in consultation with TI-Kenya.
          </p>
        </Card>
      </div>
    </div>
  );
}

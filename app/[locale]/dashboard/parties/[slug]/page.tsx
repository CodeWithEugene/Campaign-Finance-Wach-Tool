'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const trendData = [
  { year: '2020', ppf: 120 },
  { year: '2021', ppf: 135 },
  { year: '2022', ppf: 280 },
  { year: '2023', ppf: 346 },
];

export default function PartyDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const partyName =
    slug === 'uda'
      ? 'United Democratic Alliance'
      : slug === 'odm'
      ? 'Orange Democratic Movement'
      : slug === 'jubilee'
      ? 'Jubilee Party'
      : 'Political Party';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="fade-in-up">
        <Link
          href="/dashboard/parties"
          className="inline-block text-[var(--accent-1)] hover:underline mb-6"
        >
          ← Back to parties
        </Link>

        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          {partyName}
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Transparency index and funding overview
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Transparency Score', value: '72/100' },
            { label: 'PPF (2023/24)', value: 'KSh 345.8M' },
            { label: 'Mchango Total', value: 'KSh 12.5M' },
            { label: 'Report Count', value: '45' },
          ].map((stat) => (
            <Card key={stat.label}>
              <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
              <p className="font-display font-black text-2xl mt-1">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <h2 className="font-display font-bold text-xl mb-6">
            PPF Allocation Trend
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="year" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ppf"
                  stroke="var(--accent-1)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

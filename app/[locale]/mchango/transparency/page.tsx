'use client';

import { Card } from '@/components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const contributionData = [
  { party: 'UDA', total: 12.5, contributors: 340 },
  { party: 'ODM', total: 8.2, contributors: 210 },
  { party: 'Jubilee', total: 5.1, contributors: 125 },
];

export default function MchangoTransparencyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="fade-in-up">
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Mchango Transparency Dashboard
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Total contributions per party (aggregate only, no individual amounts)
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Mchango', value: 'KSh 25.8M' },
            { label: 'Total Contributors', value: '675' },
            { label: 'Parties Supported', value: '3' },
          ].map((stat) => (
            <Card key={stat.label}>
              <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
              <p className="font-display font-black text-2xl mt-1">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card>
          <h2 className="font-display font-bold text-xl mb-6">
            Contributions by Party
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="party" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                  }}
                />
                <Bar dataKey="total" fill="var(--accent-1)" name="KSh (M)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

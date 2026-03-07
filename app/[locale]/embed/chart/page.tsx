'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['var(--accent-1)', 'var(--accent-2)', 'var(--accent-3)', '#888', '#aaa'];

export default function EmbedChartPage() {
  const stats = useQuery(api.reports.dashboardStats);
  const data =
    stats?.byCategory &&
    Object.entries(stats.byCategory).map(([name, value], i) => ({
      name: name.replace(/-/g, ' '),
      value,
      color: COLORS[i % COLORS.length],
    }));

  return (
    <div className="w-full h-[400px] p-4">
      <h2 className="font-display font-bold text-lg mb-2">Reports by category</h2>
      {data?.length ? (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-[var(--text-secondary)]">No data yet.</p>
      )}
    </div>
  );
}

'use client';

import { Card } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const ppfData = [
  { year: '2013/14', ppf: 120 },
  { year: '2014/15', ppf: 135 },
  { year: '2015/16', ppf: 142 },
  { year: '2016/17', ppf: 158 },
  { year: '2017/18', ppf: 280 },
  { year: '2018/19', ppf: 295 },
  { year: '2019/20', ppf: 310 },
  { year: '2020/21', ppf: 320 },
  { year: '2021/22', ppf: 335 },
  { year: '2022/23', ppf: 520 },
];

const reportData = [
  { month: 'Jan 2023', count: 45 },
  { month: 'Feb', count: 38 },
  { month: 'Mar', count: 52 },
  { month: 'Apr', count: 28 },
  { month: 'May', count: 35 },
  { month: 'Jun', count: 41 },
  { month: 'Jul', count: 68 },
  { month: 'Aug', count: 120 },
  { month: 'Sep', count: 95 },
  { month: 'Oct', count: 62 },
  { month: 'Nov', count: 48 },
  { month: 'Dec 2023', count: 55 },
];

export default function TrendsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Historical Trends
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          PPF over time, reports by month, and election cycle annotations
        </p>

        <div className="space-y-6 mb-12">
          <Card>
            <h2 className="font-display font-bold text-xl mb-6">
              Political Parties Fund (Total, KSh M)
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ppfData}>
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
                    name="PPF (KSh M)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-6">
              Reports by Month (2023)
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Spike around August 2022 election period
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--accent-2)"
                    strokeWidth={2}
                    name="Reports"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

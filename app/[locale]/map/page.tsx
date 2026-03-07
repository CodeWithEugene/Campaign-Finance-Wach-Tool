'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { ReportCategory, ReportStatus } from '@/convex/schema';
import { MapView } from '@/components/map/MapView';
import { Card } from '@/components/ui/Card';

const categories = [
  { value: '', label: 'All' },
  { value: 'vote-buying', label: 'Vote buying' },
  { value: 'illegal-donations', label: 'Illegal donations' },
  { value: 'misuse-public-resources', label: 'Misuse' },
  { value: 'undeclared-spending', label: 'Undeclared' },
  { value: 'bribery', label: 'Bribery' },
  { value: 'other', label: 'Other' },
];
const statuses = [
  { value: '', label: 'All' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under review' },
  { value: 'verified', label: 'Verified' },
  { value: 'unverified', label: 'Unverified' },
  { value: 'needs_more_info', label: 'Needs more info' },
];

export default function MapPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<'markers' | 'heat'>('markers');

  const reports = useQuery(api.reports.listForMap, {
    category: (selectedCategory || undefined) as ReportCategory | undefined,
    status: (selectedStatus || undefined) as ReportStatus | undefined,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Interactive Map
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Explore campaign finance reports across Kenya. Click markers for details.
        </p>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <h2 className="font-display font-bold text-lg mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
                  >
                    {categories.map((c) => (
                      <option key={c.value || 'all'} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
                  >
                    {statuses.map((s) => (
                      <option key={s.value || 'all'} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">View</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('markers')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                        viewMode === 'markers'
                          ? 'bg-[var(--accent-1)] text-white'
                          : 'bg-[var(--bg-primary)] border border-[var(--border-color)]'
                      }`}
                    >
                      Markers
                    </button>
                    <button
                      onClick={() => setViewMode('heat')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                        viewMode === 'heat'
                          ? 'bg-[var(--accent-1)] text-white'
                          : 'bg-[var(--bg-primary)] border border-[var(--border-color)]'
                      }`}
                    >
                      Heat Map
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <MapView reports={reports ?? []} locale={locale} />
            {viewMode === 'heat' && (
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Heat map view coming soon. Currently showing markers.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { MapReport } from './MapComponent';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-[var(--bg-secondary)] flex items-center justify-center rounded-xl">
      <p className="text-[var(--text-secondary)]">Loading map...</p>
    </div>
  ),
});

export function MapView({ reports = [], locale = 'en' }: { reports?: MapReport[]; locale?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-[var(--bg-secondary)] flex items-center justify-center rounded-xl">
        <p className="text-[var(--text-secondary)]">Loading map...</p>
      </div>
    );
  }

  return <MapComponent reports={reports} locale={locale} />;
}

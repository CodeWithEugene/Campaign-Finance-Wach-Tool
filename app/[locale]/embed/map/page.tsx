'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { MapView } from '@/components/map/MapView';

export default function EmbedMapPage() {
  const reports = useQuery(api.reports.listForMap, {});
  return (
    <div className="w-full h-[400px] p-2">
      <MapView reports={reports ?? []} />
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCoordsForReport } from '@/lib/countyCoords';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export type MapReport = {
  _id: string;
  title: string;
  category: string;
  location?: string;
  county?: string;
  status: string;
};

const KENYA_CENTER: [number, number] = [-0.0236, 37.9062];
const KENYA_ZOOM = 6;

/** When reports change, fit the map bounds to show all markers (or reset to Kenya view). */
function FitBounds({ markers }: { markers: { lat: number; lng: number }[] }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length === 0) {
      map.setView(KENYA_CENTER, KENYA_ZOOM);
      return;
    }
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [map, markers]);

  return null;
}

export default function MapComponent({
  reports = [],
  locale = 'en',
}: {
  reports?: MapReport[];
  locale?: string;
}) {
  const markers = reports.map((r) => {
    const [lat, lng] = getCoordsForReport(r.county, r.location);
    return { ...r, lat, lng };
  });

  return (
    <MapContainer
      center={KENYA_CENTER}
      zoom={KENYA_ZOOM}
      className="w-full h-[500px] rounded-xl z-0"
      scrollWheelZoom={true}
    >
      <FitBounds markers={markers} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((report) => (
        <Marker
          key={report._id}
          position={[report.lat, report.lng]}
          icon={icon}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-sm">{report.title}</h3>
              <p className="text-xs text-gray-600">{report.category.replace(/-/g, ' ')}</p>
              <p className="text-xs">{report.county || report.location}</p>
              <span className={`text-xs px-2 py-0.5 rounded ${report.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {report.status.replace(/_/g, ' ')}
              </span>
              <div className="mt-2">
                <Link
                  href={`/${locale}/reports/${report._id}`}
                  className="text-xs font-medium text-[var(--accent-1)] hover:underline"
                >
                  View full report →
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

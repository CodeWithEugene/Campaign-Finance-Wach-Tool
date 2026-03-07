'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

export default function MapComponent({ reports = [] }: { reports?: MapReport[] }) {
  const markers = reports.map((r) => {
    const [lat, lng] = getCoordsForReport(r.county, r.location);
    return { ...r, lat, lng };
  });

  return (
    <MapContainer
      center={[-0.0236, 37.9062]}
      zoom={6}
      className="w-full h-[500px] rounded-xl z-0"
      scrollWheelZoom={true}
    >
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
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

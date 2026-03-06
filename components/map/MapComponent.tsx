'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Sample report data - replace with API data
const sampleReports = [
  { id: '1', lat: -1.2921, lng: 36.8219, title: 'Vote buying allegation', category: 'Vote buying', date: '2024-01-15', status: 'Under review' },
  { id: '2', lat: -4.0437, lng: 39.6682, title: 'Misuse of public resources', category: 'Misuse', date: '2024-01-10', status: 'Verified' },
  { id: '3', lat: -0.1022, lng: 34.7617, title: 'Illegal donations reported', category: 'Illegal donations', date: '2024-01-08', status: 'Under review' },
];

export default function MapComponent() {
  return (
    <MapContainer
      center={[-1.2921, 36.8219]}
      zoom={6}
      className="w-full h-[500px] rounded-xl z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sampleReports.map((report) => (
        <Marker
          key={report.id}
          position={[report.lat, report.lng]}
          icon={icon}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-sm">{report.title}</h3>
              <p className="text-xs text-gray-600">{report.category}</p>
              <p className="text-xs">{report.date}</p>
              <span className={`text-xs px-2 py-0.5 rounded ${report.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {report.status}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

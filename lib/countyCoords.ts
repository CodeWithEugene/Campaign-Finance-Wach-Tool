// Approximate centroids for Kenyan counties (for map markers when lat/lng not stored)
export const countyCoords: Record<string, [number, number]> = {
  Nairobi: [-1.2921, 36.8219],
  Mombasa: [-4.0437, 39.6682],
  Kisumu: [-0.1022, 34.7617],
  Nakuru: [-0.3031, 36.0800],
  Eldoret: [0.5143, 35.2698],
  Thika: [-1.0333, 37.0693],
  Malindi: [-3.2172, 40.1161],
  Kitale: [1.0157, 35.0062],
  Garissa: [-0.4536, 39.6461],
  Kakamega: [0.2842, 34.7523],
  Nyeri: [-0.4197, 36.9475],
  Meru: [0.0515, 37.6456],
  Machakos: [-1.5177, 37.2634],
  Kisii: [-0.6773, 34.7796],
  Lamu: [-2.2696, 40.9020],
  Kajiado: [-1.8524, 36.7769],
  Kiambu: [-1.1711, 36.8353],
  "Murang'a": [-0.7833, 37.0333],
  Nandi: [-0.1833, 35.1167],
  Bungoma: [0.5635, 34.5609],
  Kericho: [-0.3670, 35.2831],
  Embu: [-0.5312, 37.4506],
  Kilifi: [-3.6309, 39.8493],
  Mandera: [3.9366, 41.8670],
  Wajir: [1.7474, 40.0573],
  Marsabit: [2.3340, 37.9903],
  Isiolo: [0.3556, 37.5833],
  Laikipia: [0.1974, 36.7819],
  Nyandarua: [-0.5333, 36.5333],
  Kirinyaga: [-0.5000, 37.4167],
  Baringo: [0.4667, 35.9667],
  "Uasin Gishu": [0.5167, 35.2833],
  "Trans Nzoia": [1.0333, 34.9833],
  "West Pokot": [1.2500, 35.0833],
  Turkana: [3.1167, 35.6000],
  Samburu: [1.1000, 36.6667],
  Kitui: [-1.3667, 38.0167],
  Makueni: [-2.0000, 37.6167],
  "Taita-Taveta": [-3.4000, 38.3667],
  "Tana River": [-1.5000, 39.9167],
  "Homa Bay": [-0.5333, 34.4500],
  Migori: [-1.0667, 34.4667],
  Siaya: [0.0667, 34.2833],
  Busia: [0.4667, 34.1167],
  Vihiga: [-0.0500, 34.7167],
  Bomet: [-0.7833, 35.3333],
  Narok: [-1.0833, 35.8667],
};

const kenyaCenter: [number, number] = [-0.0236, 37.9062];

export function getCoordsForReport(county?: string, location?: string): [number, number] {
  if (county && countyCoords[county]) return countyCoords[county];
  const key = location?.trim();
  if (key && countyCoords[key]) return countyCoords[key];
  for (const [name, coords] of Object.entries(countyCoords)) {
    if (key && name.toLowerCase().includes(key.toLowerCase())) return coords;
  }
  return kenyaCenter;
}

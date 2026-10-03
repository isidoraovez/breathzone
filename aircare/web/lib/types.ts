export type AirStatus = "green" | "yellow" | "red";
export type Spot = { id: string; name: string; type: "outdoor" | "indoor"; category: string; latitude: number; longitude: number; address: string | null; indoor_alternative_id?: string | null };
export type AirReading = { station_name: string; pm25: number | null; pm10: number | null; aqi_index: number; status: AirStatus; recorded_at: string };

export const sampleSpots: Spot[] = [
  { id: "city-park", name: "City Park", type: "outdoor", category: "running", latitude: 42.004, longitude: 21.415, address: "Gradski Park, Skopje" },
  { id: "vardar-quay", name: "Vardar Quay", type: "outdoor", category: "running", latitude: 41.995, longitude: 21.432, address: "Riverside promenade" },
  { id: "vodno-trails", name: "Vodno Trails", type: "outdoor", category: "multi", latitude: 41.968, longitude: 21.393, address: "Middle Vodno" },
  { id: "boris-trajkovski", name: "Sports Center Boris Trajkovski", type: "indoor", category: "multi", latitude: 42.006, longitude: 21.405, address: "Aminta Treti" },
];
export const sampleReadings: AirReading[] = [
  { station_name: "Centar", pm25: 12, pm10: 21, aqi_index: 38, status: "green", recorded_at: new Date().toISOString() },
  { station_name: "Karpoš", pm25: 19, pm10: 33, aqi_index: 57, status: "yellow", recorded_at: new Date().toISOString() },
  { station_name: "Gazi Baba", pm25: 9, pm10: 17, aqi_index: 29, status: "green", recorded_at: new Date().toISOString() },
  { station_name: "Lisice", pm25: 26, pm10: 45, aqi_index: 79, status: "yellow", recorded_at: new Date().toISOString() },
];

"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import type { Spot } from "@/lib/types";

const pin = L.divIcon({ className: "", html: '<span style="display:block;width:18px;height:18px;border:3px solid white;border-radius:50%;background:#1d8a68;box-shadow:0 2px 9px #17332e66"></span>', iconSize: [18, 18], iconAnchor: [9, 9] });
function FitSpots({ spots }: { spots: Spot[] }) { const map = useMap(); useEffect(() => { if (spots.length) map.fitBounds(spots.map(s => [s.latitude, s.longitude]), { padding: [35, 35] }); }, [map, spots]); return null; }

export default function MapView({ spots }: { spots: Spot[] }) {
  return <MapContainer className="map" center={[42, 21.43]} zoom={12} scrollWheelZoom={false}><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><FitSpots spots={spots}/>{spots.map(spot => <Marker key={spot.id} position={[spot.latitude, spot.longitude]} icon={pin}><Popup><strong>{spot.name}</strong><br/>{spot.type === "indoor" ? "Indoor option" : "Outdoor spot"}<br/><Link href={`/spots/${spot.id}`}>View spot</Link></Popup></Marker>)}</MapContainer>;
}

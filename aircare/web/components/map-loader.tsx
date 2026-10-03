"use client";
import dynamic from "next/dynamic";
import type { Spot } from "@/lib/types";
const MapView = dynamic(() => import("./map-view"), { ssr: false, loading: () => <div className="map-placeholder"><div><strong>Loading Skopje map…</strong><span>Sports spots appear here</span></div></div> });
export default function MapLoader({ spots }: { spots: Spot[] }) { return <MapView spots={spots}/>; }

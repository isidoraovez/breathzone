import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { sampleReadings, sampleSpots } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export const revalidate = 300;
export default async function SpotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let spots = sampleSpots;
  if (supabase) { const { data } = await supabase.from("spots").select("id,name,type,category,latitude,longitude,address,indoor_alternative_id"); if (data?.length) spots = data; }
  const spot = spots.find(s => s.id === id); if (!spot) notFound();
  const alternative = spot.indoor_alternative_id ? spots.find(s => s.id === spot.indoor_alternative_id) : spots.find(s => s.type === "indoor");
  let reading = sampleReadings[0]; let isSample = true;
  if (supabase) { const { data } = await supabase.from("air_quality_logs").select("station_name,pm25,pm10,aqi_index,status,recorded_at").order("recorded_at", { ascending: false }).limit(1).maybeSingle(); if (data) { reading = data; isSample = false; } }
  return <main className="wrap"><Link href="/" className="subtle" style={{display:"inline-flex",gap:8,alignItems:"center"}}><ArrowLeft size={16}/> Back to map</Link><section className="hero" style={{marginTop:24}}><div><div className="eyebrow">{spot.type === "indoor" ? "Indoor sports venue" : "Outdoor sports spot"}</div><h1>{spot.name}</h1><div className="subtle"><MapPin size={15} style={{verticalAlign:"-2px"}}/> {spot.address ?? "Skopje"} · {spot.category}</div></div><span className="status-pill"><span className="dot"/> AQI {reading.aqi_index} · {reading.status}</span></section><div className="grid"><section className="card"><h2>Latest air quality</h2><div className="aqi-number">{reading.aqi_index}</div><p className="subtle">{isSample ? "Illustrative sample" : `Latest station reading from ${reading.station_name}`}. Station-to-spot matching is not configured yet, so this value may not represent this venue.</p><div className="station"><span>PM2.5</span><strong>{reading.pm25 ?? "—"} µg/m³</strong></div><div className="station"><span>PM10</span><strong>{reading.pm10 ?? "—"} µg/m³</strong></div></section><aside className="card"><h2>Indoor alternative</h2>{alternative ? <><div className="spot-icon"><MapPin size={18}/></div><strong>{alternative.name}</strong><p className="subtle">{alternative.address}</p><Link className="btn btn-secondary" href={`/spots/${alternative.id}`}>View indoor option</Link></> : <p className="subtle">No indoor alternative has been linked yet.</p>}<div className="notice" style={{marginTop:18}}>Air quality can change quickly. Check current official guidance before exercising.</div></aside></div></main>;
}

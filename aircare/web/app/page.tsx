import Link from "next/link";
import { ArrowUpRight, Bike, MapPin, Wind } from "lucide-react";
import MapLoader from "@/components/map-loader";
import { sampleReadings, sampleSpots } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { calculateBestOutdoorWindow } from "@/lib/best-window";

export const revalidate = 300;
export default async function Home() {
  let spots = sampleSpots, readings = sampleReadings;
  if (supabase) {
    const [{ data: spotRows }, { data: airRows }] = await Promise.all([
      supabase.from("spots").select("id,name,type,category,latitude,longitude,address,indoor_alternative_id"),
      supabase.from("air_quality_logs").select("station_name,pm25,pm10,aqi_index,status,recorded_at").order("recorded_at", { ascending: false }).limit(30),
    ]);
    if (spotRows?.length) spots = spotRows;
    if (airRows?.length) { const latest = new Map<string, typeof airRows[number]>(); for (const row of airRows) if (!latest.has(row.station_name)) latest.set(row.station_name, row); readings = [...latest.values()]; }
  }
  const latest = readings.reduce((a, b) => a.aqi_index < b.aqi_index ? a : b);
  const demoWindow = calculateBestOutdoorWindow([{ hour: 9, aqi: 45 }, { hour: 10, aqi: 42 }, { hour: 11, aqi: 35 }, { hour: 12, aqi: 31 }, { hour: 13, aqi: 28 }, { hour: 14, aqi: 34 }, { hour: 15, aqi: 50 }]);
  return <main className="wrap"><section className="hero"><div><div className="eyebrow">Skopje · Outdoor activity</div><h1>Move with the air.</h1><div className="subtle">Find your next spot and check the air before heading out.</div></div><Link className="btn" href="/games/new"><Bike size={17}/> Find a game <ArrowUpRight size={16}/></Link></section>
    {!supabase && <div className="notice" style={{ marginBottom: 18 }}>Sample view: connect a Supabase project to show live readings and saved spots. Sample values are illustrative only.</div>}
    <section className="grid"><div className="card map-card"><MapLoader spots={spots}/></div><aside className="card"><div className="eyebrow">City snapshot</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}><div><div className="aqi-number">{latest.aqi_index}</div><div className="subtle">Lowest station AQI · {latest.station_name}</div></div><span className="status-pill"><span className="dot"/>{latest.status}</span></div><div className="subtle" style={{fontSize:12,marginTop:10}}>Latest station readings</div>{readings.map(r => <div className="station" key={r.station_name}><div><div className="station-name">{r.station_name}</div><div className="station-meta">PM2.5 {r.pm25 ?? "—"} · PM10 {r.pm10 ?? "—"}</div></div><span className={`aqi-chip ${r.status === "red" ? "aqi-red" : r.status === "yellow" ? "aqi-yellow" : ""}`}>{r.aqi_index}</span></div>)}<div className="notice" style={{marginTop:12}}>Readings are informational. Follow local health guidance, especially during elevated pollution.</div></aside></section>
    <section style={{marginTop:30}}><div className="section-head"><div><div className="eyebrow">Explore</div><h2 style={{marginTop:5}}>Popular sports spots</h2></div><Link className="subtle" href="/spots/city-park">See all spots →</Link></div><div className="spot-grid">{spots.slice(0,3).map(s => <Link className="spot-card" href={`/spots/${s.id}`} key={s.id}><div className="spot-icon"><MapPin size={18}/></div><strong>{s.name}</strong><div className="station-meta" style={{marginTop:6}}>{s.type === "indoor" ? "Indoor backup" : s.category} · {s.address ?? "Skopje"}</div></Link>)}</div></section>
    <section className="card" style={{marginTop:20,display:"flex",alignItems:"center",justifyContent:"space-between",gap:20}}><div><div className="eyebrow">Plan your activity</div><h2 style={{marginTop:7,marginBottom:4}}>Suggested outdoor window: {demoWindow ?? "—"}</h2><div className="subtle">Illustrative calculation only. A forecast source has not been connected.</div></div><Wind size={28} color="#1d8a68"/></section>
  </main>;
}

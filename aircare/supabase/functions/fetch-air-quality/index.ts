import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type SourceReading = { station_name: string; aqi_index: number; pm25?: number | null; pm10?: number | null; recorded_at?: string };
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret" };
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "Use POST" }, 405);

  const cronSecret = Deno.env.get("AIR_QUALITY_CRON_SECRET");
  if (!cronSecret || req.headers.get("x-cron-secret") !== cronSecret) return reply({ error: "Unauthorized" }, 401);
  const sourceUrl = Deno.env.get("AIR_QUALITY_SOURCE_URL");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!sourceUrl || !supabaseUrl || !serviceRoleKey) return reply({ error: "Required function secrets are missing" }, 500);

  try {
    const sourceResponse = await fetch(sourceUrl, { headers: Deno.env.get("AIR_QUALITY_API_TOKEN") ? { Authorization: `Bearer ${Deno.env.get("AIR_QUALITY_API_TOKEN")}` } : {} });
    if (!sourceResponse.ok) return reply({ error: `AQI source returned HTTP ${sourceResponse.status}` }, 502);
    const payload: unknown = await sourceResponse.json();
    if (!Array.isArray(payload) || payload.length === 0) return reply({ error: "Source must return a non-empty JSON array of normalized station readings" }, 502);

    const rows = (payload as SourceReading[]).map((item) => {
      if (!item || typeof item.station_name !== "string" || !item.station_name.trim() || !Number.isInteger(item.aqi_index) || item.aqi_index < 0) throw new Error("Each reading needs station_name and a non-negative integer aqi_index");
      const status = item.aqi_index <= 50 ? "green" : item.aqi_index <= 100 ? "yellow" : "red";
      const recordedAt = item.recorded_at ? new Date(item.recorded_at) : new Date();
      if (Number.isNaN(recordedAt.getTime())) throw new Error(`Invalid recorded_at for ${item.station_name}`);
      return { station_name: item.station_name.trim(), aqi_index: item.aqi_index, status, pm25: item.pm25 ?? null, pm10: item.pm10 ?? null, recorded_at: recordedAt.toISOString() };
    });

    const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    const { error } = await supabase.from("air_quality_logs").insert(rows);
    if (error) return reply({ error: "Database insert failed", details: error.message }, 500);
    return reply({ inserted: rows.length, stations: rows.map((row) => row.station_name) });
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : "Unexpected ingestion error" }, 502);
  }
});

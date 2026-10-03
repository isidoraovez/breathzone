"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { sampleSpots, type Spot } from "@/lib/types";

export default function NewGamePage() {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const [email, setEmail] = useState(""); const [signedIn, setSignedIn] = useState(false); const [spots, setSpots] = useState<Spot[]>(sampleSpots);
  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session?.user)));
    void supabase.from("spots").select("id,name,type,category,latitude,longitude,address,indoor_alternative_id").then(({ data }) => { if (data?.length) setSpots(data); });
    return () => authListener.subscription.unsubscribe();
  }, []);
  async function sendSignInLink() {
    if (!supabase || !email) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/games/new` } });
    setMessage(error ? error.message : "Check your email for a sign-in link."); setBusy(false);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); const form = new FormData(event.currentTarget);
    if (!supabase) { setMessage("Connect Supabase to publish a game. This preview is not saved."); return; }
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMessage("Sign in with your email before publishing a game."); setBusy(false); return; }
    const scheduled = new Date(String(form.get("scheduled_time")));
    const { error } = await supabase.from("pickup_games").insert({ title: form.get("title"), category: form.get("category"), spot_id: form.get("spot_id"), scheduled_time: scheduled.toISOString(), organizer_id: user.id });
    setMessage(error ? error.message : "Game posted. Invite your teammates!"); setBusy(false);
  }
  return <main className="wrap"><Link href="/" className="subtle" style={{display:"inline-flex",gap:8,alignItems:"center"}}><ArrowLeft size={16}/> Back to explore</Link><div style={{marginTop:24}}><div className="eyebrow">Community</div><h1>Organize a pickup game</h1><p className="subtle">Pick a spot and time. Check the air before game day.</p></div><form className="card form" onSubmit={submit} style={{marginTop:24}}><label className="field">Game title<input name="title" placeholder="Evening 5-a-side" required maxLength={100}/></label><label className="field">Sport<select name="category" defaultValue="football"><option value="football">Football</option><option value="basketball">Basketball</option><option value="running">Running</option><option value="tennis">Tennis</option><option value="multi">Other / multi-sport</option></select></label><label className="field">Spot<select name="spot_id" required>{spots.map(spot => <option key={spot.id} value={spot.id}>{spot.name}{spot.type === "indoor" ? " · indoor" : ""}</option>)}</select></label><label className="field">Date and time<input name="scheduled_time" type="datetime-local" required min={new Date(Date.now() + 60_000).toISOString().slice(0,16)}/></label>{supabase && !signedIn && <><label className="field">Email for sign-in link<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required/></label><button type="button" className="btn btn-secondary" onClick={sendSignInLink} disabled={busy}>{busy ? "Sending…" : "Email me a sign-in link"}</button></>}{!supabase && <div className="notice">Connect Supabase to sign in and publish a game. This preview is not saved.</div>}{message && <div className="notice" role="status">{message}</div>}<button className="btn" type="submit" disabled={busy || !supabase || !signedIn}>{busy ? "Posting…" : <><CheckCircle2 size={17}/> Post game</>}</button><div className="station-meta">Email sign-in must be enabled and configured in your Supabase Auth settings.</div></form></main>;
}

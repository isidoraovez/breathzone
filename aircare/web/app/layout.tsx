import type { Metadata } from "next";
import Link from "next/link";
import { Activity } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = { title: "AirCare — Move with the air", description: "Air quality and outdoor sport spots across Skopje." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><div className="shell"><header className="topbar"><div className="topbar-inner"><Link className="brand" href="/"><span className="brand-mark"><Activity size={19}/></span>aircare</Link><nav className="nav"><Link href="/">Explore</Link><Link href="/spots/city-park">Spots</Link><Link href="/games/new">Find a game</Link></nav></div></header>{children}<footer className="footer">AirCare helps you plan outdoor activity around air quality. Check official advisories before exercising.</footer></div></body></html>;
}

import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "AirCare Skopje", short_name: "AirCare", description: "Check air quality and find sports spots in Skopje.", start_url: "/", display: "standalone", background_color: "#f5f8f4", theme_color: "#1d8a68", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }] };
}

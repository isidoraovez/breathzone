# AirCare (Breathzone)

Mobile-first Skopje sports and air-quality dashboard built with Next.js and Supabase.

## Local setup

1. Install Node.js 20.9+ and npm or pnpm.
2. Change to `web` and run `npm install` (or `pnpm install`).
3. Copy `.env.example` to `.env.local`, then fill in the Supabase project URL and anon key.
4. Run `npm run dev` (or `pnpm dev`) and open http://localhost:3000.

Without Supabase configuration, the UI uses illustrative sample data. Do not treat samples as live measurements.

## Supabase

- Apply `supabase/migrations/0001_initial_schema.sql` to a new project with PostGIS enabled. Optionally run `supabase/seed.sql` once for illustrative spots; verify venue details and coordinates before public use.
- Configure `AIR_QUALITY_SOURCE_URL` and optionally `AIR_QUALITY_API_TOKEN` as Edge Function secrets. The source must return the normalized JSON shape documented in `supabase/functions/fetch-air-quality/README.md`.
- Deploy `fetch-air-quality`. Keep `AIR_QUALITY_CRON_SECRET` server-side and invoke the function from Supabase Cron with the `x-cron-secret` header. Do not put service-role credentials in the web app.
- The initial schema uses public read access for spot/AQI data and authenticated ownership for pickup-game writes. Review policies before production.

## Deploy

In Vercel, import the repository and set the project root to `aircare/web`. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for Preview and Production, then deploy a preview first. A Mapbox token is not required: the initial map uses OpenStreetMap tiles through Leaflet. Confirm tile provider usage terms and capacity before public launch.

## Scope and limitations

The project includes the dashboard, spot details, email-link sign-in for game scheduling, best outdoor window utility, installable manifest, schema, and ingestion template. Live data and writes require Supabase configuration. The map uses OpenStreetMap tiles. Browser push delivery, game-to-station proximity rules, forecast data, and an actual production cron schedule still need provider/product setup before launch.

# AirCare handoff

## Current state

- The workspace repository is connected to `https://github.com/isidoraovez/breathzone.git` on `main`.
- The AirCare scaffold is in place under `web/`: Next.js 16 App Router dashboard, client Leaflet map, spot details, pickup game form with Supabase email-link auth, AQI status display, best-window utility/demo, and installable web manifest.
- Supabase migration defines spots with PostGIS locations, air-quality logs, pickup games, indexes, and RLS. `supabase/seed.sql` contains illustrative Skopje spots and should be reviewed before public use.
- `fetch-air-quality` is a secured normalized-data ingestion template. It expects an array with station name, integer AQI, optional PM2.5/PM10 and timestamp; supplied AQI bands are applied as specified.
- The first Vercel build reported an npm peer conflict: React 19 was paired with React Leaflet 4. The manifest now requests React Leaflet 5, whose v5 release supports React 19.
- No npm/pnpm install, build, or browser verification has been run in this environment. Check for a package lock and regenerate it after dependency changes before deployment if one is tracked.
- Vercel is connected to the GitHub repository and its first build failed on the React/React Leaflet peer dependency conflict. This workspace cannot inspect or trigger deployments through the dashboard because browser access was declined.
- No AQI provider, Supabase project, domain, or credentials have been supplied. Secrets must only be configured in provider secret stores, never committed.
- The dependency fix and handoff update are local and uncommitted; there is no package lock in `web/`.

## Remaining work

1. Push the React Leaflet 5 dependency update to GitHub `main`; Vercel should start a fresh build automatically. No lockfile currently needs regeneration.
2. Select an AQI provider; verify access terms, endpoint/auth, and response schema, then implement and validate its adapter. Connect a real forecast source for the best-window calculation.
3. Create Supabase, apply the migration and optional seed, configure email auth redirect URLs and Edge Function secrets, deploy the function, and set up the hourly Cron call using Vault-held values.
4. Configure Vercel with root `aircare/web` and the public Supabase URL/anon key. Deploy a preview and verify live reads, magic-link auth, game posting, and mobile behavior.
5. Decide on push provider and implement subscriptions/delivery plus station-to-game proximity rules before enabling automatic red-AQI warnings.
6. Add production domain and launch monitoring/backups after preview validation.

## Deployment repository

- GitHub: https://github.com/isidoraovez/breathzone
- Vercel root directory: `aircare/web`.

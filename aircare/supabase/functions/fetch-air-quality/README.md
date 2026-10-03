# fetch-air-quality

Deploy with Supabase CLI (`supabase functions deploy fetch-air-quality --no-verify-jwt`). Configure these function secrets:

- `AIR_QUALITY_SOURCE_URL` — endpoint returning a JSON array like `[ { "station_name": "Centar", "aqi_index": 42, "pm25": 12.4, "pm10": 20.1, "recorded_at": "2026-10-03T12:00:00Z" } ]`.
- `AIR_QUALITY_API_TOKEN` — optional bearer token.
- `AIR_QUALITY_CRON_SECRET` — random secret used only by the scheduled caller in the `x-cron-secret` header.

Supabase provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to deployed functions. Configure invocation so platform JWT verification is disabled only if necessary for the scheduler, while retaining this function's independent cron-secret check. Never put the cron secret or service-role key in a browser or repository.

For hourly scheduling, enable the Supabase Cron and `pg_net` extensions, store the project URL and cron secret in Vault, then schedule an HTTP POST to `/functions/v1/fetch-air-quality` at minute 0 of every hour with `x-cron-secret` set from Vault. Keep this setup in the Supabase project; do not paste the secret into committed SQL or source files.

This adapter deliberately expects normalized data. WAQI, MoEPP, or another provider may have a different response structure; inspect the provider's official schema and terms, then add a tested provider-specific mapper before production use. It does not send notifications or move games.

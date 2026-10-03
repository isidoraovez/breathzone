# AirCare room instructions

## Project

AirCare (also referred to as Breathzone) is a Skopje air-quality-aware sports app. Intended architecture: Next.js App Router on Vercel; Supabase PostgreSQL/PostGIS, Auth, Realtime, and Edge Functions; AQI data from an approved provider; map-based outdoor/indoor sports spots; pickup games and air-quality alerts.

## Working rules

- Keep AirCare files in this room.
- Read the workspace root `AGENTS.md` and this room's `HANDOFF.md` before work.
- Never commit or expose service-role keys, API tokens, or other secrets. Use environment configuration and provide only a safe `.env.example`.
- Confirm provider terms and actual API response shape before implementing production ingestion.
- Update `HANDOFF.md` with progress, decisions, blockers, and concrete next steps at the end of a work session.

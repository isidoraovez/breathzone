-- AirCare initial schema. Run in a Supabase project with PostGIS available.
create extension if not exists postgis with schema extensions;

do $$ begin
  create type public.spot_type as enum ('outdoor', 'indoor');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public.sport_category as enum ('football', 'basketball', 'running', 'tennis', 'multi');
exception when duplicate_object then null; end $$;

create table if not exists public.spots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.spot_type not null,
  category public.sport_category not null,
  geom extensions.geography(point, 4326) not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  address text,
  indoor_alternative_id uuid references public.spots(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists spots_geom_gix on public.spots using gist (geom);

create table if not exists public.air_quality_logs (
  id uuid primary key default gen_random_uuid(),
  station_name text not null,
  pm25 numeric,
  pm10 numeric,
  aqi_index integer not null check (aqi_index >= 0),
  status text not null check (status in ('green', 'yellow', 'red')),
  recorded_at timestamptz not null default now()
);
create index if not exists air_quality_station_time_idx on public.air_quality_logs (station_name, recorded_at desc);

create table if not exists public.pickup_games (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid not null references public.spots(id) on delete cascade,
  organizer_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  category public.sport_category not null default 'multi',
  scheduled_time timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'moved_indoors', 'cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists pickup_games_scheduled_idx on public.pickup_games (scheduled_time) where status = 'scheduled';

alter table public.spots enable row level security;
alter table public.air_quality_logs enable row level security;
alter table public.pickup_games enable row level security;

drop policy if exists "Anyone can read spots" on public.spots;
create policy "Anyone can read spots" on public.spots for select using (true);
drop policy if exists "Anyone can read air quality" on public.air_quality_logs;
create policy "Anyone can read air quality" on public.air_quality_logs for select using (true);
drop policy if exists "Anyone can read scheduled games" on public.pickup_games;
create policy "Anyone can read scheduled games" on public.pickup_games for select using (true);
drop policy if exists "Signed-in users can create own games" on public.pickup_games;
create policy "Signed-in users can create own games" on public.pickup_games for insert to authenticated with check (organizer_id = (select auth.uid()));
drop policy if exists "Organizers can update own games" on public.pickup_games;
create policy "Organizers can update own games" on public.pickup_games for update to authenticated using (organizer_id = (select auth.uid())) with check (organizer_id = (select auth.uid()));
drop policy if exists "Organizers can delete own games" on public.pickup_games;
create policy "Organizers can delete own games" on public.pickup_games for delete to authenticated using (organizer_id = (select auth.uid()));

grant usage on schema public to anon, authenticated;
grant select on public.spots, public.air_quality_logs, public.pickup_games to anon, authenticated;
grant insert, update, delete on public.pickup_games to authenticated;

comment on table public.air_quality_logs is 'Provider readings normalized to AirCare AQI status bands; source provenance should be tracked before production use.';

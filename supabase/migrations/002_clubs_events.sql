create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.club_profiles(id) on delete cascade,
  title text not null,
  description text,
  cover_url text,
  date date not null,
  start_time time not null,
  end_time time,
  dj_lineup text[] not null default '{}',
  dress_code text,
  notoriety numeric(4,2) not null default 1.0 check (notoriety >= 1.0 and notoriety <= 2.5),
  is_auction boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','cancelled','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.floor_plans (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.club_profiles(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  name text not null,
  width integer not null default 1200,
  height integer not null default 800,
  layout_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, name)
);

create table if not exists public.tables (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.club_profiles(id) on delete cascade,
  floor_plan_id uuid references public.floor_plans(id) on delete set null,
  name text not null,
  zone text,
  capacity integer not null default 4 check (capacity > 0),
  base_price numeric(10,2) not null check (base_price >= 0),
  x_position numeric(10,2),
  y_position numeric(10,2),
  width numeric(10,2),
  height numeric(10,2),
  shape text not null default 'rect' check (shape in ('rect','round','custom')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, name)
);

create table if not exists public.event_tables (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  table_id uuid not null references public.tables(id) on delete cascade,
  status text not null default 'available' check (status in ('available','reserved','occupied','disabled','sold_out')),
  dynamic_price numeric(10,2),
  occupancy_rate numeric(5,2) not null default 0 check (occupancy_rate >= 0 and occupancy_rate <= 100),
  time_coefficient numeric(6,3) not null default 1.0,
  occupancy_coefficient numeric(6,3) not null default 1.0,
  notoriety_coefficient numeric(6,3) not null default 1.0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, table_id)
);

drop trigger if exists trg_events_set_updated_at on public.events;
create trigger trg_events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists trg_floor_plans_set_updated_at on public.floor_plans;
create trigger trg_floor_plans_set_updated_at
before update on public.floor_plans
for each row execute function public.set_updated_at();

drop trigger if exists trg_tables_set_updated_at on public.tables;
create trigger trg_tables_set_updated_at
before update on public.tables
for each row execute function public.set_updated_at();

drop trigger if exists trg_event_tables_set_updated_at on public.event_tables;
create trigger trg_event_tables_set_updated_at
before update on public.event_tables
for each row execute function public.set_updated_at();

alter table public.events enable row level security;
alter table public.floor_plans enable row level security;
alter table public.tables enable row level security;
alter table public.event_tables enable row level security;

drop policy if exists events_public_read on public.events;
create policy events_public_read on public.events
for select using (status = 'published');

drop policy if exists events_club_manage on public.events;
create policy events_club_manage on public.events
for all using (auth.uid() = club_id) with check (auth.uid() = club_id);

drop policy if exists floor_plans_club_manage on public.floor_plans;
create policy floor_plans_club_manage on public.floor_plans
for all using (auth.uid() = club_id) with check (auth.uid() = club_id);

drop policy if exists tables_public_read on public.tables;
create policy tables_public_read on public.tables
for select using (is_active = true);

drop policy if exists tables_club_manage on public.tables;
create policy tables_club_manage on public.tables
for all using (auth.uid() = club_id) with check (auth.uid() = club_id);

drop policy if exists event_tables_public_read on public.event_tables;
create policy event_tables_public_read on public.event_tables
for select using (true);

drop policy if exists event_tables_club_manage on public.event_tables;
create policy event_tables_club_manage on public.event_tables
for all
using (
  exists (
    select 1
    from public.events e
    where e.id = event_tables.event_id
      and e.club_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.events e
    where e.id = event_tables.event_id
      and e.club_id = auth.uid()
  )
);

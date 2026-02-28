create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  club_id uuid references public.club_profiles(id) on delete cascade not null,
  title text not null,
  description text,
  date date not null,
  start_time time not null,
  end_time time,
  dj_lineup text[],
  dress_code text,
  status text default 'draft' check (status in ('draft','published','cancelled','completed')),
  created_at timestamptz default now()
);

create table if not exists public.tables (
  id uuid default gen_random_uuid() primary key,
  club_id uuid references public.club_profiles(id) on delete cascade not null,
  name text not null,
  capacity integer not null default 4,
  base_price numeric(10,2) not null,
  zone text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.events enable row level security;
alter table public.tables enable row level security;

drop policy if exists "public_events_select" on public.events;
create policy "public_events_select" on public.events
  for select using (status = 'published');

drop policy if exists "club_events_manage" on public.events;
create policy "club_events_manage" on public.events
  for all using (auth.uid() = club_id) with check (auth.uid() = club_id);

drop policy if exists "club_tables_manage" on public.tables;
create policy "club_tables_manage" on public.tables
  for all using (auth.uid() = club_id) with check (auth.uid() = club_id);

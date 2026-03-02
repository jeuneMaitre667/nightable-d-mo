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

alter table public.tables
  add column if not exists x_position numeric(10,2),
  add column if not exists y_position numeric(10,2),
  add column if not exists width numeric(10,2),
  add column if not exists height numeric(10,2),
  add column if not exists shape text not null default 'rect' check (shape in ('rect','round','custom'));

alter table public.tables
  add column if not exists floor_plan_id uuid references public.floor_plans(id) on delete set null;

drop trigger if exists trg_floor_plans_set_updated_at on public.floor_plans;
create trigger trg_floor_plans_set_updated_at
before update on public.floor_plans
for each row execute function public.set_updated_at();

drop policy if exists floor_plans_club_manage on public.floor_plans;
alter table public.floor_plans enable row level security;

create policy floor_plans_club_manage on public.floor_plans
for all
using (auth.uid() = club_id)
with check (auth.uid() = club_id);

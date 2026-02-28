create table if not exists public.promoter_clicks (
  id uuid primary key default gen_random_uuid(),
  promoter_id uuid references public.promoter_profiles(id) on delete set null,
  promo_code text not null,
  session_id text,
  ip_hash text,
  user_agent text,
  source_url text,
  reservation_id uuid references public.reservations(id) on delete set null,
  converted boolean not null default false,
  clicked_at timestamptz not null default now()
);

create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  promoter_id uuid not null references public.promoter_profiles(id) on delete cascade,
  reservation_id uuid not null unique references public.reservations(id) on delete cascade,
  club_id uuid not null references public.club_profiles(id) on delete cascade,
  commission_rate numeric(5,2) not null default 8.00,
  nighttable_micro_rate numeric(5,2) not null default 1.50,
  base_amount numeric(10,2) not null,
  club_commission_amount numeric(10,2) not null,
  nighttable_commission_amount numeric(10,2) not null,
  total_commission_amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','validated','paid')),
  validated_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guest_lists (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  promoter_id uuid not null references public.promoter_profiles(id) on delete cascade,
  guest_name text not null,
  guest_phone text,
  status text not null default 'pending' check (status in ('pending','arrived','no_show')),
  notes text,
  added_at timestamptz not null default now(),
  arrived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_promoter_clicks_promoter on public.promoter_clicks(promoter_id);
create index if not exists idx_promoter_clicks_promo_code on public.promoter_clicks(promo_code);
create index if not exists idx_commissions_promoter on public.commissions(promoter_id);
create index if not exists idx_commissions_club on public.commissions(club_id);
create index if not exists idx_guest_lists_event on public.guest_lists(event_id);
create index if not exists idx_guest_lists_promoter on public.guest_lists(promoter_id);

drop trigger if exists trg_commissions_set_updated_at on public.commissions;
create trigger trg_commissions_set_updated_at
before update on public.commissions
for each row execute function public.set_updated_at();

drop trigger if exists trg_guest_lists_set_updated_at on public.guest_lists;
create trigger trg_guest_lists_set_updated_at
before update on public.guest_lists
for each row execute function public.set_updated_at();

alter table public.promoter_clicks enable row level security;
alter table public.commissions enable row level security;
alter table public.guest_lists enable row level security;

drop policy if exists promoter_clicks_insert_any on public.promoter_clicks;
create policy promoter_clicks_insert_any on public.promoter_clicks
for insert with check (true);

drop policy if exists promoter_clicks_select_own on public.promoter_clicks;
create policy promoter_clicks_select_own on public.promoter_clicks
for select
using (
  promoter_id is not null
  and exists (
    select 1
    from public.promoter_profiles pp
    where pp.id = promoter_clicks.promoter_id
      and (pp.id = auth.uid() or pp.club_id = auth.uid())
  )
);

drop policy if exists commissions_promoter_read on public.commissions;
create policy commissions_promoter_read on public.commissions
for select using (auth.uid() = promoter_id);

drop policy if exists commissions_club_manage on public.commissions;
create policy commissions_club_manage on public.commissions
for all using (auth.uid() = club_id) with check (auth.uid() = club_id);

drop policy if exists guest_lists_promoter_manage on public.guest_lists;
create policy guest_lists_promoter_manage on public.guest_lists
for all using (auth.uid() = promoter_id) with check (auth.uid() = promoter_id);

drop policy if exists guest_lists_club_read on public.guest_lists;
create policy guest_lists_club_read on public.guest_lists
for select
using (
  exists (
    select 1
    from public.events e
    where e.id = guest_lists.event_id
      and e.club_id = auth.uid()
  )
);

create table if not exists public.promoter_clicks (
  id uuid default gen_random_uuid() primary key,
  promo_code text not null,
  ip_hash text,
  converted boolean default false,
  clicked_at timestamptz default now()
);

create table if not exists public.guest_lists (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  promoter_id uuid references public.promoter_profiles(id) on delete cascade not null,
  guest_name text not null,
  guest_phone text,
  status text default 'pending' check (status in ('pending','arrived','no_show')),
  added_at timestamptz default now(),
  arrived_at timestamptz
);

alter table public.promoter_clicks enable row level security;
alter table public.guest_lists enable row level security;

drop policy if exists "promoter_own_guestlist_select" on public.guest_lists;
create policy "promoter_own_guestlist_select" on public.guest_lists
  for select using (auth.uid() = promoter_id);

drop policy if exists "promoter_own_guestlist_insert" on public.guest_lists;
create policy "promoter_own_guestlist_insert" on public.guest_lists
  for insert with check (auth.uid() = promoter_id);

drop policy if exists "promoter_own_guestlist_update" on public.guest_lists;
create policy "promoter_own_guestlist_update" on public.guest_lists
  for update using (auth.uid() = promoter_id);

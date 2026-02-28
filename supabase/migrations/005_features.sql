alter table public.events
  add column if not exists is_auction boolean not null default false;

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

create table if not exists public.vip_invitations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  inviter_client_id uuid not null references public.client_profiles(id) on delete cascade,
  female_vip_id uuid not null references public.female_vip_profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined','cancelled','expired')),
  message text,
  invited_at timestamptz not null default now(),
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, inviter_client_id, female_vip_id)
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete set null,
  from_user_id uuid not null references public.profiles(id) on delete cascade,
  to_user_id uuid not null references public.profiles(id) on delete cascade,
  stars integer not null check (stars between 1 and 5),
  comment text,
  visibility text not null default 'admin_only' check (visibility in ('admin_only','club_only','private')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, from_user_id, to_user_id)
);

create table if not exists public.special_packages (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.club_profiles(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  title text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  max_quantity integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.auction_bids (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  event_table_id uuid not null references public.event_tables(id) on delete cascade,
  bidder_client_id uuid not null references public.client_profiles(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  status text not null default 'active' check (status in ('active','winning','lost','cancelled')),
  placed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vip_invitations_event on public.vip_invitations(event_id);
create index if not exists idx_ratings_to_user on public.ratings(to_user_id);
create index if not exists idx_special_packages_club on public.special_packages(club_id);
create index if not exists idx_auction_bids_event_table on public.auction_bids(event_table_id, amount desc);

create or replace function public.validate_auction_bid()
returns trigger
language plpgsql
as $$
declare
  base_price numeric(10,2);
  event_is_auction boolean;
  top_bid numeric(10,2);
begin
  select t.base_price, e.is_auction
  into base_price, event_is_auction
  from public.event_tables et
  join public.tables t on t.id = et.table_id
  join public.events e on e.id = et.event_id
  where et.id = new.event_table_id
    and e.id = new.event_id;

  if event_is_auction is distinct from true then
    raise exception 'INSUFFICIENT_TIER';
  end if;

  if mod(new.amount, 25) <> 0 then
    raise exception 'Bid increment must be 25';
  end if;

  if new.amount < base_price then
    raise exception 'Bid must be >= base price';
  end if;

  select max(ab.amount)
  into top_bid
  from public.auction_bids ab
  where ab.event_table_id = new.event_table_id
    and ab.status in ('active','winning');

  if top_bid is not null and new.amount < top_bid + 25 then
    raise exception 'Bid increment too low';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_auction_bids_validate on public.auction_bids;
create trigger trg_auction_bids_validate
before insert on public.auction_bids
for each row execute function public.validate_auction_bid();

drop trigger if exists trg_vip_invitations_set_updated_at on public.vip_invitations;
create trigger trg_vip_invitations_set_updated_at
before update on public.vip_invitations
for each row execute function public.set_updated_at();

drop trigger if exists trg_ratings_set_updated_at on public.ratings;
create trigger trg_ratings_set_updated_at
before update on public.ratings
for each row execute function public.set_updated_at();

drop trigger if exists trg_special_packages_set_updated_at on public.special_packages;
create trigger trg_special_packages_set_updated_at
before update on public.special_packages
for each row execute function public.set_updated_at();

drop trigger if exists trg_commissions_set_updated_at on public.commissions;
create trigger trg_commissions_set_updated_at
before update on public.commissions
for each row execute function public.set_updated_at();

drop trigger if exists trg_auction_bids_set_updated_at on public.auction_bids;
create trigger trg_auction_bids_set_updated_at
before update on public.auction_bids
for each row execute function public.set_updated_at();

alter table public.vip_invitations enable row level security;
alter table public.ratings enable row level security;
alter table public.special_packages enable row level security;
alter table public.auction_bids enable row level security;
alter table public.commissions enable row level security;

drop policy if exists vip_invitations_inviter_manage on public.vip_invitations;
create policy vip_invitations_inviter_manage on public.vip_invitations
for all using (auth.uid() = inviter_client_id) with check (auth.uid() = inviter_client_id);

drop policy if exists vip_invitations_female_vip_read on public.vip_invitations;
create policy vip_invitations_female_vip_read on public.vip_invitations
for select using (auth.uid() = female_vip_id);

drop policy if exists ratings_writer_manage on public.ratings;
create policy ratings_writer_manage on public.ratings
for all using (auth.uid() = from_user_id) with check (auth.uid() = from_user_id);

drop policy if exists special_packages_club_manage on public.special_packages;
create policy special_packages_club_manage on public.special_packages
for all using (auth.uid() = club_id) with check (auth.uid() = club_id);

drop policy if exists special_packages_public_read on public.special_packages;
create policy special_packages_public_read on public.special_packages
for select using (is_active = true);

drop policy if exists commissions_promoter_read on public.commissions;
create policy commissions_promoter_read on public.commissions
for select using (auth.uid() = promoter_id);

drop policy if exists commissions_club_manage on public.commissions;
create policy commissions_club_manage on public.commissions
for all using (auth.uid() = club_id) with check (auth.uid() = club_id);

drop policy if exists auction_bids_client_manage on public.auction_bids;
create policy auction_bids_client_manage on public.auction_bids
for all using (auth.uid() = bidder_client_id) with check (auth.uid() = bidder_client_id);

drop policy if exists auction_bids_club_read on public.auction_bids;
create policy auction_bids_club_read on public.auction_bids
for select
using (
  exists (
    select 1
    from public.events e
    where e.id = auction_bids.event_id
      and e.club_id = auth.uid()
  )
);

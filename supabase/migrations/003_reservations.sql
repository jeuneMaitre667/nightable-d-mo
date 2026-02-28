create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  event_table_id uuid not null references public.event_tables(id) on delete restrict,
  promoter_id uuid references public.promoter_profiles(id) on delete set null,
  promo_code_used text,
  status text not null default 'pending' check (status in ('pending','payment_pending','reserved','confirmed','checked_in','cancelled','no_show','refunded')),
  minimum_consumption numeric(10,2) not null check (minimum_consumption >= 0),
  dynamic_price_at_booking numeric(10,2) not null check (dynamic_price_at_booking >= 0),
  prepayment_percent numeric(5,2) not null check (prepayment_percent >= 30 and prepayment_percent <= 50),
  prepayment_amount numeric(10,2) not null check (prepayment_amount >= 0),
  insurance_purchased boolean not null default false,
  insurance_price numeric(10,2) not null default 0 check (insurance_price in (0,3,4,5)),
  stripe_payment_intent_id text,
  paid_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  event_starts_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, event_table_id, status)
    deferrable initially immediate
);

create index if not exists idx_reservations_client_id on public.reservations(client_id);
create index if not exists idx_reservations_event_id on public.reservations(event_id);
create index if not exists idx_reservations_event_table_id on public.reservations(event_table_id);
create unique index if not exists uq_reservations_payment_intent on public.reservations(stripe_payment_intent_id)
where stripe_payment_intent_id is not null;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  event_table_id uuid references public.event_tables(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','notified','accepted','expired','cancelled')),
  position integer,
  notified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, event_id, event_table_id)
);

create table if not exists public.resales (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null unique references public.reservations(id) on delete cascade,
  seller_client_id uuid not null references public.client_profiles(id) on delete cascade,
  buyer_client_id uuid references public.client_profiles(id) on delete set null,
  resale_price numeric(10,2) not null check (resale_price >= 0),
  nighttable_commission_rate numeric(5,2) not null default 5.00,
  nighttable_commission_amount numeric(10,2),
  seller_net_amount numeric(10,2),
  status text not null default 'listed' check (status in ('listed','sold','cancelled','expired')),
  listed_at timestamptz not null default now(),
  sold_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.reservations_before_insert()
returns trigger
language plpgsql
as $$
declare
  current_table_status text;
begin
  select et.status
  into current_table_status
  from public.event_tables et
  where et.id = new.event_table_id
    and et.event_id = new.event_id;

  if current_table_status is null then
    raise exception 'EVENT_TABLE_NOT_FOUND';
  end if;

  if current_table_status <> 'available' then
    raise exception 'RESERVATION_CONFLICT';
  end if;

  return new;
end;
$$;

create or replace function public.reservations_after_status_change()
returns trigger
language plpgsql
as $$
begin
  if new.status in ('reserved', 'confirmed', 'checked_in') then
    update public.event_tables
      set status = 'reserved',
          updated_at = now()
    where id = new.event_table_id;
  elsif new.status in ('cancelled', 'expired', 'refunded') then
    update public.event_tables
      set status = 'available',
          updated_at = now()
    where id = new.event_table_id;
  elsif new.status = 'no_show' then
    update public.event_tables
      set status = 'occupied',
          updated_at = now()
    where id = new.event_table_id;
  end if;

  return new;
end;
$$;

create or replace function public.waitlist_set_position()
returns trigger
language plpgsql
as $$
declare
  next_pos integer;
begin
  select coalesce(max(w.position), 0) + 1
  into next_pos
  from public.waitlist w
  where w.event_id = new.event_id
    and ((w.event_table_id is null and new.event_table_id is null) or w.event_table_id = new.event_table_id)
    and w.status in ('pending','notified');

  if next_pos > 20 then
    raise exception 'WAITLIST_FULL';
  end if;

  new.position := next_pos;
  return new;
end;
$$;

drop trigger if exists trg_reservations_before_insert on public.reservations;
create trigger trg_reservations_before_insert
before insert on public.reservations
for each row execute function public.reservations_before_insert();

drop trigger if exists trg_reservations_after_status_change on public.reservations;
create trigger trg_reservations_after_status_change
after insert or update of status on public.reservations
for each row execute function public.reservations_after_status_change();

drop trigger if exists trg_waitlist_set_position on public.waitlist;
create trigger trg_waitlist_set_position
before insert on public.waitlist
for each row execute function public.waitlist_set_position();

drop trigger if exists trg_reservations_set_updated_at on public.reservations;
create trigger trg_reservations_set_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();

drop trigger if exists trg_waitlist_set_updated_at on public.waitlist;
create trigger trg_waitlist_set_updated_at
before update on public.waitlist
for each row execute function public.set_updated_at();

drop trigger if exists trg_resales_set_updated_at on public.resales;
create trigger trg_resales_set_updated_at
before update on public.resales
for each row execute function public.set_updated_at();

alter table public.reservations enable row level security;
alter table public.waitlist enable row level security;
alter table public.resales enable row level security;

drop policy if exists reservations_client_read on public.reservations;
create policy reservations_client_read on public.reservations
for select using (auth.uid() = client_id);

drop policy if exists reservations_client_create on public.reservations;
create policy reservations_client_create on public.reservations
for insert with check (auth.uid() = client_id);

drop policy if exists reservations_client_update on public.reservations;
create policy reservations_client_update on public.reservations
for update using (auth.uid() = client_id) with check (auth.uid() = client_id);

drop policy if exists reservations_club_read on public.reservations;
create policy reservations_club_read on public.reservations
for select
using (
  exists (
    select 1
    from public.events e
    where e.id = reservations.event_id
      and e.club_id = auth.uid()
  )
);

drop policy if exists waitlist_client_manage on public.waitlist;
create policy waitlist_client_manage on public.waitlist
for all using (auth.uid() = client_id) with check (auth.uid() = client_id);

drop policy if exists waitlist_club_read on public.waitlist;
create policy waitlist_club_read on public.waitlist
for select
using (
  exists (
    select 1
    from public.events e
    where e.id = waitlist.event_id
      and e.club_id = auth.uid()
  )
);

drop policy if exists resales_seller_manage on public.resales;
create policy resales_seller_manage on public.resales
for all using (auth.uid() = seller_client_id) with check (auth.uid() = seller_client_id);

drop policy if exists resales_club_read on public.resales;
create policy resales_club_read on public.resales
for select
using (
  exists (
    select 1
    from public.reservations r
    join public.events e on e.id = r.event_id
    where r.id = resales.reservation_id
      and e.club_id = auth.uid()
  )
);

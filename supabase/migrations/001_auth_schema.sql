create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('client','club','promoter','female_vip','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  is_premium boolean not null default false,
  loyalty_points integer not null default 0,
  nighttable_score numeric(5,2) not null default 50.00,
  reliability_score numeric(4,2) not null default 5.00,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.club_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  club_name text,
  slug text unique,
  description text,
  address text,
  city text not null default 'Paris',
  phone text,
  website text,
  instagram_handle text,
  logo_url text,
  cover_url text,
  subscription_tier text not null default 'starter' check (subscription_tier in ('starter','pro','premium')),
  subscription_active boolean not null default false,
  stripe_customer_id text,
  api_key text unique,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promoter_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  instagram_handle text,
  promo_code text unique,
  club_id uuid references public.club_profiles(id) on delete set null,
  commission_rate numeric(5,2) not null default 8.00,
  total_earned numeric(12,2) not null default 0,
  total_paid numeric(12,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.female_vip_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  instagram_handle text,
  validation_status text not null default 'pending' check (validation_status in ('pending','validated','rejected')),
  validated_clubs uuid[] not null default '{}',
  validated_at timestamptz,
  rgpd_consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_set_updated_at on public.profiles;
create trigger trg_profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_client_profiles_set_updated_at on public.client_profiles;
create trigger trg_client_profiles_set_updated_at
before update on public.client_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_club_profiles_set_updated_at on public.club_profiles;
create trigger trg_club_profiles_set_updated_at
before update on public.club_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_promoter_profiles_set_updated_at on public.promoter_profiles;
create trigger trg_promoter_profiles_set_updated_at
before update on public.promoter_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_female_vip_profiles_set_updated_at on public.female_vip_profiles;
create trigger trg_female_vip_profiles_set_updated_at
before update on public.female_vip_profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_role text;
begin
  normalized_role := coalesce(new.raw_user_meta_data->>'role', 'client');

  if normalized_role not in ('client', 'club', 'promoter', 'female_vip', 'admin') then
    normalized_role := 'client';
  end if;

  insert into public.profiles (id, email, role)
  values (new.id, new.email, normalized_role)
  on conflict (id) do update
    set email = excluded.email,
        role = excluded.role,
        updated_at = now();

  if normalized_role = 'client' then
    insert into public.client_profiles (id)
    values (new.id)
    on conflict (id) do nothing;
  elsif normalized_role = 'club' then
    insert into public.club_profiles (id)
    values (new.id)
    on conflict (id) do nothing;
  elsif normalized_role = 'promoter' then
    insert into public.promoter_profiles (id)
    values (new.id)
    on conflict (id) do nothing;
  elsif normalized_role = 'female_vip' then
    insert into public.female_vip_profiles (id)
    values (new.id)
    on conflict (id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.client_profiles enable row level security;
alter table public.club_profiles enable row level security;
alter table public.promoter_profiles enable row level security;
alter table public.female_vip_profiles enable row level security;

drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles
for select using (auth.uid() = id);

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists client_profiles_self_select on public.client_profiles;
create policy client_profiles_self_select on public.client_profiles
for select using (auth.uid() = id);

drop policy if exists client_profiles_self_update on public.client_profiles;
create policy client_profiles_self_update on public.client_profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists club_profiles_self_select on public.club_profiles;
create policy club_profiles_self_select on public.club_profiles
for select using (auth.uid() = id);

drop policy if exists club_profiles_self_update on public.club_profiles;
create policy club_profiles_self_update on public.club_profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists promoter_profiles_self_select on public.promoter_profiles;
create policy promoter_profiles_self_select on public.promoter_profiles
for select using (auth.uid() = id);

drop policy if exists promoter_profiles_self_update on public.promoter_profiles;
create policy promoter_profiles_self_update on public.promoter_profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists female_vip_profiles_self_select on public.female_vip_profiles;
create policy female_vip_profiles_self_select on public.female_vip_profiles
for select using (auth.uid() = id);

drop policy if exists female_vip_profiles_self_update on public.female_vip_profiles;
create policy female_vip_profiles_self_update on public.female_vip_profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

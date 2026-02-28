create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  role text not null check (role in ('client','club','promoter','female_vip','admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.client_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  is_premium boolean default false,
  loyalty_points integer default 0,
  nighttable_score numeric(4,1) default 50.0,
  reliability_score numeric(3,2) default 5.0,
  created_at timestamptz default now()
);

create table if not exists public.club_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  club_name text,
  slug text unique,
  description text,
  address text,
  city text default 'Paris',
  phone text,
  website text,
  instagram_handle text,
  logo_url text,
  cover_url text,
  subscription_tier text default 'starter' check (subscription_tier in ('starter','pro','premium')),
  subscription_active boolean default false,
  stripe_customer_id text,
  is_verified boolean default false,
  api_key text unique,
  created_at timestamptz default now()
);

create table if not exists public.promoter_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  first_name text,
  last_name text,
  phone text,
  instagram_handle text,
  promo_code text unique,
  club_id uuid references public.club_profiles(id),
  commission_rate numeric(4,2) default 8.00,
  total_earned numeric(10,2) default 0,
  total_paid numeric(10,2) default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.female_vip_profiles (
  id uuid references public.profiles(id) on delete cascade primary key,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  instagram_handle text,
  validation_status text default 'pending' check (validation_status in ('pending','validated','rejected')),
  validated_clubs uuid[],
  validated_at timestamptz,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'role','client'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.client_profiles enable row level security;
alter table public.club_profiles enable row level security;
alter table public.promoter_profiles enable row level security;
alter table public.female_vip_profiles enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

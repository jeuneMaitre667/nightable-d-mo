create table if not exists public.vip_invitations (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  vip_id uuid not null references public.female_vip_profiles(id) on delete cascade,
  invited_by uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.vip_invitations
  add column if not exists reservation_id uuid references public.reservations(id) on delete cascade,
  add column if not exists vip_id uuid references public.female_vip_profiles(id) on delete cascade,
  add column if not exists invited_by uuid references public.profiles(id) on delete cascade,
  add column if not exists responded_at timestamptz,
  add column if not exists created_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'vip_invitations'
      and column_name = 'female_vip_id'
  ) then
    execute 'update public.vip_invitations set vip_id = female_vip_id where vip_id is null';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'vip_invitations'
      and column_name = 'inviter_client_id'
  ) then
    execute 'update public.vip_invitations set invited_by = inviter_client_id where invited_by is null';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'vip_invitations'
      and column_name = 'invited_at'
  ) then
    execute 'update public.vip_invitations set created_at = coalesce(created_at, invited_at)';
  end if;
end $$;

update public.vip_invitations
set status = 'declined'
where status not in ('pending','accepted','declined');

do $$
declare
  existing_constraint record;
begin
  for existing_constraint in
    select conname
    from pg_constraint
    where conrelid = 'public.vip_invitations'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.vip_invitations drop constraint %I', existing_constraint.conname);
  end loop;
end $$;

alter table public.vip_invitations
  add constraint vip_invitations_status_check
  check (status in ('pending','accepted','declined'));

create unique index if not exists uq_vip_invitations_reservation_vip
on public.vip_invitations(reservation_id, vip_id);

create index if not exists idx_vip_invitations_vip_id
on public.vip_invitations(vip_id);

create index if not exists idx_vip_invitations_invited_by
on public.vip_invitations(invited_by);

create table if not exists public.vip_safety_checkins (
  id uuid primary key default gen_random_uuid(),
  vip_id uuid not null references public.female_vip_profiles(id) on delete cascade,
  reservation_id uuid references public.reservations(id) on delete set null,
  checkin_type text not null check (checkin_type in ('arrived','departed')),
  emergency_contact_notified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_vip_safety_checkins_vip_created
on public.vip_safety_checkins(vip_id, created_at desc);

alter table public.female_vip_profiles
  add column if not exists emergency_contact_name text,
  add column if not exists emergency_contact_phone text;

alter table public.vip_invitations enable row level security;
alter table public.vip_safety_checkins enable row level security;

drop policy if exists vip_invitations_vip_manage on public.vip_invitations;
create policy vip_invitations_vip_manage on public.vip_invitations
for all
using (vip_id = auth.uid())
with check (vip_id = auth.uid());

drop policy if exists vip_invitations_club_manage on public.vip_invitations;
create policy vip_invitations_club_manage on public.vip_invitations
for all
using (
  exists (
    select 1
    from public.reservations r
    join public.events e on e.id = r.event_id
    where r.id = vip_invitations.reservation_id
      and e.club_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.reservations r
    join public.events e on e.id = r.event_id
    where r.id = vip_invitations.reservation_id
      and e.club_id = auth.uid()
  )
);

drop policy if exists vip_invitations_promoter_manage on public.vip_invitations;
create policy vip_invitations_promoter_manage on public.vip_invitations
for all
using (
  invited_by = auth.uid()
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'promoter'
  )
)
with check (
  invited_by = auth.uid()
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'promoter'
  )
);

drop policy if exists vip_safety_checkins_vip_manage on public.vip_safety_checkins;
create policy vip_safety_checkins_vip_manage on public.vip_safety_checkins
for all
using (vip_id = auth.uid())
with check (vip_id = auth.uid());

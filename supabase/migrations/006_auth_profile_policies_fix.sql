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

drop policy if exists profiles_self_insert on public.profiles;
create policy profiles_self_insert on public.profiles
for insert with check (auth.uid() = id);

drop policy if exists user_insert_own_profile on public.client_profiles;
create policy user_insert_own_profile on public.client_profiles
for insert with check (auth.uid() = id);

drop policy if exists club_profiles_self_insert on public.club_profiles;
create policy club_profiles_self_insert on public.club_profiles
for insert with check (auth.uid() = id);

drop policy if exists promoter_profiles_self_insert on public.promoter_profiles;
create policy promoter_profiles_self_insert on public.promoter_profiles
for insert with check (auth.uid() = id);

drop policy if exists female_vip_profiles_self_insert on public.female_vip_profiles;
create policy female_vip_profiles_self_insert on public.female_vip_profiles
for insert with check (auth.uid() = id);

insert into public.client_profiles (id)
select p.id
from public.profiles p
left join public.client_profiles cp on cp.id = p.id
where p.role = 'client' and cp.id is null;

insert into public.club_profiles (id)
select p.id
from public.profiles p
left join public.club_profiles cp on cp.id = p.id
where p.role = 'club' and cp.id is null;

insert into public.promoter_profiles (id)
select p.id
from public.profiles p
left join public.promoter_profiles pp on pp.id = p.id
where p.role = 'promoter' and pp.id is null;

insert into public.female_vip_profiles (id)
select p.id
from public.profiles p
left join public.female_vip_profiles fvp on fvp.id = p.id
where p.role = 'female_vip' and fvp.id is null;

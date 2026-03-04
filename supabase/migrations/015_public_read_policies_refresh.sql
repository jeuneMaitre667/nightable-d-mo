drop policy if exists club_profiles_public_read on public.club_profiles;
create policy club_profiles_public_read on public.club_profiles
for select
to anon, authenticated
using (
  is_verified = true
  and subscription_active = true
  and slug is not null
);

drop policy if exists events_public_read on public.events;
create policy events_public_read on public.events
for select
to anon, authenticated
using (status = 'published');

drop policy if exists tables_public_read on public.tables;
create policy tables_public_read on public.tables
for select
to anon, authenticated
using (is_active = true);

drop policy if exists event_tables_public_read on public.event_tables;
create policy event_tables_public_read on public.event_tables
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.events e
    where e.id = event_tables.event_id
      and e.status = 'published'
  )
);
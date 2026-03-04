alter table public.club_profiles enable row level security;

drop policy if exists club_profiles_public_read on public.club_profiles;
create policy club_profiles_public_read on public.club_profiles
for select
using (
  is_verified = true
  and subscription_active = true
  and slug is not null
);
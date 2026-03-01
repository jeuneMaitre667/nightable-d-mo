alter table public.events
  add column if not exists is_vip_promo_active boolean not null default false;

alter table public.tables
  add column if not exists is_promo boolean not null default false;

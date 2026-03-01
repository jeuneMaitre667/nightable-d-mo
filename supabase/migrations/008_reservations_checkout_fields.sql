alter table public.reservations
  add column if not exists qr_code text,
  add column if not exists guests_count integer,
  add column if not exists special_requests text,
  add column if not exists contact_phone text,
  add column if not exists client_first_name text,
  add column if not exists client_last_name text;

create unique index if not exists uq_reservations_qr_code
on public.reservations(qr_code)
where qr_code is not null;

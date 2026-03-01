create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  status text not null default 'processing' check (status in ('processing', 'processed', 'failed')),
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  last_error text
);

create index if not exists idx_stripe_webhook_events_status_received_at
on public.stripe_webhook_events(status, received_at desc);

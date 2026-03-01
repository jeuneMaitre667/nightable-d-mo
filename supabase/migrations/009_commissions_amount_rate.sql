alter table public.commissions
  add column if not exists amount numeric(10,2),
  add column if not exists rate numeric(5,2);

update public.commissions
set
  amount = coalesce(amount, total_commission_amount),
  rate = coalesce(rate, commission_rate)
where amount is null
   or rate is null;

alter table public.commissions
  alter column amount set not null,
  alter column rate set not null;

create index if not exists idx_commissions_promoter_created_at
on public.commissions(promoter_id, created_at desc);

create index if not exists idx_commissions_status
on public.commissions(status);

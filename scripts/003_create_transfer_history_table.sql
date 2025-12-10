-- Create transfer_history table to track gold ownership transfers
create table if not exists public.transfer_history (
  id uuid primary key default gen_random_uuid(),
  gold_item_id uuid not null references public.gold_items(id) on delete cascade,
  from_wallet text not null,
  to_wallet text not null,
  transfer_date timestamp with time zone default now(),
  transaction_hash text not null,
  verified boolean default false
);

-- Enable RLS
alter table public.transfer_history enable row level security;

-- Policies for transfer_history - users can view transfers involving their wallet
create policy "Users can view their transfer history"
  on public.transfer_history for select
  using (
    from_wallet = current_setting('app.current_wallet', true) OR 
    to_wallet = current_setting('app.current_wallet', true)
  );

create policy "Users can insert transfer records"
  on public.transfer_history for insert
  with check (from_wallet = current_setting('app.current_wallet', true));

-- Create index for faster queries
create index if not exists idx_transfers_from on public.transfer_history(from_wallet);
create index if not exists idx_transfers_to on public.transfer_history(to_wallet);
create index if not exists idx_transfers_gold_item on public.transfer_history(gold_item_id);

-- Create gold_items table to store user's gold collection
create table if not exists public.gold_items (
  id uuid primary key default gen_random_uuid(),
  owner_wallet text not null references public.users(wallet_address) on delete cascade,
  serial_number text unique not null,
  weight_grams decimal not null,
  purity text not null,
  distributor text not null,
  image_url text,
  minted_date date not null,
  blockchain_hash text not null,
  certificate_id text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.gold_items enable row level security;

-- Policies for gold_items table
create policy "Users can view their own gold items"
  on public.gold_items for select
  using (owner_wallet = current_setting('app.current_wallet', true));

create policy "Users can insert their own gold items"
  on public.gold_items for insert
  with check (owner_wallet = current_setting('app.current_wallet', true));

create policy "Users can update their own gold items"
  on public.gold_items for update
  using (owner_wallet = current_setting('app.current_wallet', true));

create policy "Users can delete their own gold items"
  on public.gold_items for delete
  using (owner_wallet = current_setting('app.current_wallet', true));

-- Create index for faster queries
create index if not exists idx_gold_items_owner on public.gold_items(owner_wallet);
create index if not exists idx_gold_items_serial on public.gold_items(serial_number);

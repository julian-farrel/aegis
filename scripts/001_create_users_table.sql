-- Create users table to store wallet addresses
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  wallet_address text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies for users table
create policy "Users can view their own data"
  on public.users for select
  using (wallet_address = current_setting('app.current_wallet', true));

create policy "Users can insert their own data"
  on public.users for insert
  with check (wallet_address = current_setting('app.current_wallet', true));

create policy "Users can update their own data"
  on public.users for update
  using (wallet_address = current_setting('app.current_wallet', true));

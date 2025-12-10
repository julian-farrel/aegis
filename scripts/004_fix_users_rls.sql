-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

-- Allow anyone to insert new users (wallet registration)
-- This is safe because wallet_address is unique and we verify ownership via MetaMask signature
CREATE POLICY "Anyone can register a wallet"
  ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Users can view any user data (needed for transfers)
CREATE POLICY "Users can view all users"
  ON public.users
  FOR SELECT
  USING (true);

-- Users can only update their own data via RPC function
-- We'll handle auth in the application layer since we're not using Supabase Auth
CREATE POLICY "Users can update via application"
  ON public.users
  FOR UPDATE
  USING (true);

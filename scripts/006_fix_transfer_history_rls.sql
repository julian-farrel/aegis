-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their transfer history" ON public.transfer_history;
DROP POLICY IF EXISTS "Users can insert transfer records" ON public.transfer_history;

-- Allow anyone to view transfer history (for transparency)
CREATE POLICY "Anyone can view transfers"
  ON public.transfer_history
  FOR SELECT
  USING (true);

-- Allow anyone to insert transfers (application verifies wallet signatures)
CREATE POLICY "Anyone can insert transfers"
  ON public.transfer_history
  FOR INSERT
  WITH CHECK (true);
